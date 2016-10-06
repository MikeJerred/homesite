import * as express from 'express';
import * as mongoose from 'mongoose';
import * as send from 'send';
import apiRoutes from './api/routes';
import * as validation from './api/validate';
require('dotenv').config();

const app = express();
mongoose.connect(process.env.MONGODB_URI, {
    server: {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 3000
        //socketOptions: { keepAlive: 120 }
    }
});
mongoose.Promise = global.Promise;

app.get(/^\/?(index.html)?$/, (req, res) => {
    send(req, '/index.html', { maxAge: 0, root: __dirname + '/wwwroot' }).pipe(res);
})

app.use(express.static(__dirname + '/wwwroot', { maxAge: '10 years' }));

// Register API routes
app.use('/api', apiRoutes);

app.all('/*', (req, res, next) => {
    // Just send the index.html for other paths to support HTML5Mode in angular
    res.sendFile('index.html', { maxAge: 0, root: __dirname + '/wwwroot' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof validation.ValidationError)
        return res.status(err.status).json(err);

    if (process.env.NPM_CONFIG_PRODUCTION)
        return res.status(500);
    else
        return res.status(500).send(err.stack);
})

if (module === require.main) {
    const server = app.listen(process.env.PORT || 8080, () => {
        console.log('Server listening at http://%s:%s', server.address().address, server.address().port);
    });
}

export default app;
