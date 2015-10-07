export var CodeView = React.createClass({
    propTypes: {
        capabilities: PropTypes.any
    },
    render: function () {
        var that = this,
            {props} = that,
            code = Formatters.javascript(props.capabilities, props.steps);

        return (
            <div className="ui-codeview">
                <pre>{code}</pre>
            </div>
        );
    }
});
