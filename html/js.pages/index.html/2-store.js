var store = window.App.Page.store = Reflux.createStore({
    listenables: [Actions],
    mixins: [
        window.App.Mixins.StoreProperties({
            active: false,
            autoRun: false,
            busy: false,
            capabilitiesText: JSON.stringify({
                desiredCapabilities: {
                    browserName: 'edge'
                },
                host: 'localhost',
                port: 17556,
                path: '/'
            }, null, 2),
            steps: List()
        })
    ],
    init: function () {
        // Actions.addStep('remote', {
        //     options: Map({
        //         desiredCapabilities: Map({
        //             browserName: 'edge'
        //         }),
        //         host: 'localhost',
        //         port: 17556,
        //         path: '/'
        //     })
        // });

        // Actions.addStep('init');
        Actions.addStep('url', { url: 'http://www.google.com/' });
        Actions.addStep('pause', { milliseconds: 2000 });
        Actions.addStep('getTitle');
        // Actions.addStep('end');
    },
    onAddStep: function (commandName, args) {
        this._setSteps(this._steps.push(Map({
            id: Date.now() + Math.random() + '',
            commandName: commandName,
            args: Map(args || {}),
            error: '',
            result: '',
            status: ''
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
    _mergeStepByID: function (stepID, merge) {
        var steps = this._steps,
            index = steps.findIndex(step => step.get('id') === stepID);

        ~index && this._setSteps(steps.mergeIn([index], merge));
    },
    onRunStep: function (step) {
        this._setBusy(true);
        this._mergeStepByID(step.id, {
            error: null,
            result: null,
            status: 'busy'
        });
    },
    onRunStepCompleted: function (stepID, result) {
        this._setBusy(false);
        this._mergeStepByID(stepID, {
            error: null,
            result: result,
            status: 'success'
        });
    },
    onRunStepFailed: function (stepID, err) {
        this._setBusy(false);
        this._mergeStepByID(stepID, {
            error: err,
            result: null,
            status: 'fail'
        });
    },
    onSetCapabilities: function (newCapabilities) {
        this._setCapabilities(newCapabilities);
    },
    onSetAutoRun: function (newAutoRun) {
        this._setAutoRun(newAutoRun);
    }
});
