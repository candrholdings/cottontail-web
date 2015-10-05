!function () {
    'use strict';

    window.App.WebDriver.Commands.assertEqual = {
        parameters: ['expected', 'message'],
        platforms: {
            webdriverio: function (parameters) {
                var code = ['.assertEqual(', JSON.stringify(parameters.expected)],
                    {message} = parameters;

                message && code.push(', ', JSON.stringify(message));

                return code.join('') + ')';
            },
            spec: function (parameters) {
                var {message} = parameters;

                return message ? message : 'Expect ' + JSON.stringify(parameters.expected);
            }
        }
    };
}();