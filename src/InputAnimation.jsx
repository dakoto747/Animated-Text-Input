'use strict';

var React = require('react');
var BlinkingCursor = require('./BlinkingCursor.jsx');
var PropTypes = require('prop-types');

class InputAnimation extends React.Component {


    constructor(props){
      super(props);
      this.state = {
        letterInterval: null,
        _textIndex: 0,
        _charIndex: 0,
        _deleting: false,
        // texts: [''],
        // typeInterval: 125,
        // deleteInterval: 80,
        // interTextInterval: 1000,
        // blinkInterval: 500,
        // speedVariation: 100,
        // loop: false,
      }
      this.getInitialState = this.getInitialState.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.componentWillUnMount = this.componentWillUnMount.bind(this);
      this._tick = this._tick.bind(this);
      this._type = this._type.bind(this);
      this._delete = this._delete.bind(this);
      this._getDisplayText = this._getDisplayText.bind(this);
      this._onInterText = this._onInterText.bind(this);
      this._getFirstLetter = this._getFirstLetter.bind(this);
      this._getFinalTypeInterval = this._getFinalTypeInterval.bind(this);
    }

    getInitialState () {
        return {
            text: 'this._getFirstLetter()'
        };
    }

    componentDidMount () {
        this.letterInterval = setInterval(this._tick, this._getFinalTypeInterval());
    }

    componentWillUnMount () {
        clearInterval(this.letterInterval);
    }

    _tick () {
        clearInterval(this.letterInterval);

        if (this.state._deleting) {
            this.letterInterval = setInterval(this._tick, this.props.deleteInterval);
            this._delete();
        }
        else {
            this.letterInterval = setInterval(this._tick, this._getFinalTypeInterval());
            this._type();
        }
    }

    _type () {
        let textCharCount = this.props.texts[this.state._textIndex].length;
        let displayText;
        let toNewText = false;

        this.state._charIndex++;

        if (this.state._charIndex >= textCharCount) {
            this.state._charIndex--;

            if (this.state._textIndex >= this.props.texts.length - 1) {    // Complete one loop
                if (this.props.loop) {
                    toNewText = true;
                }
                else {  // End
                    clearInterval(this.letterInterval);
                    return ;
                }
            }
            else {  // Complete one text, and move to next
                toNewText = true;
            }
        }
        else {
            displayText = this._getDisplayText(this.state._charIndex);
        }

        if (toNewText) {
            this.state._deleting = true;
            this._onInterText();
        }
        else {
            this.setState({
                text: displayText
            });
        }
    }

    _delete () {
        this.state._charIndex--;
        let displayText;

        if (this.state._charIndex < 0) {    // Can move to new text
            this.state._deleting = false;
            this.state._charIndex = 0;
            this.state._textIndex++;

            if (this.state._textIndex >= this.props.texts.length) {
                this.state._textIndex = 0;
            }

            this._onInterText();

            displayText = '';
        }
        else {  // Keep deleting
            displayText = this._getDisplayText(this.state._charIndex);
        }

        this.setState({
            text: displayText
        });
    }

    _getDisplayText (nextIndex) {
        let targetText = this.props.texts[this.state._textIndex];
        return targetText.substring(0, nextIndex+1);
    }

    _onInterText () {
        clearInterval(this.letterInterval);

        let interTextInterval = setInterval(() => {
            this.letterInterval = setInterval(this._tick, this.props.typeInterval);
            clearInterval(interTextInterval);

            this.setState({
                text: this._getDisplayText(this.state._charIndex)
            });
        }, this.props.interTextInterval);
    }

    _getFirstLetter () {
        return this.props.texts[this.state_textIndex][0];
    }

    _getFinalTypeInterval () {
        return this.props.typeInterval + (Math.random() - 0.5) * this.props.speedVariation;
    }

    render () {
        let {style, blinkInterval} = this.props;
        return (
            <span>
                <span >{this.state.text}</span>
                <BlinkingCursor
                    style = {style}
                    interval = {blinkInterval}
                    />
            </span>
        );
        // <span {...this.props}>{this.state.text}</span>

    }
}

    InputAnimation.defaultProps = {
                texts: [''],
                typeInterval: 125,
                deleteInterval: 80,
                interTextInterval: 1000,
                blinkInterval: 500,
                speedVariation: 100,
                loop: false
            };

    InputAnimation.propTypes ={
                // The texts to animate.
                texts: PropTypes.array,

                // The pause time for 'typing' each letter in ms.
                typeInterval: PropTypes.number,

                // The pause time for 'pressing delete key' in ms.
                deleteInterval: PropTypes.number,

                // The pause time before deleting, and before typing new text in ms.
                interTextInterval: PropTypes.number,

                // The interval for the blinking cursor to blink
                blinkInterval: PropTypes.number,

                // The variations for typeInterval.
                // The final type pause time will be in the range of
                // [typeInterval - speedVariation, typeInterval + speedVariation]
                speedVariation: PropTypes.number,

                // Loop through the texts again & again
                loop: PropTypes.bool
            },

module.exports = InputAnimation
