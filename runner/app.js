'use strict';

var childProcess = require('child_process'),
    crypto = require('crypto'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    tmpdir = require('os').tmpdir();

main();

function main() {
    var app = require('express')(),
        port = process.env.port || process.argv[2] || 9323;

    app.use(require('cors')());
    app.use(require('body-parser').json());

    app.post('/run', function (req, res) {
        var process = childProcess.fork('runner.js'),
            timeout = setTimeout(function () {
                process.kill();
            }, 60000);

        process.on('exit', function (exitCode) {
            clearTimeout(timeout);

            if (exitCode) {
                res.status(500).json({ exitCode: exitCode });
            } else {
                res.sendStatus(204).end();
            }
        }).on('error', function (err) {
            clearTimeout(timeout);

            res.status(500).json({ error: err.message });
        }).send(JSON.stringify(req.body));
    }).listen(port, function () {
        console.log('WebDriverIO Runner now listening on port ' + port);
    });
}

function md5(str) {
    var hash = crypto.createHash('md5');

    hash.update(str);

    return hash.digest('hex');
}
