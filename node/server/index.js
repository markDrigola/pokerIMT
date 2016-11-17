var express = require('express');
var app = express();
var router = require('./router.js');

function server(config) {
    app.listen(config.get('port'), function () {

    });
    router(app, express);
}

module.exports = server;