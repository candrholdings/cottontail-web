!function () {
    'use strict';

    (window.App.Mixins || (window.App.Mixins = {})).StateFrom = function (store, eventHandlers) {
        // Full eventHandlers supported:
        // {
        //     lastModified: {
        //         lastModified: store.getLastModified,
        //         year: function () {
        //             return store.getLastModified().getYear();
        //         },
        //         month: function () {
        //             return store.getLastModified().getMonth();
        //         }
        //     }
        // }

        // Or as shorthand:
        // {
        //     lastModifed: store.getLastModified
        // }

        Object.getOwnPropertyNames(eventHandlers).forEach(name => {
            var eventHandler = eventHandlers[name];

            if (typeof eventHandler === 'function') {
                var newEventHandler = eventHandlers[name] = {};

                newEventHandler[name] = eventHandler;
            }
        });

        return {
            componentDidMount: function () {
                var that = this,
                    stateFromUnsubscribes = that._stateFromUnsubscribes || (that._stateFromUnsubscribes = []);

                stateFromUnsubscribes.push(store.listen(type => {
                    var eventHandler = eventHandlers[type];

                    if (eventHandler) {
                        var newState;

                        Object.getOwnPropertyNames(eventHandler).forEach(stateName => {
                            var newValue = eventHandler[stateName].call(store);

                            if (newValue !== that.state[stateName]) {
                                newState || (newState = {});
                                newState[stateName] = newValue;
                            }
                        });

                        newState && that.setState(newState);
                    }
                }));
            },
            componentWillUnmount: function () {
                this._stateFromUnsubscribes && this._stateFromUnsubscribes.forEach(unsubscribe => {
                    unsubscribe();
                });

                this._stateFromUnsubscribes = 0;
            },
            getInitialState: function () {
                var newState = {};

                Object.getOwnPropertyNames(eventHandlers).forEach(name => {
                    var eventHandler = eventHandlers[name];

                    Object.getOwnPropertyNames(eventHandler).forEach(stateName => {
                        newState[stateName] = eventHandler[stateName].call(store);
                    });
                });

                return newState;
            }
        };
    };
}();