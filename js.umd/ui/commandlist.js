export var CommandList = React.createClass({
    props: {
        onCommandClick: PropTypes.func
    },
    onCommandClick: function (name) {
        var handler = this.props.onCommandClick;

        handler && handler(name);
    },
    render: function () {
        var that = this,
            {props} = that;

        return (
            <ul className="ui-commandlist">
                {
                    Object.getOwnPropertyNames(Commands).map(name => {
                        var command = Commands[name];

                        return (
                            <li key={name}>
                                <button className="btn" onClick={that.onCommandClick.bind(null, name)}>{name}</button>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
});
