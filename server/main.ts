import * as express from 'express';
import * as compression from 'compression';
import * as userAgent from 'express-useragent';
import { AddressInfo } from 'net';
import * as mongoose from 'mongoose';
import * as path from 'path';
import apiRoutes from './api/routes';
import { ValidationError } from './api/validate';

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const app = express();
app.use(compression());

mongoose.connect(process.env.MONGODB_URI, {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 3000,
    useNewUrlParser: true
    //socketOptions: { keepAlive: 120 }
});
(<any>mongoose).Promise = global.Promise;

app.all('/*', (req, res, next) => {
    const info = userAgent.parse(req.header('user-agent'));
    if (info.isIE && +info.version < 10)
        res.redirect('http://www.whatbrowser.org/');
    else
        next();
});

app.use('/api', apiRoutes);

app.use(express.static('../client/dist/homesite'));

// Just send the index.html for other paths to support routes in angular
app.all('/*', (req, res, next) => {
    res.sendFile('../client/dist/homesite/index.html', { root: '.' });
});

app.use(<express.ErrorRequestHandler>((err, req, res, next) => {
    if (err instanceof ValidationError)
        return res.status(err.status).json(err);

    if (err instanceof Error && process.env.NODE_ENV === 'development')
        return res.status(500).send(err.stack);

    return res.status(500);
}));

const server = app.listen(process.env.PORT || 3000, () => {
    const address = <AddressInfo>server.address();
    if (address.family === 'IPv6')
        console.log(`Server listening at [${address.address}]:${address.port}`);
    else
        console.log(`Server listening at ${address.address}:${address.port}`);
});
