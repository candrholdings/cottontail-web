Formatters.javascript = function (capabilities, steps) {
    var capabilitiesText = JSON.stringify(capabilities || {}, null, 4),
        lines = ['require("webdriverio")', '    .remote(' + capabilitiesText.split('\n').map((l, i) => i ? '    ' + l : l).join('\n') + ')', '    .init()'];

    steps.map((step, index) => {
        var commandName = step.get('commandName'),
            args = step.get('args'),
            command = Commands[commandName],
            {parameters, platforms} = command || {},
            codeTemplate = platforms && platforms.webdriverio;

        if (!codeTemplate) {
            lines.push('    <not supported>');
        } else if (typeof codeTemplate === 'string') {
            var code = codeTemplate;

            args && args.keySeq().forEach(name => {
                code = code.replace(new RegExp(':' + name, 'g'), args.get(name));
            });

            lines.push('    ' + code);
        } else {
            lines.push('    ' + codeTemplate(args.toJS()));
        }
    });

    lines.push('    .end();');
    lines.push('');
    lines.push('/* COTTONTAIL JSON');
    lines.push(JSON.stringify(steps.map(step => {
        return {
            commandName: step.get('commandName'),
            args: step.get('args')
        };
    })));
    lines.push('*/');

    return lines.join('\n');
};