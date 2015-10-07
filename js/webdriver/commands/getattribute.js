Commands.getAttribute = {
    parameters: ['selector', 'attributeName'],
    platforms: {
        webdriverio: function (parameters) {
            return '.getAttribute(' + JSON.stringify(parameters.selector) + ', ' + JSON.stringify(parameters.attributeName) + ')';
        },
        spec: 'Get element ":selector" attribute ":attributeName"'
    }
};
