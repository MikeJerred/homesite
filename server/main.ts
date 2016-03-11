import express = require('express');

module MJ.Server {
    var app = express();

    app.use(express.static('wwwroot'));

    app.all('/*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('index.html', { root: __dirname + '/wwwroot' });
    });

    app.listen(3000);
}
