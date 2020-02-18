import React from 'react';

class SpeechBubbleFlipped extends React.Component {
      

    render() {
        return(
            <p className="speechflipped" style = {{
                width: this.props.width,
                left: this.props.left,
                top: this.props.top,
                lineHeight: this.props.lineHeight,
                display: this.props.display,
            }
        }
        >{this.props.text}</p>    
        );
    }





}  



export default SpeechBubbleFlipped;