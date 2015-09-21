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
                {parameters, platforms} = command || {},
                {spec: specTemplate} = platforms || {},
                description;

            if (specTemplate) {
                if (typeof specTemplate === 'string') {
                    description = specTemplate;

                    args && args.keySeq().forEach(name => {
                        description = description.replace(new RegExp(':' + name), args.get(name));
                    });
                } else {
                    description = specTemplate.call(null, args.toJS());
                }
            }

            return (
                <div className="ui-step">
                    <div className="code">
                        <span className="name">{commandName}</span>
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

                                    return [!!index && ', ', (
                                        type === 'json' ?
                                            <input disabled={true}
                                                   placeholder={name}
                                                   type="text"
                                                   value={JSON.stringify(value)} />
                                        :
                                        type === 'number' ?
                                            <UI.ExpandingInput onChange={that.onChange.bind(null, name, type)}
                                                               placeholder={name}
                                                               title={name}
                                                               type="number"
                                                               value={value} />
                                        :
                                            <UI.ExpandingInput onChange={that.onChange.bind(null, name, type)}
                                                                placeholder={name}
                                                                title={name}
                                                                type="text"
                                                                value={value} />
                                    )];
                                })
                            }
                        <span>)</span>
                    </div>
                    {!!description && <div className="description">{description}</div>}
                </div>
            );
        }
    });
}(window.React);