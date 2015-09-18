var Page = local.Page = React.createClass({
    mixins: [
        window.App.Mixins.StateFrom(store, {
            steps: store.getSteps
        })
    ],
    getInitialState: function () {
        return {
            editing: {
                commandName: '',
                args: null
            }
        };
    },
    onCommandClick: function (name) {
        Actions.addStep(name);
    },
    onStepChange: function (stepIndex, newArgs) {
        Actions.setStepArgs(stepIndex, newArgs);
    },
    onStepRemove: function (removedStepIndex) {
        Actions.removeStep(removedStepIndex);
    },
    onStepMoveUp: function (stepIndex) {
        Actions.moveStepUp(stepIndex);
    },
    onStepMoveDown: function (stepIndex) {
        Actions.moveStepDown(stepIndex);
    },
    onStepRun: function (stepIndex) {
        var step = this.state.steps.get(stepIndex),
            args = step.get('args'),
            commandName = step.get('commandName'),
            command = window.App.WebDriver.Commands[commandName];

        Actions.runStep({
            name: commandName,
            args: command ? command.parameters.map(parameter => {
                return args.get(typeof parameter === 'string' ? parameter : parameter.name);
            }) : []
        });
    },
    onStartClick: function () {
        Actions.start();
    },
    onStopClick: function () {
        Actions.stop();
    },
    render: function () {
        var that = this,
            {state} = that;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                        <UI.CommandList onCommandClick={that.onCommandClick} />
                    </div>
                    <div className="col-md-10">
                        <button className="btn" onClick={that.onStartClick}>Start <span className="glyphicon glyphicon-play" /></button>
                        <button className="btn" onClick={that.onStopClick}>Stop <span className="glyphicon glyphicon-stop" /></button>
                        <UI.StepList onStepChange={that.onStepChange}
                                     onStepMoveDown={that.onStepMoveDown}
                                     onStepMoveUp={that.onStepMoveUp}
                                     onStepRemove={that.onStepRemove}
                                     onStepRun={that.onStepRun}
                                     steps={state.steps} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <UI.CodeView steps={state.steps} />
                    </div>
                </div>
            </div>
        );
    }
});
