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
        port = process.env.port || process.argv[2] || 9323,
        child;

    app.use(require('cors')());
    app.use(require('body-parser').json());

    app.post('/start', function (req, res) {
        child && child.kill();
        child = childProcess.fork('runner.js');

        child.on('exit', function (exitCode) {
            console.log('Runner exited with code ' + exitCode);
            child = 0;
        });

        res.sendStatus(204);

        console.log('Runner started');
    }).post('/step', function (req, res) {
        if (child) {
            var timeout = setTimeout(function () {
                child && child.kill();
                res.sendStatus(500);
                console.log('Timed out while sending step');
            }, 5000);

            child.once('message', function () {
                clearTimeout(timeout);
                res.sendStatus(204);
                console.log('Running step "' + req.body.name + '"');
            }).send(JSON.stringify({ type: 'step', body: req.body }));
        } else {
            res.status(404).json({ error: 'no active session' });
            console.log('Cannot send step to runner, no active session found');
        }
    }).post('/stop', function (req, res) {
        if (child) {
            child.kill();
            res.sendStatus(204);
            console.log('Runner stopped');
        } else {
            res.status(404).json({ error: 'no active session' });
            console.log('Cannot stop runner, no active session found');
        }
    }).listen(port, function () {
        console.log('WebDriverIO Runner now listening on port ' + port);
    });
}

function md5(str) {
    var hash = crypto.createHash('md5');

    hash.update(str);

    return hash.digest('hex');
}
