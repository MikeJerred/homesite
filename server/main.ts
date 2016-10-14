import * as fs from 'fs';
import * as express from 'express';
import * as compression from 'compression';
import * as userAgent from 'express-useragent';
import * as  mongoose from 'mongoose';
import apiRoutes from './api/routes';
import * as validation from './api/validate';
require('dotenv').config();

const app = express();
app.use(compression());

const cacheAge = process.env.NODE_ENV === 'development' ? 0 : '10 years';
mongoose.connect(process.env.MONGODB_URI, {
    server: {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 3000
        //socketOptions: { keepAlive: 120 }
    }
});
(<any>mongoose).Promise = global.Promise;

app.all('/*', (req, res, next) => {
    let info = userAgent.parse(req.headers['user-agent']);
    if (info.isIE && +info.version < 10) {
        res.redirect('http://www.whatbrowser.org/');
    } else {
        next();
    }
});

app.use('/images', express.static(__dirname + '/wwwroot/images', { maxAge: cacheAge }));
app.all(/^\/?(styles|scripts)\.[a-zA-Z0-9]*\.(js|css)$/, (req, res, next) => {
    res.sendFile(req.url, { root: __dirname + '/wwwroot', maxAge: cacheAge });
});
app.use(express.static(__dirname + '/wwwroot', { maxAge: 0 }));

// Register API routes
app.use('/api', apiRoutes);

app.all('/*', (req, res, next) => {
    // Just send the index.html for other paths to support HTML5Mode in angular
    let page: string = req.params[0];
    let options = { maxAge: 0, root: __dirname + '/wwwroot' };
    if (page === 'home') {
        if (fs.existsSync(__dirname + '/wwwroot/index-home.html')) {
            res.sendFile('index-home.html', options);
            return;
        }
    } else if (page === 'blogs') {
        if (fs.existsSync(__dirname + '/wwwroot/index-blogs.html')) {
            res.sendFile('index-blogs.html', options);
            return;
        }
    } else if (page.startsWith('blog/')) {
        // inject the style for background-image
        let id = page.substring(5);
        if (fs.existsSync(__dirname + '/wwwroot/rev-manifest.json')
            && fs.existsSync(__dirname + '/wwwroot/index-blog.html')) {

            const revManifest = require('./wwwroot/rev-manifest.json');
            let image = revManifest['images/blog-'+id+'.jpg'];

            let file = fs.readFileSync(__dirname + '/wwwroot/index-blog.html').toString().replace(
                /<\/head>/g,
                '<style>article.critical-path .image{background-image:url(/'+image+');}</style></head>');

            res.set('Content-Type', 'text/html');
            res.set('Cache-Control', 'public, max-age=0');
            res.send(file);
            return;
        }
    } else if (page === 'not-found') {
        if (fs.existsSync(__dirname + '/wwwroot/index-not-found.html')) {
            res.sendFile('index-not-found.html', options);
            return;
        }
    }

    res.sendFile('index.html', options);
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof validation.ValidationError)
        return res.status(err.status).json(err);

    if (process.env.NODE_ENV === 'development')
        return res.status(500).send(err.stack);
    else
        return res.status(500);
})

if (module === require.main) {
    const server = app.listen(process.env.PORT || 8080, () => {
        console.log('Server listening at http://%s:%s', server.address().address, server.address().port);
    });
}

export default app;
