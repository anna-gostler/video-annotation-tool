import React, { Component } from 'react'
import ReactDOM from 'react-dom';

// color scheme https://www.schemecolor.com/coral-blue.php
class App extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="App">
        <FrameArea>
        </FrameArea>
      </div>
    )
  }
}

// area shows the video and is the region where the bounding-box(es)
// can be moved 
class FrameArea extends React.Component {

  // TODO run tracker (runopencvtrackers.py)
  render(){
    return (
      <div id="FrameArea">
      <BoundingBox></BoundingBox>
      <img id = "frame" src="images/00000001.jpg" alt="" width="500" draggable="false" onmousedown="return false;" ></img>
      <button id="btn_runtracker">run tracker</button>
      </div>
    )
  }

  componentDidMount() {
    document.getElementById('frame').ondragstart = function() { return false; };
  }

}


class BoundingBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ElementStyle: {
        top: "113px",
        left: "465px",
        width: "34px",
        height: "34px",
        cursor: "move",
      },
      t: 113,
      l: 465,
      h: 34,
      w: 34,
      diffx: 0,
      diffy: 0,
      dragModeOn: false,
      resizeModeOn: false,
      possibleResizeModeOn: false, // if active -> do not drag
    };

    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
        //in handle: remove 'mousedown' while mouse down, add when mouse up
        ReactDOM.findDOMNode(this).addEventListener('mousedown', this.handleMouseDown); 

        //in handle: remove 'mouseup' while mouse up, add when mouse down
        //in handle: remove 'mousemove' while mouse up, add when mouse down
  }

  render() {
    return (
      <div className="bbox" style={this.state.ElementStyle} >
        <ResizeBox posx={(this.state.w - 2.5) + "px"} posy={(this.state.h - 2.5) + "px"} 
          //onClick = {() => this.handleResize()}
          handleResize = {this.handleResize}
        ></ResizeBox>
      </div>
    );
  }

  handleResize = (event) => {
    if (event.type === 'mousedown'){
      //console.log('clicked: resize me')

      // enter resize state
      this.setState({
        resizeModeOn: true,
      });
      this.setState({          
        ElementStyle: {
          top: this.state.ElementStyle.top,
          left: this.state.ElementStyle.left,
          height: this.state.ElementStyle.height,
          width: this.state.ElementStyle.width,
          cursor: "nw-resize",
        }
      });
      document.addEventListener('mousemove', this.handleResize); 

    } else if (event.type === 'mousemove'){
      //console.log('listen for mouse-up')
      document.addEventListener('mouseup', this.handleMouseUp); 
      this.setState({          
        ElementStyle: {
          top: this.state.ElementStyle.top,
          left: this.state.ElementStyle.left,
          height: this.state.ElementStyle.height,
          width: this.state.ElementStyle.width,
          cursor: "nw-resize",
        }
      });

      this.setState({ 
        possibleResizeModeOn: true, 
      });
      if (this.state.resizeModeOn){
        var minwidthheight = 5;
        var offset_framearea = 100;

        // stop if width/height == 0
        if (this.state.w >= minwidthheight){
          // add mouse-position to width
          this.setState({
            w: Math.max(minwidthheight,event.pageX - this.state.l - offset_framearea),
          });
    
          this.setState({          
            ElementStyle: {
              top: this.state.ElementStyle.top,
              left: this.state.ElementStyle.left,
              height: this.state.ElementStyle.height,
              width: (this.state.w) + "px",
              cursor: "nw-resize",
            }
          });
        }
        if (this.state.h >= minwidthheight){
            // add mouse-position to height
            this.setState({
              h: Math.max(minwidthheight, event.pageY - this.state.t - offset_framearea),
            });
      
            this.setState({          
              ElementStyle: {
                top: this.state.ElementStyle.top,
                left: this.state.ElementStyle.left,
                height: (this.state.h) + "px",
                width: this.state.ElementStyle.width,
                cursor: "nw-resize",
              }
            });
          }
      }
    }
  }

  handleMouseDown = (event) => {
      //console.log('clicked: drag me')
      //console.log('possible resize? ' + this.state.possibleResizeModeOn)

      //check if resize is on
      // if click is inside resize-box -> resize
      // otherwise -> drag

      if (this.state.possibleResizeModeOn === false){
        this.setState({
          dragModeOn: true,
          diffx: event.pageX - this.state.l,
          diffy: event.pageY - this.state.t,
        });
        document.addEventListener('mousemove', this.handleDrag);
        ReactDOM.findDOMNode(this).removeEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mouseup', this.handleMouseUp); 
      }
   }

   handleMouseUp = (event) => {
    //console.log('handle mouse up - remove mouse move listener')
    document.removeEventListener('mousemove', this.handleResize); 
      this.setState({          
        ElementStyle: {
          top: this.state.ElementStyle.top,
          left: this.state.ElementStyle.left,
          height: this.state.ElementStyle.height,
          width: this.state.ElementStyle.width,
          cursor: "move",
        }
      });

      this.setState({
        dragModeOn: false,
        possibleResizeModeOn: false, 
        resizeModeOn: false,
      }); 
      document.removeEventListener('mousemove', this.handleDrag); 
      ReactDOM.findDOMNode(this).addEventListener('mousedown', this.handleMouseDown);
      document.removeEventListener('mouseup', this.handleMouseUp);
   }

   handleDrag = (event) => {
      this.setState({          
        ElementStyle: {
          top: this.state.ElementStyle.top,
          left: this.state.ElementStyle.left,
          height: this.state.ElementStyle.height,
          width: this.state.ElementStyle.width,
          cursor: "move",
        }
      });
      if (this.state.dragModeOn === true) {
        this.setState({
          l: event.pageX - this.state.diffx,
          t: event.pageY - this.state.diffy,
        });

        this.setState({
          ElementStyle: {
            top: (event.pageY - this.state.diffy) + "px",
            left: (event.pageX - this.state.diffx) + "px",
            height: this.state.ElementStyle.height,
            width: this.state.ElementStyle.width,
            cursor: "move",
          }
        });
      }
    }
}

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
      > 
      </div>
    );
  }

}

export default App
