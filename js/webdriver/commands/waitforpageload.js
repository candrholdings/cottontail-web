Commands.waitForPageLoad = {
    parameters: ['ms'],
    platforms: {
        webdriverio: function (parameters) {
            return '.waitForPageLoad(' + JSON.stringify(parameters.ms || 500) + ')';
        },
        spec: 'Wait until page load completed within :ms ms'
    }
};
