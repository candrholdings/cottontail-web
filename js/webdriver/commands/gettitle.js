!function () {
    'use strict';

    window.App.WebDriver.Commands.getTitle = {
        parameters: [],
        platforms: {
            webdriverio: '.title()',
            spec: 'Get window title'
        }
    };
}();