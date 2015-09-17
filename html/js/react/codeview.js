!function (React) {
    'use strict';

    var {PropTypes} = React;

    window.UI.CodeView = React.createClass({
        render: function () {
            var that = this,
                {props} = that,
                lines = ['require("webdriverio")'];

            props.steps.map((step, index) => {
                var commandName = step.get('commandName'),
                    args = step.get('args'),
                    command = window.App.WebDriver.Commands[commandName],
                    {parameters} = command || {},
                    line = ['    .', commandName, '('];

                line = line.concat((parameters || []).map((parameter, index) => {
                    var name,
                        type = 'string';

                    if (typeof parameter === 'string') {
                        name = parameter;
                    } else {
                        name = parameter.name;
                        type = parameter.type;
                    }

                    var value = args.get(name);

                    line.push((JSON.stringify(value, null, 4) || '').split('\n').map((l, i) => i ? '    ' + l : l).join('\n'));
                }));

                line.push(')');
                lines.push(line.join(''));
            });

            lines[lines.length - 1] = lines[lines.length - 1] + ';';

            return (
                <div className="ui-codeview">
                    <pre>{lines.join('\n')}</pre>
                </div>
            );
        }
    });
}(window.React);