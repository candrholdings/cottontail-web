!function () {
    'use strict';

    window.App.WebDriver.Commands.setValue = {
        parameters: ['selector', 'values'],
        platforms: {
            webdriverio: function (parameters) {
                return '.setValue(' + JSON.stringify(parameters.selector) + ', ' + JSON.stringify(parameters.values) + ')';
            },
            spec: 'Set element value to ":values" by ":selector"'
        }
    };
}();