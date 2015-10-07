'use strict';

var {React} = window,
    {PropTypes} = React;

export var ExpandingInput = React.createClass({
    propTypes: {
        onChange: PropTypes.func,
        onKeyDown: PropTypes.func,
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
                       onKeyDown={props.onKeyDown}
                       placeholder={props.placeholder}
                       title={props.title}
                       type={props.type}
                       value={props.value} />
            </span>
        );
    }
});
