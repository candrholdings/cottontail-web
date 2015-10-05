!function () {
    'use strict';

    window.App.WebDriver.Commands.click = {
        parameters: ['selector'],
        platforms: {
            webdriverio: function (parameters) {
                return '.click(' + JSON.stringify(parameters.selector) + ')';
            },
            spec: 'Click element by ":selector"'
        }
    };
}();