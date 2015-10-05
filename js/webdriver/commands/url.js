!function () {
    'use strict';

    window.App.WebDriver.Commands.url = {
        parameters: ['url'],
        platforms: {
            webdriverio: function (parameters) {
                return '.url(' + JSON.stringify(parameters.url) + ')';
            },
            'spec': 'Navigate to :url'
        }
    };
}();