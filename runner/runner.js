'use strict';

var assert = require('assert'),
    Q = require('q'),
    session = require('webdriverio'),
    handlers = {
        start: function (body) {
            session = session.remote(body.capabilities).init();

            session.addCommand('assertEqual', function (expected, message) {
                return this.lastPromise.then(function (actual) {
                    assert.deepEqual(actual, expected, message);
                });
            });

            return session;
        },
        step: function (step) {
            if (!session) {
                console.warn('No active session, cannot execute step');

                return Q.reject('no active session');
            }

            var command = session[step.name];

            if (!command) {
                console.warn('Cannot find command name "' + step.name + '"');

                return Q.reject('webdriver command not found');
            } else {
                var deferred = Q.defer();

                session = command.apply(session, step.args).then(function (result) {
                    deferred.resolve(result || null);
                    return result;
                }).catch(function (err) {
                    deferred.reject(err);
                    // throw err;
                });

                return deferred.promise;
            }
        },
        kill: function () {
            console.warn('Received "kill" command');

            var deferred = Q.defer();

            if (session && session.end) {
                session.end().then(function () {
                    deferred.resolve(null);

                    setTimeout(function () {
                        process.exit(0);
                    }, 1000);
                });
            } else {
                deferred.resolve(null);

                setTimeout(function () {
                    process.exit(0);
                }, 1000);
            }

            return deferred.promise;
        }
    };

process.on('message', function (message) {
    var json = JSON.parse(message),
        type = json.type,
        handler = handlers[type];

    if (handler) {
        handler(json.body)
            .then(function (result) {
                process.send(JSON.stringify(result));
            })
            .catch(function (err) {
                process.send(JSON.stringify({ error: err }));
            });
    } else {
        console.warn('Cannot process message, unknown message type "' + type + '"');
        process.send(JSON.stringify({ error: 'message handler not found' }));
    }
});

// function initWebDriverIO() {
//     var wdio = require('webdriverio');

//     wdio.addCommand('assertEqual', function (value) {
//         assert.deepEqual(value, this);
//     });
// }

console.log('Runner started');