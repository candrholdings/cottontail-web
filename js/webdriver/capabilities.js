!function () {
    'use strict';

    window.App.WebDriver.Capabilities = {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            },
            host: 'localhost',
            port: 9515,
            path: '/'
        },
        edge: {
            desiredCapabilities: {
                browserName: 'edge'
            },
            host: 'localhost',
            port: 17556,
            path: '/'
        },
        firefox: {
            desiredCapabilities: {
                browserName: 'firefox'
            }
        }
    };
}();