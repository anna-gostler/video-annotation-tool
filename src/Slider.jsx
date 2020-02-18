import React from 'react';
import ReactDOM from 'react-dom';

class Slider extends React.Component {


    // enter -> move to next frame number but do not overwrite bboxes if they exist (not [0000])
    // tracker -> extend maxtracked, overwrite following bboxes

    // new example vid (pedestrian from http://www.votchallenge.net/vot2018/dataset.html)

    // scale image / bbox by some factor

    // add explanation bubbles (tracker btn-run until fail, correct bbox, vid source, tracking in progress)

    //finally: upload to azure (install cv2)

    constructor(props) {
      super(props);
      console.log(this.props)
      this.state = {
        startPosX: 0, 
        offsetX: 0,
        dragModeOn: false,
      };
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).addEventListener('mousedown', this.handleSliderInput); 
        document.addEventListener('mousemove', this.handleSliderInput); 
        document.addEventListener('mouseup', this.handleSliderInput); 
    }


    handleSliderInput = (event) => {

        if (event.type === "mousedown"){
            console.log('slider mousedown')
          this.setState({
            startPosX: event.pageX,
            dragModeOn: true,
          });

        } else if (event.type === "mouseup"){ 
            console.log('slider mouseup')

            //update frameno depending on offset
            //convert pixel offset to slider value
            this.props.setFrameNo(this.props.value) //run tracker changes this to maxtracked
            this.setState({
                offsetX: event.pageX - this.state.startPosX,
                dragModeOn: false,
              });

        } else if (event.type === "mousemove"){
            // on move: register offset from start pos
            // allow slide only to already tracked/manually marked frames

            //convert framenumber to position on slider .. 
            // slider is either set manually or through pressing enter/tracking
            // set to frame number

            if (this.state.dragModeOn === true){

                var xPos = event.pageX;
                var new_left = xPos - 100; // 100 is left of FrameArea
                new_left = Math.max(this.props.min_value, new_left)

                var newFrameNumber = Math.ceil((new_left/this.props.imagewidth) * this.props.max_value);
                newFrameNumber = Math.min(newFrameNumber, this.props.max_tracked)

                this.setState({
                    offsetX:  xPos - this.state.startPosX,
                    selectedFrameNumber: newFrameNumber,
                }); 
                this.props.setFrameNo(newFrameNumber)
            }
        }
      }
  
    render() {

      return(
        <div style = {{
            width: this.props.imagewidth,
            backgroundColor: this.props.colorPalette.LightGray,
            height: "20px",
            borderRadius: "0px",
        }} 
        className="backgroundSlider">

        <div style = {{
            // width
            // ex: 25 out of 50 frames tracked 25/50 = 0.5
            // in perc: 0.5*100= 50%
            width: ((this.props.max_tracked)/this.props.num_imgs)*100 + '%', 
            backgroundColor:"#A9A9A9", 
            height:"20px", 
            top: "0px", 
            position: "relative"}} 
        className="trackedSlider"/>
            
        <div style = {{
            backgroundColor: this.props.colorPalette.RoyalBlue,
            height: "20px",
            borderRadius: "0px",
            position: "relative",
            top: "-20px",
            // width
            // ex: 25 out of 50 frames 25/50 = 0.5
            // in perc: 0.5*100= 50%
            width: ((this.props.value)/this.props.num_imgs)*100 +"%",   
            }} 
        className="selectedSlider"/>

        <div id="Thumb" className="Thumb" style = {{
            left: (this.props.value - 1) * (this.props.imagewidth/this.props.num_imgs), 
            backgroundColor: this.props.colorPalette.LightSalmon,
        }
        } onMouseDown = {this.props.handleSliderInput} onMouseUp = {this.props.handleSliderInput}>
            <p style = {{
                align:"center", 
                textAlign: "center", 
                verticalAlign: "middle",
                top: "25px", 
                position: "relative",
                }}>{this.props.value}</p>
        </div>
        </div>
      );
    }
  }

  export default Slider;