'use strict';

var assert = require('assert'),
    session = require('webdriverio'),
    handlers = {
        step: function (step) {
            if (!session) {
                return console.warn('No active session, cannot execute step');
            }

            var command = session[step.name];

            if (!command) {
                return console.warn('Cannot find command name "' + step.name + '"');
            } else {
                session = command.apply(session, step.args);
                process.send({ ack: step.name });
            }
        }
    };

process.on('message', function (message) {
    var json = JSON.parse(message),
        type = json.type,
        handler = handlers[type];

    if (handler) {
        handler(json.body);
    } else {
        console.warn('Cannot process message, unknown message type "' + type + '"');
    }
});

// function initWebDriverIO() {
//     var wdio = require('webdriverio');

//     wdio.addCommand('assertEqual', function (value) {
//         assert.deepEqual(value, this);
//     });
// }
