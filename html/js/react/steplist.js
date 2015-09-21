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
        onStepRun: function (stepIndex) {
            var handler = this.props.onStepRun;

            handler && handler(stepIndex);
        },
        render: function () {
            var that = this,
                {props} = that,
                {disabled} = props;

            return (
                <div className="ui-steplist">
                    <ul>
                        {
                            props.steps.map((step, index) => {
                                var args = step.get('args'),
                                    commandName = step.get('commandName'),
                                    error = step.get('error'),
                                    result = step.get('result'),
                                    status = step.get('status'),
                                    command = window.App.WebDriver.Commands[commandName];

                                return (
                                    <li key={index}>
                                        <div className="index">
                                            <span className="number">{index + 1}</span>
                                            <div className="buttons">
                                                <button onClick={that.onStepMoveUp.bind(null, index)}
                                                        tabIndex={-1}>
                                                    <span className="glyphicon glyphicon-triangle-top" />
                                                </button>
                                                <button onClick={that.onStepMoveDown.bind(null, index)}
                                                        tabIndex={-1}>
                                                    <span className="glyphicon glyphicon-triangle-bottom" />
                                                </button>
                                            </div>
                                        </div>
                                        <button className="play-button"
                                                disabled={disabled}
                                                onClick={that.onStepRun.bind(null, index)}
                                                tabIndex={-1}>
                                            <span className="glyphicon glyphicon-play" />
                                        </button>
                                        <div className="step">
                                            <UI.Step args={args}
                                                     commandName={commandName}
                                                     onChange={that.onStepChange.bind(null, index)} />
                                        </div>
                                        {
                                            status === 'busy' ?
                                                <div className="busy">Running&hellip;</div> :
                                            status === 'fail' ?
                                                <div className="error">
                                                    {error ? JSON.stringify(error) : 'Failed'}
                                                </div> :
                                            status === 'success' ?
                                                <div className="result">
                                                    {result ? JSON.stringify(result) : 'Success'}
                                                </div> :
                                            false
                                        }
                                        <button className="remove-button"
                                                onClick={that.onStepRemove.bind(null, index)}
                                                tabIndex={-1}>
                                            <span className="glyphicon glyphicon-trash" />
                                        </button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            );
        }
    });
}(window.React);