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
                    <div className="code">require('webdriverio')</div>
                    <table>
                        <tbody>
                            {
                                props.steps.map((step, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="button-bar">
                                                <button onClick={that.onStepRemove.bind(null, index)} tabIndex={-1}><span className="glyphicon glyphicon-remove" /></button>
                                                <button onClick={that.onStepMoveUp.bind(null, index)} tabIndex={-1}><span className="glyphicon glyphicon-triangle-top" /></button>
                                                <button onClick={that.onStepMoveDown.bind(null, index)} tabIndex={-1}><span className="glyphicon glyphicon-triangle-bottom" /></button>
                                            </td>
                                            <td>
                                                <UI.Step args={step.get('args')}
                                                         commandName={step.get('commandName')}
                                                         onChange={that.onStepChange.bind(null, index)} />
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