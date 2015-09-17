!function (React) {
    'use strict';

    var {PropTypes} = React;

    window.UI.StepList = React.createClass({
        onStepChange: function (stepIndex, newArgs) {
            var handler = this.props.onStepChange;

            handler && handler(stepIndex, newArgs);
        },
        onStepMoveUp: function (stepIndex) {
            var handler = this.props.onStepMoveUp;

            handler && handler(stepIndex);
        },
        onStepMoveDown: function (stepIndex) {
            var handler = this.props.onStepMoveDown;

            handler && handler(stepIndex);
        },
        onStepRemove: function (stepIndex) {
            var handler = this.props.onStepRemove;

            handler && handler(stepIndex);
        },
        render: function () {
            var that = this,
                {props} = that;

            return (
                <div className="ui-steplist">
                    <table>
                        <tbody>
                            {
                                props.steps.map((step, index) => {
                                    var args = step.get('args'),
                                        commandName = step.get('commandName'),
                                        command = window.App.WebDriver.Commands[commandName],
                                        description = command && command.description || '';

                                    (args || Immutable.Map()).keySeq().forEach(name => {
                                        description = description.replace(new RegExp(':' + name), args.get(name));
                                    });

                                    return (
                                        <tr key={index}>
                                            <td className="index">{index}</td>
                                            <td className="button-bar left">
                                                <nobr>
                                                    <button onClick={that.onStepMoveUp.bind(null, index)} tabIndex={-1}><span className="glyphicon glyphicon-triangle-top" /></button>
                                                    <button onClick={that.onStepMoveDown.bind(null, index)} tabIndex={-1}><span className="glyphicon glyphicon-triangle-bottom" /></button>
                                                </nobr>
                                            </td>
                                            <td className="step">
                                                <UI.Step args={args}
                                                         commandName={commandName}
                                                         onChange={that.onStepChange.bind(null, index)} />
                                            </td>
                                            <td className="description">{description}</td>
                                            <td className="button-bar right">
                                                <button onClick={that.onStepRemove.bind(null, index)} tabIndex={-1}><span className="glyphicon glyphicon-remove" /></button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            );
        }
    });
}(window.React);