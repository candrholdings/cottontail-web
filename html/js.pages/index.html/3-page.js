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
    onPlayClick: function () {
        var newSteps = [];

        this.state.steps.forEach(step => {
            var args = step.get('args'),
                commandName = step.get('commandName'),
                command = window.App.WebDriver.Commands[commandName];

            newSteps.push({
                name: commandName,
                args: command ? command.parameters.map(parameter => {
                    return args.get(typeof parameter === 'string' ? parameter : parameter.name);
                }) : []
            });
        });

        window.fetch(
            'http://localhost:9323/run',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    steps: newSteps
                })
            }
        );
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
                        <button className="btn" onClick={that.onPlayClick}>Play <span className="glyphicon glyphicon-play" /></button>
                        <UI.StepList onStepChange={that.onStepChange}
                                     onStepMoveDown={that.onStepMoveDown}
                                     onStepMoveUp={that.onStepMoveUp}
                                     onStepRemove={that.onStepRemove}
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
