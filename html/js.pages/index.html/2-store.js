var store = window.App.Page.store = Reflux.createStore({
    listenables: [Actions],
    mixins: [
        window.App.Mixins.StoreProperties({
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
    }
});
