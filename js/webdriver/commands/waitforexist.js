!function () {
    'use strict';

    window.App.WebDriver.Commands.waitForExist = {
        parameters: ['selector', 'ms', 'reverse'],
        platforms: {
            webdriverio: function (parameters) {
                return '.waitForExist(' + JSON.stringify(parameters.selector) + ', ' + JSON.stringify(parameters.ms || 500) + ', ' + JSON.stringify(parameters.reverse || false) + ')';
            },
            spec: 'Wait until element ":selector" exists'
        }
    };
}();