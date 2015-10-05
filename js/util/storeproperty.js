!function () {
    'use strict';

    (window.App.Mixins || (window.App.Mixins = {})).StoreProperties = function (properties) {
        var mixin = {},
            propertyNames = Object.getOwnPropertyNames(properties);

        propertyNames.forEach(name => {
            var privateAccessorName = '_' + name,
                titleCasedName = titlecase(name);

            mixin['get' + titleCasedName] = function () {
                return this[privateAccessorName];
            };

            mixin['_set' + titleCasedName] = function (next) {
                if (this[privateAccessorName] !== next) {
                    this[privateAccessorName] = next;
                    this.trigger(name);
                }
            };
        });

        mixin.init = function () {
            propertyNames.forEach(name => {
                this['_' + name] = properties[name];
            });
        };

        return mixin;
    };

    function titlecase(s) {
        return (s[0] || '').toUpperCase() + s.substr(1);
    }
}();