'use strict';

process.on('message', function (message) {
    var instruction = JSON.parse(message);

    instruction.steps.reduce(function (wdio, step) {
        return wdio[step.name].apply(wdio, step.args);
    }, require('webdriverio'));
});
