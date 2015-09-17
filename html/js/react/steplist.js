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
                    {
                        props.steps.map((step, index) => {
                            return (
                                <div key={index}>
                                    <UI.Step args={step.get('args')}
                                             commandName={step.get('commandName')}
                                             onChange={that.onStepChange.bind(null, index)} />
                                    <button className="btn"
                                            onClick={that.onStepRemove.bind(null, index)}>Remove</button>
                                    <button className="btn"
                                            onClick={that.onStepMoveUp.bind(null, index)}>Move up</button>
                                    <button className="btn"
                                            onClick={that.onStepMoveDown.bind(null, index)}>Move down</button>
                                </div>
                            );
                        })
                    }
                </div>
            );
        }
    });
}(window.React);