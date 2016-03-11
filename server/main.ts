import express = require('express');

module MJ.Server {
    var app = express();
    app.use(express.static('wwwroot'));
    app.listen(3000);
}
