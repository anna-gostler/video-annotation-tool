import React from 'react';

// little box on bbox's lower right corner
// resizes box when dragged
// child of Bounding Box
class ResizeBox extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        resizeModeOn: false,
      };
    }
  
    render() {
      return (
        <div className="resizebox" style = {{left: this.props.posx, top: this.props.posy}}
          onMouseDown ={this.props.handleResize} // called in parent BoundingBox
          onMouseMove ={this.props.handleResize}
          onMouseOut ={this.props.handleResize}
        > 
        </div>
      );
    }
  }

  export default ResizeBox;