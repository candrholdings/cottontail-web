'use strict';

var {React} = window,
    {PropTypes} = React;

export var CodeView = React.createClass({
    propTypes: {
        capabilities: PropTypes.any
    },
    render: function () {
        var that = this,
            {props} = that,
            capabilitiesText = JSON.stringify(props.capabilities || {}, null, 4),
            lines = ['require("webdriverio")', '    .remote(' + capabilitiesText.split('\n').map((l, i) => i ? '    ' + l : l).join('\n') + ')', '    .init()'];

        props.steps.map((step, index) => {
            var commandName = step.get('commandName'),
                args = step.get('args'),
                command = window.App.WebDriver.Commands[commandName],
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

            // line = line.concat((parameters || []).map((parameter, index) => {
            //     var name,
            //         type = 'string';

            //     if (typeof parameter === 'string') {
            //         name = parameter;
            //     } else {
            //         name = parameter.name;
            //         type = parameter.type;
            //     }

            //     var value = args.get(name);

            //     line.push((JSON.stringify(value, null, 4) || '').split('\n').map((l, i) => i ? '    ' + l : l).join('\n'));
            // }));

            // line.push(')');
            // lines.push(line.join(''));
        });

        lines.push('    .end();');
        lines.push('');
        lines.push('/* COTTONTAIL JSON');
        lines.push(JSON.stringify(props.steps.map(step => {
            return {
                commandName: step.get('commandName'),
                args: step.get('args')
            };
        })));
        lines.push('*/');

        return (
            <div className="ui-codeview">
                <pre>{lines.join('\n')}</pre>
            </div>
        );
    }
});