!function (React, $) {
    'use strict';

    var {PropTypes} = React,
        propsToCopy = ['animation', 'content', 'title', 'trigger'];

    window.UI.Popover = React.createClass({
        propTypes: {
            animation: PropTypes.bool,
            className: PropTypes.string,
            content: PropTypes.string,
            show: PropTypes.bool,
            style: PropTypes.any,
            title: PropTypes.string,
            trigger: PropTypes.oneOf(['click', 'hover', 'focus', 'manual'])
        },
        componentDidMount: function () {
            this.updatePopover({}, {});
        },
        componentWillUnmount: function () {
            this._mounted && $(React.findDOMNode(this.refs.popover)).popover('destroy');
        },
        componentDidUpdate: function (prevProps, prevState) {
            this.updatePopover(prevProps, prevState);
        },
        updatePopover: function (prevProps, prevState) {
            var {props} = this,
                {content, show, title, trigger} = props,
                $element = $(React.findDOMNode(this.refs.popover)),
                options = {};

            if (show) {
                var changed = propsToCopy.some(name => prevProps[name] !== props[name]);

                if (changed) {
                    propsToCopy.forEach(function (name) {
                        options[name] = props[name];
                    });

                    this._mounted && $element.popover('destroy');

                    setTimeout(function () {
                        $element.popover(options).popover('show');
                    }, options.animation === false ? 0 : 200);
                }
            } else {
                this._mounted && $element.popover('destroy');
            }

            this._mounted = show;
        },
        render: function () {
            var that = this,
                {props} = that,
                {className} = props,
                classNames = ['bs-popover'];

            className && classNames.push(className);

            return <div className={classNames.join(' ')} ref="popover" style={{display: 'inline-block'}}>{props.children}</div>;
        }
    });
}(window.React, window.jQuery);