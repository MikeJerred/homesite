import express = require('express');
//import rollbar = require('rollbar');
import rollbarSettings = require('./settings/rollbar-settings');

module MJ.Server {
    var app = express();

    console.log(__dirname);

    app.use(express.static(__dirname + '/wwwroot'));

     app.all('/*', function(req, res, next) {
         // Just send the index.html for other files to support HTML5Mode
         res.sendFile('index.html', { root: __dirname + '/wwwroot' });
     });

    //app.set('trust_proxy', 1);

    //app.use(rollbar.errorHandler(rollbarSettings.serverAccessToken));

    if (module === require.main) {
        var server = app.listen(process.env.PORT || 8080, () => {
            console.log('Server listening at http://%s:%s', server.address().address, server.address().port);
        });
    }

    module.exports = app;
}
