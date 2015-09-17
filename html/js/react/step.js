!function (React) {
    'use strict';

    var {PropTypes} = React;

    window.UI.Step = React.createClass({
        propTypes: {
            args: PropTypes.any,
            commandName: PropTypes.string,
            onChange: PropTypes.func
        },
        onChange: function (name, type, evt) {
            var {props} = this,
                {args, onChange: handler} = props,
                value = evt.target.value;

            if (type === 'number') {
                value = +value;

                if (isNaN(value)) { return; }
            }

            handler && handler(args.set(name, value));
        },
        render: function () {
            var that = this,
                {props} = that,
                {args, commandName} = props,
                command = window.App.WebDriver.Commands[commandName],
                {parameters} = command || {};

            return (
                <div className="ui-step">
                    <span className="name">.{commandName}</span>
                    <span>(</span>
                        {
                            !!command && parameters.map((parameter, index) => {
                                var name, 
                                    type = 'string';

                                if (typeof parameter === 'string') {
                                    name = parameter;
                                } else {
                                    name = parameter.name;
                                    type = parameter.type;
                                }

                                var value = args.get(name);

                                return (
                                    type === 'json' ?
                                        <div className="argument" key={index}>
                                            <input disabled={true}
                                                   placeholder={name}
                                                   type="text"
                                                   value={JSON.stringify(value)} />
                                        </div>
                                    :
                                    type === 'number' ?
                                        <div className="argument" key={index}>
                                            <input onChange={that.onChange.bind(null, name, type)}
                                                   placeholder={name}
                                                   type="number"
                                                   value={value} />
                                        </div>
                                    :
                                        <div className="argument" key={index}>
                                            '<input onChange={that.onChange.bind(null, name, type)}
                                                   placeholder={name}
                                                   type="text"
                                                   value={value} />'
                                        </div>
                                );
                            })
                        }
                    <span>)</span>
                </div>
            );
        }
    });
}(window.React);