'use strict';

var childProcess = require('child_process'),
    crypto = require('crypto'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    Q = require('q'),
    tmpdir = require('os').tmpdir();

main();

function main() {
    var app = require('express')(),
        port = process.env.port || process.argv[2] || 9323,
        child;

    app.use(require('cors')());
    app.use(require('body-parser').json());

    app.post('/start', function (req, res) {
        stopRunner(child).finally(function () {
            var newChild = child = childProcess.fork('runner.js');

            child.on('exit', function (exitCode) {
                console.log('Runner exited with code ' + exitCode);

                if (child === newChild) {
                    child = 0;
                }
            });

            sendMessage(child, { type: 'start', body: { capabilities: req.body } })
                .then(function () {
                    res.sendStatus(204);
                    console.log('Runner started');
                })
                .catch(function (err) {
                    child.kill();
                    child = 0;

                    console.log('Failed to start runner due to "' + err.message + '"');
                    res.status(500).json({ error: err.message }).end();
                });
        });
    }).post('/step', function (req, res) {
        if (!child) {
            res.status(404).json({ error: 'no active session' });
            return console.log('Cannot send step to runner, no active session found');
        }

        var stepName = req.body.name;

        console.log('Running step "' + stepName + '"');

        sendMessage(child, { type: 'step', body: req.body })
            .then(function (result) {
                res.json(result).end();
            })
            .catch(function (err) {
                if (err.message === 'timeout') {
                    console.log('Timed out while sending step');
                    res.sendStatus(500);
                } else {
                    console.warn('Failed to run step "' + stepName + '" due to "' + err + '"');
                    res.status(500).json({ error: { message: err.message } }).end();
                }
            });
    }).post('/stop', function (req, res) {
        if (!child) {
            res.status(404).json({ error: 'no active session' });
            return console.log('Cannot stop runner, no active session found');
        }

        stopRunner(child).finally(function () {
            res.sendStatus(204);
            console.log('Runner stopped');
        });
    }).listen(port, function () {
        console.log('WebDriverIO Runner now listening on port ' + port);
    });
}

function md5(str) {
    var hash = crypto.createHash('md5');

    hash.update(str);

    return hash.digest('hex');
}

function stopRunner(child) {
    if (child) {
        console.log('Stopping runner');

        return sendMessage(child, { type: 'kill' });
    } else {
        return Q();
    }
}

function sendMessage(child, message) {
    var deferred = Q.defer(),
        timeout = setTimeout(function () {
            child && child.kill();
            deferred.reject(new Error('timeout'));
        }, 5000);

    child.once('message', function (message) {
        clearTimeout(timeout);

        message = JSON.parse(message);

        var error = message && message.error;

        error ? deferred.reject(new Error(error.message)) : deferred.resolve(message);
    }).send(JSON.stringify(message));

    return deferred.promise;
}