'use strict';

var React = require('react');

class BlinkingCursor extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        interval: 500,
        visible: false
      }
      this._toggleVisibility= this._toggleVisibility.bind(this);
      this.getInitialState= this.getInitialState.bind(this);
      this.componentDidMount= this.componentDidMount.bind(this);
      this.componentWillUnMount= this.componentWillUnMount.bind(this);
    }

    getInitialState () {
        return {
            visible: false
        };
    }

    componentDidMount () {
        this.interval = setInterval(this._toggleVisibility, this.state.interval);
    }

    componentWillUnMount () {
        clearInterval(this.state.interval);
    }

    _toggleVisibility () {
        this.setState({
            visible: !this.state.visible
        });
    }

    render () {
        let blinkStyle = {
            opacity: this.state.visible ? 1 : 0
        };

        let {style} = this.state;
        blinkStyle = Object.assign(blinkStyle, style);

        return (
            <span style = {blinkStyle}>{'|'}</span>
        );
    }
}
BlinkingCursor.defaultProps = {
    interval: 500
};
module.exports = BlinkingCursor
