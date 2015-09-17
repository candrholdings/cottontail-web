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
                    <div className="title">{commandName}</div>
                    {
                        !!command &&
                            <table className="table">
                                <tbody>
                                    {
                                        parameters.map((parameter, index) => {
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
                                                <tr key={index}>
                                                    <td>{name}</td>
                                                    <td>
                                                        {
                                                            type === 'json' ?
                                                                <textarea className="form-control"
                                                                          disabled={true}
                                                                          value={JSON.stringify(value, null, 2)} />
                                                            :
                                                                <input type={type === 'number' ? 'number' : 'text'}
                                                                       className="form-control"
                                                                       onChange={that.onChange.bind(null, name, type)}
                                                                       value={value} />
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                    }
                </div>
            );
        }
    });
}(window.React);