!function () {
    'use strict';

    window.App.WebDriver.Commands.pause = {
        parameters: [{
            name: 'milliseconds',
            type: 'number'
        }],
        platforms: {
            webdriverio: function (parameters) {
                return '.url(' + JSON.stringify(parameters.milliseconds) + ')';
            },
            spec: function (parameters) {
                var {milliseconds} = parameters;

                if (milliseconds >= 1000) {
                    return 'Pause for ' + (milliseconds / 1000).toFixed(1) + 's';
                } else {
                    return 'Pause for ' + milliseconds + ' ms';
                }
            }
        }
    };
}();