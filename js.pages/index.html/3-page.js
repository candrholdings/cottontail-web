var Page = local.Page = React.createClass({
    mixins: [
        window.App.Mixins.StateFrom(store, {
            active: store.getActive,
            autoRun: store.getAutoRun,
            busy: store.getBusy,
            capabilitiesText: store.getCapabilitiesText,
            error: store.getError,
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
    onRunAllClick: function () {
        Actions.setAutoRun(!store.autoRun);
    },
    onCapabilitiesChange: function (evt) {
        Actions.setCapabilitiesText(evt.target.value);
    },
    render: function () {
        var that = this,
            {state} = that,
            {active, busy, error} = state;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="button-bar">
                            <UI.Popover animation={false} content={error} show={!!error} trigger="hover">
                                <button className="btn" disabled={active || busy} onClick={that.onStartClick}><span className="glyphicon glyphicon-plus" /> Create session</button>
                            </UI.Popover>
                            <button className="btn" disabled={!active || busy} onClick={that.onStopClick}><span className="glyphicon glyphicon-stop" /> Stop session</button>
                            <button className="btn" disabled={!active || busy} onClick={that.onRunAllClick}><span className="glyphicon glyphicon-play" /> Run all steps</button>
                        </div>
                        <div className="hide">
                            <h1>Capabilities</h1>
                            <textarea className="capabilities"
                                      onChange={that.onCapabilitiesChange}
                                      value={state.capabilitiesText} />
                        </div>
                        <UI.StepList disabled={!active || busy}
                                     onStepChange={that.onStepChange}
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
