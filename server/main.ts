import * as express from 'express';
import apiRoutes from './api/routes';
import * as validation from './api/validate';

let app = express();

app.use(express.static(__dirname + '/wwwroot'));

// Register API routes
app.use('/api', apiRoutes);

app.all('/*', (req, res, next) => {
    // Just send the index.html for other paths to support HTML5Mode in angular
    res.sendFile('index.html', { root: __dirname + '/wwwroot' });
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
    let server = app.listen(process.env.PORT || 8080, () => {
        console.log('Server listening at http://%s:%s', server.address().address, server.address().port);
    });
}

export default app;
