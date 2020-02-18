import React, { Component } from 'react'
import Slider from './Slider.jsx'
import BoundingBox from './BoundingBox'
import SpeechBubble from './SpeechBubble'
import SpeechBubbleFlipped from './SpeechBubbleFlipped'

// color scheme https://www.schemecolor.com/coral-blue.php
class App extends Component {
  constructor(props) {
    super(props);
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

  constructor(props) {
    super(props);

    // add empty bbox [0,0,0,0] for every frame
    var _trackerOutput = []
    var _num_imgs = 140;
    for (var i = 0; i < _num_imgs; i++) {
      _trackerOutput.push([0,0,0,0]);
    }

    _trackerOutput[0][0] = 40;
    _trackerOutput[0][1] = 42;
    _trackerOutput[0][2] = 23;
    _trackerOutput[0][3] = 66;

    this.state = { 
      trackerOutput: _trackerOutput, 
      frameNumber: 1, //start counting at 1
      maxFrameNumber: 1, // max frame number that has been labelled by tracker or manually
      imagesrc: "pedestrian/00000001.jpg",
      imagewidth: 1,
      original_imagewidth: 1,
      original_height: 1,
      imagebasepath: "pedestrian/",
      trackingInProgress: 0,
      // props for BoundingBox
      l: _trackerOutput[0][0],
      t: _trackerOutput[0][1],
      h: _trackerOutput[0][2],
      w: _trackerOutput[0][3],
      num_imgs: _num_imgs,
      frameNumberStyle : {
        position: "relative",
        left: "3px",
      },
      colorPalette: {
        CoralReef: "#FD7C6F",
        LightSalmon: "#F89D7D",
        RoyalBlue: "#4760E9",
        BleuDeFrance: "#3197E9", 
        DarkTurquoise: "#11CDDE",
        LightGray: "#DEDEDE",
      },
    };

    this.handleBBoxUpdate = this.handleBBoxUpdate.bind(this)
    this.setFrameNo = this.setFrameNo.bind(this)
    this.onImgLoad = this.onImgLoad.bind(this)    
    this.closeHint = this.closeHint.bind(this)

    //this.getImageCount()
  }

/*
getImageCount() {

  var imageExists = true;
  var frameno = 100;
  while(imageExists){
    var img = new Image();
    img.src = this.getFrameFromFrameNo(frameno)

    // if this failed, so the final image was the previous one
    img.onerror = function() {  imageExists = false}
    frameno = frameno + 1;
  }
  console.log('num imgs ' + imageExists)

}*/


  // https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
  // https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
  // ref: https://stackoverflow.com/questions/51845170/how-to-deploy-a-node-js-app-that-runs-a-python-script-in-azure
  //connect to node.js (code in api folder)
  runTracker() {
    if (this.state.trackingInProgress === 0 && this.state.frameNumber < this.state.num_imgs) {
      this.setState({
        trackingInProgress: 1,
      });

      let f = this.state.frameNumber - 1  

      //let url = "https://video-annotation-tool.azurewebsites.net/"

      // "../../api/routes/callPython/left/" 
      let url = "http://localhost:9000/callPython/" // what path??
      // port= set in www...

      let pythonCall =  url + "left/" +  
                        + this.state.trackerOutput[f][0] +"/top/"
                        + this.state.trackerOutput[f][1] +"/width/"
                        + this.state.trackerOutput[f][2] +"/height/"
                        + this.state.trackerOutput[f][3] +"/frameno/" 
                        + f + "/"


      console.log('App:  python call ' + pythonCall);
      fetch(pythonCall) 
        .then(res => res.text())
        .then(res => this.handleTrackerOutput(res) );      

        document.activeElement.blur(); // remove focus from button after click  => not triggered by pressing enter
    }
  }

  

  render(){

    const boundingBoxes = [];
    
    // code below prints all selected bboxes
    /*
    for (var i = 0; i < this.state.trackerOutput.length; i += 1) { // this.state.numChildren
      
      //console.log('add? ' + this.state.trackerOutput[i][0] + ' ' + this.state.trackerOutput[i][1]+ ' ' + this.state.trackerOutput[i][2]+ ' ' + this.state.trackerOutput[i][3]) 
      if(this.state.trackerOutput[i][0] !== undefined 
        && this.isValidBBox(this.state.trackerOutput[i])){
        let _classname = "bbox"
        let _isSelected = false
        if (i !== this.state.frameNumber-1){
          //_classname = "bbox selected"
          //_isSelected = true
          //console.log('selected bbox')
       

        //console.log('add ' + this.state.trackerOutput[i])

        boundingBoxes.push(<BoundingBox 
          l = {this.state.trackerOutput[i][0]} 
          t = {this.state.trackerOutput[i][1]} 
          w = {this.state.trackerOutput[i][2]} 
          h = {this.state.trackerOutput[i][3]}  
          key={i} 
          number={i}
          classname = {_classname}
          isSelected = {_isSelected}
          frameNumber = {this.state.frameNumber}
          handleBBoxUpdate = {this.handleBBoxUpdate} />);
        }
      }
    };*/

    let _classname = "bbox selected"
    let _isSelected = true
    var i = this.state.frameNumber-1
    //console.log('valid framenumber? ' + (i))
    // place selected bbox on top
    boundingBoxes.push(<BoundingBox 
      l = {this.state.trackerOutput[i][0]} 
      t = {this.state.trackerOutput[i][1]} 
      w = {this.state.trackerOutput[i][2]} 
      h = {this.state.trackerOutput[i][3]}  
      key={i} 
      number={i}
      classname = {_classname}
      isSelected = {_isSelected}
      frameNumber = {this.state.frameNumber}
      handleBBoxUpdate = {this.handleBBoxUpdate} />);

    //note: changed slider from input type="range" min="1" step="1" to Slider
    var diplayWaitIcon = 'none';
    if(this.state.trackingInProgress === 1){
      diplayWaitIcon = 'inline';
    }

    var displaySpeechBubble1 = 'none';
    if(this.state.frameNumber === 1){
      displaySpeechBubble1 = 'inline';
    }

    var displaySpeechBubble2 = 'none';
    if(this.state.maxFrameNumber > 1){
      displaySpeechBubble2 = 'inline';
    }

    return (

      <div id="FrameArea">
      {boundingBoxes}
      <img id = "frame" className = "frame" onLoad={this.onImgLoad} src={this.state.imagesrc}  alt="" draggable="false"></img>
      <input type="image" src="track-icon.svg" alt="run tracker" id="btn_runtracker" onClick = {() => this.runTracker()}/>
      <input type="image" style={{display: diplayWaitIcon}} className="rotating" src="wait-icon.svg" alt="run tracker"/>
      <Slider max_value={this.state.num_imgs} max_tracked = {this.state.maxFrameNumber}  min_value = {1} value={this.state.frameNumber} setFrameNo = {this.setFrameNo} colorPalette = {this.state.colorPalette} imagewidth = {this.state.imagewidth} num_imgs = {this.state.num_imgs}/>
      <SpeechBubble text = 'Click to run tracker and get bounding box suggestions.' display = 'inline' width = '342px' left = '343px' top = '-110px' lineHeight = '50px'></SpeechBubble>
      <SpeechBubble text = 'Mark object with box. Press Enter to see next frame.' display = {displaySpeechBubble1}  width = '320px' left = '10px' top = '-72px' lineHeight = '50px'></SpeechBubble>
      <SpeechBubbleFlipped text = 'Move slider or press arrows to see marked frames.' onClick = {this.closeHint} display = {displaySpeechBubble2}  width = '320px' left = {(this.state.frameNumber - 1) * (this.state.imagewidth/this.state.num_imgs) - 24} top = '310px' lineHeight = '50px'></SpeechBubbleFlipped>

      </div>
    )
  }


  closeHint(){
    console.log('close')
  }

  setFrameNo(frameno){
    this.setState({
      frameNumber: frameno,
    }, () => {
      this.setState({
        imagesrc: this.getFrame(),
      });
    });
  }


  handleTrackerOutput(res){
    console.log('handle tracker output')
    res = res.split('\r\n')
    var _trackerOutput = this.state.trackerOutput;

    // note: at this point frameNumber is the frame where the tracker run started
    // res starts at frameNumber
    var last_tracked_box = this.state.frameNumber;
    for (var i = this.state.frameNumber; i < Math.min(this.state.frameNumber + res.length - 2, this.state.num_imgs); i++ ){ //-2 because there is always an empty string at the end

      var item = res[i - this.state.frameNumber + 1].split(',');
      if(item[0] !== ""){
        _trackerOutput[i][0] = item[0]; 
        _trackerOutput[i][1] = item[1]; 
        _trackerOutput[i][2] = item[2]; 
        _trackerOutput[i][3] = item[3]; 
        last_tracked_box = i;
      }else{
        break;
      }
    }

    // now that we added all the tracked bounding boxes until failure:
    // add at the same location as the last fail all other bboxes

    // suggest bbox one frame after tracking failure frame
    if (i > 0 && last_tracked_box + 1 < this.state.num_imgs){
      let i = last_tracked_box + 1 //TODO remove + 1??
      _trackerOutput[i][0] = _trackerOutput[i-1][0]; 
      _trackerOutput[i][1] = _trackerOutput[i-1][1]; 
      _trackerOutput[i][2] = _trackerOutput[i-1][2]; 
      _trackerOutput[i][3] = _trackerOutput[i-1][3];
    }

    var _new_frame_number = last_tracked_box + 1; 
    if (last_tracked_box + 2 <= this.state.num_imgs){
      _new_frame_number = last_tracked_box + 2;
    }
    console.log('set frameNumber to ' + _new_frame_number)

    this.setState({ 
      trackingInProgress: 0,
      trackerOutput: _trackerOutput,
      frameNumber: _new_frame_number,
      maxFrameNumber: _new_frame_number,
      imagesrc: this.getFrameFromFrameNo(_new_frame_number),
    } );

    console.log('set maxFrameNumber ' + this.state.maxFrameNumber)
  }

  getFrame(){
    return this.state.imagebasepath + this.pad(this.state.frameNumber,8) +".jpg"  //number with 8 digits pad with leading zeros
  }

  getFrameFromFrameNo(frameno){
    return this.state.imagebasepath + this.pad(frameno,8) +".jpg"  //number with 8 digits pad with leading zeros
  }

  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


onImgLoad(){
   
  this.setState({
    original_imagewidth: document.getElementById('frame').clientWidth,
    original_imageheight: document.getElementById('frame').clientHeight,
    imagewidth: document.getElementById('frame').clientWidth,
  });
  //this.reportWindowSize();

}

  componentDidMount() {
    document.getElementById('frame').ondragstart = function() { return false; };
    this.setState({
      imagesrc: this.getFrame(),
    });
    document.addEventListener("keydown", this.handleKeyPress)
    //window.addEventListener('resize', this.reportWindowSize);
  }

  /*
  reportWindowSize = () => {

    console.log('resize')
    var body = document.getElementsByTagName('body')[0];

    var o_h = this.state.original_imagewidth;
    var o_w = this.state.original_imageheight;

    // scale image so that it fits the screen
    var w = body.clientWidth - 200;
    var h = body.clientHeight - 200;

    if (o_w != w){

      var scale_factor_w = w / o_w;
      var new_height = o_h * scale_factor_w;

      console.log('oh' + o_h + 'new height ' + new_height)
      if (new_height > h) {
        var scale_factor_h = h / o_h;
        w = o_w * scale_factor_h;
      }

      this.setState({
        imagewidth: w,
      });
  }

  }*/

  handleBBoxUpdate(l,t,w,h,number){
    var temp_trackerOutput = this.state.trackerOutput;
    temp_trackerOutput[number][0] = l;
    temp_trackerOutput[number][1] = t;
    temp_trackerOutput[number][2] = w;
    temp_trackerOutput[number][3] = h;

    this.setState({
      trackerOutput: temp_trackerOutput,
    });
  }

  isValidBBox(bbox){
    return bbox[0] !== 0 || bbox[1] !== 0 || bbox[2] !== 0 || bbox[3] !== 0
  }

  handleKeyPress = (event) => {

    // if user presses enter -> confirm bounding box selection for current frame
    // -> advance frame number
    // save selection of curr bbox
    // jumpt to frame after curr frame
    // if next bbox exists, change curr and leave next bbox the same
    // if next bbox does not exist, set next bbox to curr

    if (event.keyCode === 13) {  // enter
      console.log("ENTER")      

      // if no bbox on this.state.frameNumber + 1 copy over previous bbox
      var _trackerOutput = this.state.trackerOutput
      let i = this.state.frameNumber

      if (
        this.isValidBBox(_trackerOutput[i] === false) &&
        i < this.state.num_imgs){
          _trackerOutput[i][0] = _trackerOutput[i-1][0]; 
          _trackerOutput[i][1] = _trackerOutput[i-1][1]; 
          _trackerOutput[i][2] = _trackerOutput[i-1][2]; 
          _trackerOutput[i][3] = _trackerOutput[i-1][3];

        let _new_frame_number = (Number(this.state.frameNumber) + 1)
        console.log('set new frameNumber ' + _new_frame_number)

        this.setState({
          frameNumber: _new_frame_number,
          maxFrameNumber: Math.max(_new_frame_number, this.state.maxFrameNumber), 
          trackerOutput: _trackerOutput,
        }, () => {
          this.setState({
            imagesrc: this.getFrame(),
          });
        });
      }
    }else if(event.keyCode === 39){ // right arrow
      console.log('RIGHT')
      this.setState({
        frameNumber: Math.min(this.state.frameNumber + 1, this.state.maxFrameNumber),
      }, () => {
        this.setState({
          imagesrc: this.getFrame(),
        });
      });
    }else if(event.keyCode === 37){ // left arrow
      console.log('LEFT')
      this.setState({
        frameNumber: Math.max(this.state.frameNumber - 1, 1),
      }, () => {
        this.setState({
          imagesrc: this.getFrame(),
        });
      });
    }

  }
}

export default App
