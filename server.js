#!/usr/bin/env node

!function (express) {
    'use strict';

    require('./publish')({ clean: true }, function () {
        var app = express(),
            port = process.env.port || process.argv[2] || 1337;

        app.use(express.static('publish'));
        app.listen(port, function () {
            console.log('Cottontail server listening to port ' + port);
        });
    });
}(require('express'));