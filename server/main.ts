import * as express from 'express';
import * as compression from 'compression';
import * as userAgent from 'express-useragent';
import * as mongoose from 'mongoose';
import apiRoutes from './api/routes';
import { ValidationError } from './api/validate';
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
    const info = userAgent.parse(req.header('user-agent'));
    if (info.isIE && +info.version < 10) {
        res.redirect('http://www.whatbrowser.org/');
    } else {
        next();
    }
});

// Register API routes
app.use('/api', apiRoutes);

app.use(express.static(__dirname + '/../dist'));

app.all('/*', (req, res, next) => {
    // Just send the index.html for other paths to support HTML5Mode in angular
    let options = { maxAge: 0, root: __dirname + '/../dist' };

    res.sendFile('index.html', options);
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ValidationError)
        return res.status(err.status).json(err);

    if (process.env.NODE_ENV === 'development')
        return res.status(500).send(err.stack);
    else
        return res.status(500);
})

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('Server listening at http://%s:%s', server.address().address, server.address().port);
});
