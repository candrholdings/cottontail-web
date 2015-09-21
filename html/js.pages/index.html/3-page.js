var Page = local.Page = React.createClass({
    mixins: [
        window.App.Mixins.StateFrom(store, {
            active: store.getActive,
            busy: store.getBusy,
            capabilitiesText: store.getCapabilitiesText,
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
            commandName = step.get('commandName'),
            command = window.App.WebDriver.Commands[commandName];

        Actions.runStep({
            id: step.get('id'),
            name: commandName,
            args: command ? command.parameters.map(parameter => {
                return step.get('args').get(typeof parameter === 'string' ? parameter : parameter.name);
            }) : [],
        });
    },
    onStartClick: function () {
        Actions.start(JSON.parse(this.state.capabilitiesText));
    },
    onStopClick: function () {
        Actions.stop();
    },
    onCapabilitiesChange: function (evt) {
        Actions.setCapabilitiesText(evt.target.value);
    },
    render: function () {
        var that = this,
            {state} = that;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn" disabled={state.active || state.busy} onClick={that.onStartClick}>Start <span className="glyphicon glyphicon-play" /></button>
                        <button className="btn" disabled={!state.active || state.busy} onClick={that.onStopClick}>Stop <span className="glyphicon glyphicon-stop" /></button>
                        <div className="hide">
                            <h1>Capabilities</h1>
                            <textarea className="capabilities"
                                      onChange={that.onCapabilitiesChange}
                                      value={state.capabilitiesText} />
                        </div>
                        <UI.StepList onStepChange={that.onStepChange}
                                     onStepMoveDown={that.onStepMoveDown}
                                     onStepMoveUp={that.onStepMoveUp}
                                     onStepRemove={that.onStepRemove}
                                     onStepRun={that.onStepRun}
                                     steps={state.steps} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <UI.CommandList onCommandClick={that.onCommandClick} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <UI.CodeView capabilitiesText={state.capabilitiesText} steps={state.steps} />
                    </div>
                </div>
            </div>
        );
    }
});
