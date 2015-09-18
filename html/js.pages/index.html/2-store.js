var store = window.App.Page.store = Reflux.createStore({
    listenables: [Actions],
    mixins: [
        window.App.Mixins.StoreProperties({
            active: false,
            busy: false,
            steps: List([
                Map({
                    commandName: 'remote',
                    args: Map({
                        options: Map({
                            desiredCapabilities: Map({
                                browserName: 'edge'
                            }),
                            host: 'localhost',
                            port: 17556,
                            path: '/'
                        })
                    })
                }),
                Map({
                    commandName: 'init'
                }),
                Map({
                    commandName: 'url',
                    args: Map({
                        url: 'http://www.google.com/'
                    })
                }),
                Map({
                    commandName: 'pause',
                    args: Map({
                        milliseconds: 2000
                    })
                }),
                Map({
                    commandName: 'end'
                })
            ])
        })
    ],
    onAddStep: function (commandName) {
        this._setSteps(this._steps.push(Map({
            commandName: commandName,
            args: Map()
        })));
    },
    onRemoveStep: function (indexToRemove) {
        this._setSteps(this._steps.remove(indexToRemove));
    },
    onSetStepArgs: function (stepIndex, newArgs) {
        this._setSteps(this._steps.setIn([stepIndex, 'args'], newArgs));
    },
    onMoveStepUp: function (stepIndex) {
        if (stepIndex < 1) { return; }

        this._setSteps(this._steps.update(newSteps => {
            var firstStep = newSteps.get(stepIndex - 1),
                secondStep = newSteps.get(stepIndex);

            return newSteps.set(stepIndex - 1, secondStep).set(stepIndex, firstStep);
        }));
    },
    onMoveStepDown: function (stepIndex) {
        var steps = this._steps;

        console.log(steps.size);

        if (stepIndex > steps.size - 2) { return; }

        this._setSteps(steps.update(newSteps => {
            var firstStep = newSteps.get(stepIndex),
                secondStep = newSteps.get(stepIndex + 1);

            return newSteps.set(stepIndex, secondStep).set(stepIndex + 1, firstStep);
        }));
    },
    onStart: function () {
        this._setBusy(true);
    },
    onStartCompleted: function () {
        this._setActive(true);
        this._setBusy(false);
    },
    onStartFailed: function () {
        this._setBusy(false);
    },
    onStop: function () {
        this._setBusy(true);
    },
    onStopCompleted: function () {
        this._setActive(false);
        this._setBusy(false);
    },
    onStopFailed: function () {
        this._setBusy(false);
    },
    onRunStep: function () {
        this._setBusy(true);
    },
    onRunStepCompleted: function () {
        this._setBusy(false);
    },
    onRunStepFailed: function () {
        this._setBusy(false);
    }
});
