Actions.runStep.completed.listen(function (stepID) {
    var autoRun = store.getAutoRun();

    console.log('autoRun: ' + autoRun);

    if (autoRun) {
        var steps = store.getSteps(),
            index = steps.findIndex(step => step.get('id') === stepID),
            nextStep = ~index ? steps.get(index + 1) : null;

        if (nextStep) {
            var commandName = nextStep.get('commandName'),
                command = window.App.WebDriver.Commands[commandName];

            Actions.runStep({
                id: nextStep.get('id'),
                name: commandName,
                args: command ? command.parameters.map(parameter => {
                    return nextStep.get('args').get(typeof parameter === 'string' ? parameter : parameter.name);
                }) : [],
            });
        }
    }
});

// Actions.runStep.failed.listen(function () {
// });

Actions.setAutoRun.listen(function (newAutoRun) {
    if (!newAutoRun) { return; }

    var nextStep = store.getSteps().get(0);

    if (nextStep) {
        var commandName = nextStep.get('commandName'),
            command = window.App.WebDriver.Commands[commandName];

        Actions.runStep({
            id: nextStep.get('id'),
            name: commandName,
            args: command ? command.parameters.map(parameter => {
                return nextStep.get('args').get(typeof parameter === 'string' ? parameter : parameter.name);
            }) : [],
        });
    }
});