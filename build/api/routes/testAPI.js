/*var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

module.exports = router;*/


var express = require("express");
var router = express.Router();

/*
const app = express()
router.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['C:\Users\anna_\azuretest\annotation-tool\public\test.py']);

    var py_res;
    pyProg.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end('end');
        py_res = data.toString();
    });
    res.send('<<<<<<<<<<<<<<<<<<'+py_res+'>>>>>>>>>>>>>>')
})*/

/*
router.get("/", function(req, res, next) {
    res.send("API is working properly");
});*/

/*
router.get("/", function(req, res) {
    var arg1;
    var arg2;
    var py_res;
    const spawn = require("child_process").spawn;//.exec;
    const pythonProcess = spawn('python',['C:\Users\anna_\azuretest\annotation-tool\public\test.py']); //, arg1, arg2
    pythonProcess.stdout.on('data', (data) => {
        py_res = data;
        console.log(data.toString())
        console.log('hello??')
        res.write(data);
        res.end('end');
        res.send('<<<<<<<<<<<<<<<<<<'+py_res+'>>>>>>>>>>>>>>')
    });
    console.log('outside python call')
});
module.exports = router;*/


///
/*
var express = require('express');
var pythonShell = require('python-shell');
//let {pythonShell} = require('python-shell')
var router = express.Router();

var options = {
  //pythonPath: 'D:/home/python364x64/python',
  //scriptPath: 'D:/home/site/wwwroot'
  pythonPath: 'C:/Users/anna_/azuretest/venv/Scripts', //'../../../../venv/Scripts',
  scriptPath: 'C:/Users/anna_/azuretest/annotation-tool/public' //'../../../public'
  

  // args:
  // [
  //     req.query.term,
  //     req.params.id,
  //     req.session.user.searchName,
  //     req.session.user.searchKey
  // ]
};

var resultsByRel;


pythonShell.run('test.py', options, function (err, data) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  var values = JSON.parse(data[0]);
  resultsByRel = values;
  console.log('results: %j', resultsByRel);
});

router.get('/', function(req, res, next) {
  res.send(resultsByRel);
  // res.render('executePython', resultsByRel );  
});

module.exports = router;*/

///
/*var express = require("express");
var router = express.Router();

const spawn = require("child_process").spawn;
var arg1;
var arg2;
const pythonProcess = spawn('python',["C:/Users/anna_/azuretest/annotation-tool/public/test.py", arg1, arg2]);
pythonProcess.stdout.on('data', (data) => {
   console.log(data);
});

module.exports = router;*/


///////


/*
const express = require('express')
var router = express.Router();
const app = express()

router.get("/", function(req, res, next) {
    res.send('test');
});


app.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['C:/Users/anna_/azuretest/annotation-tool/public/test.py']);

    pyProg.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))
module.exports = router;
*/

/*
const express = require('express')
const app = express()

app.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['C:/Users/anna_/azuretest/annotation-tool/public/test.py']);

    pyProg.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
        res.send('hallo')
    });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))
module.exports = app;*/


//////
// https://stackoverflow.com/questions/55152156/im-not-able-to-execute-python-script-from-an-express-app
var exec = require('child_process').exec
router.get('/', callpython);


function callpython(req, res){
    console.log('callpython')
    var child = exec('python C:/Users/anna_/azuretest/annotation-tool/public/test.py');
    child.stdout.on('data', function(data){
        console.log('data ' + data)
        res.send(data)
    })
    child.on('close', function(code) {
        console.log('closing code: ' + code)
    })
}
module.exports = router;


