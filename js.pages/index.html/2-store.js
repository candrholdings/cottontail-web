import {StoreProperties} from 'util';

var Immutable = window.Immutable,
    {List, Map} = Immutable;

export var store = Reflux.createStore({
    listenables: [Actions],
    mixins: [
        StoreProperties({
            active: false,
            autoRun: false,
            browser: 'chrome',
            busy: false,
            capabilities: null,
            error: null,
            steps: List()
        })
    ],
    init: function () {
        Actions.loadSteps([{"commandName":"url","args":{"url":"http://www.google.com/"}},{"commandName":"getTitle","args":{}},{"commandName":"setValue","args":{"selector":"#lst-ib","values":"Hello, World!"}},{"commandName":"click","args":{"selector":"input[class=\"lsb\"]"}},{"commandName":"waitForPageLoad","args":{"ms":"500"}},{"commandName":"waitForExist","args":{"selector":"h3.r:first-child a","ms":"2000"}},{"commandName":"click","args":{"selector":"h3.r:first-child a"}},{"commandName":"waitForPageLoad","args":{"ms":""}}]);
    },
    _generateID: function () {
        return Date.now() + Math.random() + '';
    },
    onLoadSteps: function (json) {
        this._setSteps(List(json.map(step => {
            return Map({
                id: this._generateID(),
                commandName: step.commandName,
                args: Immutable.fromJS(step.args),
                error: '',
                result: '',
                status: ''
            });
        })));
    },
    onAddStep: function (commandName, args) {
        this._setSteps(this._steps.push(Map({
            id: this._generateID(),
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
        this._setError(null);
    },
    onStartCompleted: function () {
        this._setActive(true);
        this._setBusy(false);
    },
    onStartFailed: function (err) {
        this._setBusy(false);
        this._setError(err);
    },
    onStop: function () {
        this._setBusy(true);
        this._setError(null);
    },
    onStopCompleted: function () {
        this._setActive(false);
        this._setBusy(false);
    },
    onStopFailed: function (err) {
        this._setBusy(false);
        this._setError(err);
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

        if (this.getAutoRun()) {
            var steps = this.getSteps(),
                index = steps.findIndex(step => step.get('id') === stepID),
                nextStep = ~index ? steps.get(index + 1) : null;

            if (nextStep) {
                var commandName = nextStep.get('commandName'),
                    command = Commands[commandName];

                Actions.runStep({
                    id: nextStep.get('id'),
                    name: commandName,
                    args: command ? command.parameters.map(parameter => {
                        return nextStep.get('args').get(typeof parameter === 'string' ? parameter : parameter.name);
                    }) : [],
                });
            } else {
                this._setAutoRun(false);
            }
        }
    },
    onRunStepFailed: function (stepID, err) {
        this._setBusy(false);
        this._setAutoRun(false);
        this._mergeStepByID(stepID, {
            error: err,
            result: null,
            status: 'fail'
        });
    },
    onSetBrowser: function (newBrowser) {
        this._setBrowser(newBrowser)._setCapabilities(null);
    },
    onSetCapabilities: function (newCapabilities) {
        this._setBrowser('custom')._setCapabilities(newCapabilities);
    },
    onSetAutoRun: function (newAutoRun) {
        if (this._autoRun !== newAutoRun) {
            this._setAutoRun(newAutoRun);

            var nextStep = this.getSteps().get(0);

            if (nextStep) {
                var commandName = nextStep.get('commandName'),
                    command = Commands[commandName];

                Actions.runStep({
                    id: nextStep.get('id'),
                    name: commandName,
                    args: command ? command.parameters.map(parameter => {
                        return nextStep.get('args').get(typeof parameter === 'string' ? parameter : parameter.name);
                    }) : [],
                });
            }
        }
    }
});
