var Actions = local.Actions = Reflux.createActions({
    addStep: {},
    removeStep: {},
    setStepArgs: { sync: true },
    moveStepUp: {},
    moveStepDown: {},
    start: { children: ['completed', 'failed'] },
    stop: { children: ['completed', 'failed'] },
    runStep: { children: ['completed', 'failed'] }
});

Actions.start.listen(function () {
    window.fetch(
        'http://localhost:9323/start',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(res => {
        Math.floor(res.status / 100) === 2 ? this.completed() : this.failed(res.body);
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
        Math.floor(res.status / 100) === 2 ? this.completed() : this.failed(res.body);
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
        Math.floor(res.status / 100) === 2 ? this.completed() : this.failed(res.body);
    }).catch(this.failed);
});
