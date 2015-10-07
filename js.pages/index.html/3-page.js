export var Page = React.createClass({
    mixins: [
        StateFrom(store, {
            active: store.getActive,
            autoRun: store.getAutoRun,
            browser: store.getBrowser,
            busy: store.getBusy,
            capabilities: store.getCapabilities,
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
            command = Commands[commandName];

        Actions.runStep({
            id: step.get('id'),
            name: commandName,
            args: command ? command.parameters.map(parameter => {
                return step.get('args').get(typeof parameter === 'string' ? parameter : parameter.name);
            }) : [],
        });
    },
    getCapabilities: function () {
        var {state} = this;

        return Capabilities[state.browser] || state.capabilities;
    },
    onStartClick: function () {
        Actions.start(this.getCapabilities());
    },
    onStopClick: function () {
        Actions.stop();
    },
    onRunAllClick: function () {
        Actions.setAutoRun(!store.autoRun);
    },
    onLoadStepsClick: function () {
        var json = prompt('Please paste JSON text here');

        if (!json) { return; }

        try {
            json = JSON.parse(json);
        } catch (ex) {
            return alert('Invalid JSON text');
        }

        Actions.loadSteps(json);
    },
    render: function () {
        var that = this,
            {state} = that,
            {active, browser, busy, error} = state;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="button-bar">
                            <Popover animation={false} content={error} show={!!error} trigger="hover">
                                <button className="btn" disabled={active || busy} onClick={that.onStartClick}><span className="glyphicon glyphicon-plus" /> Create session</button>
                            </Popover>
                            <button className="btn" disabled={!active || busy} onClick={that.onStopClick}><span className="glyphicon glyphicon-stop" /> Stop session</button>
                            <button className="btn" disabled={!active || busy} onClick={that.onRunAllClick}><span className="glyphicon glyphicon-play" /> Run all steps</button>
                            <button className="btn" disabled={busy} onClick={that.onLoadStepsClick}><span className="glyphicon glyphicon-open" /> Load steps</button>
                            <button className={classNames({btn: 1, 'btn-success': browser === 'chrome'})}
                                    disabled={active || busy}
                                    onClick={() => Actions.setBrowser('chrome')}>Chrome</button>
                            <button className={classNames({btn: 1, 'btn-success': browser === 'edge'})}
                                    disabled={active || busy}
                                    onClick={() => Actions.setBrowser('edge')}>Edge</button>
                            <button className={classNames({btn: 1, 'btn-success': browser === 'firefox'})}
                                    disabled={active || busy}
                                    onClick={() => Actions.setBrowser('firefox')}>Firefox</button>
                        </div>
                        <StepList disabled={!active || busy}
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
                        <CommandList onCommandClick={that.onCommandClick} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <CodeView capabilities={that.getCapabilities()} steps={state.steps} />
                    </div>
                </div>
            </div>
        );
    }
});
