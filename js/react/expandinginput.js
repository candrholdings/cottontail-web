!function (React) {
    'use strict';

    var {PropTypes} = React;

    window.UI.ExpandingInput = React.createClass({
        propTypes: {
            onChange: PropTypes.func,
            placeholder: PropTypes.string,
            title: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.any
        },
        render: function () {
            var that = this,
                {state, props} = that;

            return (
                <span className="ui-expandinginput">
                    <div>{props.value || props.placeholder}</div>
                    <input onChange={props.onChange}
                           placeholder={props.placeholder}
                           title={props.title}
                           type={props.type}
                           value={props.value} />
                </span>
            );
        }
    });
}(window.React);