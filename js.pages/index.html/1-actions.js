var Actions = local.Actions = Reflux.createActions({
    addStep: {},
    moveStepDown: {},
    moveStepUp: {},
    removeStep: {},
    runStep: { children: ['completed', 'failed'] },
    setAutoRun: {},
    setCapabilities: {},
    setStepArgs: { sync: true },
    start: { children: ['completed', 'failed'] },
    stop: { children: ['completed', 'failed'] },
    loadSteps: {}
});

Actions.start.listen(function (capabilities) {
    window.fetch(
        'http://localhost:9323/start',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(capabilities)
        }
    ).then(res => {
        if (Math.floor(res.status / 100) === 2) {
            this.completed();
        } else {
            res.json().then(err => {
                this.failed(err.error);
            }).catch(this.failed);
        }
    }).catch(this.failed);
});

Actions.stop.listen(function () {
    window.fetch(
        'http://localhost:9323/stop',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(res => {
        res.status === 404 || Math.floor(res.status / 100) === 2 ? this.completed() : this.failed(res.body);
    }).catch(this.failed);
});

Actions.runStep.listen(function (step) {
    window.fetch(
        'http://localhost:9323/step',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(step)
        }
    ).then(res => {
        res.json().then(json => {
            if (Math.floor(res.status / 100) === 2) {
                this.completed(step.id, json);
            } else {
                this.failed(step.id, json.error);
            }
        });
    }).catch(this.failed);
});
