!function () {
    'use strict';

    window.App.WebDriver.Commands.elements = {
        parameters: ['selector'],
        platforms: {
            webdriverio: function (parameters) {
                return '.elements(' + JSON.stringify(parameters.selector) + ')';
            },
            spec: 'Select elements by ":selector"'
        }
    };
}();