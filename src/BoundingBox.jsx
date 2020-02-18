import React from 'react';
import ReactDOM from 'react-dom';
import ResizeBox from './ResizeBox'


class BoundingBox extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        ElementStyle: {
          left: props.l + "px",
          top: props.t + "px",
          width: props.w + "px",
          height: props.h + "px",
          cursor: "default",
        },
        l: props.l,
        t: props.t,
        h: props.h,
        w: props.w,
        diffx: 0,
        diffy: 0,
        dragModeOn: false,
        resizeModeOn: false,
        possibleResizeModeOn: false, // if active -> do not drag
      };
  
  
      this.handleResize = this.handleResize.bind(this)
    }
  
    componentDidMount = () => {
  
          ReactDOM.findDOMNode(this).addEventListener('mousedown', this.handleMouseDown); 
          ReactDOM.findDOMNode(this).addEventListener('mousemove', this.handleDrag); 
  
          //in handle: remove 'mousedown' while mouse down, add when mouse up
          if (this.props.isSelected){
            //console.log('mount selected element ' + this.props.number)
            //ReactDOM.findDOMNode(this).addEventListener('mousedown', this.handleMouseDown); 
          }else{
            //console.log('mount un-selected element')
          }
  
          //in handle: remove 'mouseup' while mouse up, add when mouse down
          //in handle: remove 'mousemove' while mouse up, add when mouse down
    }
  
    componentWillUnmount = () => {
      // remove all listeners that are attached to this
      ReactDOM.findDOMNode(this).removeEventListener('mousedown', this.handleMouseDown); 
      document.removeEventListener('mouseup', this.handleMouseUp); 
      document.removeEventListener('mousemove', this.handleMouseUp); 
    }
  
    render() {
      // add resize box only to selected element
  
      var resizebox;
      if (this.props.isSelected) {
        resizebox = (
        <ResizeBox posx={(this.state.w - 5) + "px"} posy={(this.state.h - 5) + "px"} 
        handleResize = {this.handleResize}
        ></ResizeBox>)
      }
  
      return (
        <div className ={this.props.classname} style={this.state.ElementStyle} >
          {resizebox}
        </div>
      );
    }
  
    handleResize = (event) => {
      console.log('handle resize')
      // only if this is the selected bbox
      if(this.props.isSelected){
      if (event.type === 'mousedown'){
        //console.log('clicked: resize me')
  
        // enter resize state
        this.setState({
          resizeModeOn: true,
        });
        this.setState({          
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
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
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
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
                left: this.state.ElementStyle.left,
                top: this.state.ElementStyle.top,
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
                  left: this.state.ElementStyle.left,
                  top: this.state.ElementStyle.top,
                  height: (this.state.h) + "px",
                  width: this.state.ElementStyle.width,
                  cursor: "nw-resize",
                }
              });
            }
  
  
            // only pass changed values to parent
            this.props.handleBBoxUpdate(this.state.l,this.state.t,this.state.w,this.state.h, this.props.number); 
        }
      } else if (event.type === "mouseout") {
        this.setState({
          possibleResizeModeOn: false,
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
            height: this.state.ElementStyle.height,
            width: this.state.ElementStyle.width,
            cursor: "move",
          }
        });
        
      }
      } else {
        this.setState({
          possibleResizeModeOn: false,
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
            height: this.state.ElementStyle.height,
            width: this.state.ElementStyle.width,
            cursor: "default",
          }
        });
      }
    }
  
    handleMouseDown = (event) => {
        // only if this is the selected bbox
        if(this.props.isSelected){
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
      } else {
        this.setState({
          possibleResizeModeOn: false,
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
            height: this.state.ElementStyle.height,
            width: this.state.ElementStyle.width,
            cursor: "default",
          }
        });
      }
     }
  
     handleMouseUp = (event) => {
      if(this.props.isSelected){
        //console.log('handle mouse up - remove mouse move listener')
        document.removeEventListener('mousemove', this.handleResize); 
          this.setState({          
            ElementStyle: {
              left: this.state.ElementStyle.left,
              top: this.state.ElementStyle.top,
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
          
          if (ReactDOM.findDOMNode(this) !== undefined){
            ReactDOM.findDOMNode(this).addEventListener('mousedown', this.handleMouseDown);
          }
          document.removeEventListener('mouseup', this.handleMouseUp);
      } else {
        this.setState({
          possibleResizeModeOn: false,
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
            height: this.state.ElementStyle.height,
            width: this.state.ElementStyle.width,
            cursor: "default",
          }
        });
      }
     }
  
     handleDrag = (event) => {
      if(this.props.isSelected){
        this.setState({          
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
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
              left: (event.pageX - this.state.diffx) + "px",
              top: (event.pageY - this.state.diffy) + "px",
              height: this.state.ElementStyle.height,
              width: this.state.ElementStyle.width,
              cursor: "move",
            }
          });
          this.props.handleBBoxUpdate(this.state.l,this.state.t,this.state.w,this.state.h, this.props.number); 
        }
      }else {
        this.setState({
          possibleResizeModeOn: false,
          ElementStyle: {
            left: this.state.ElementStyle.left,
            top: this.state.ElementStyle.top,
            height: this.state.ElementStyle.height,
            width: this.state.ElementStyle.width,
            cursor: "default",
          }
        });
      }
    }
  }
  
  export default BoundingBox;