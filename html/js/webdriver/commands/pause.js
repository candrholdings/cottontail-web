!function () {
    'use strict';

    window.App.WebDriver.Commands.pause = {
        parameters: [{
            name: 'milliseconds',
            type: 'number'
        }],
        description: 'Pause for :milliseconds ms'
    };
}();