var express = require("express");
var router = express.Router();

// https://stackoverflow.com/questions/55152156/im-not-able-to-execute-python-script-from-an-express-app
var exec = require('child_process').exec
router.get('/left/:leftVal/top/:topVal/width/:widthVal/height/:heightVal/frameno/:framenoVal/', callpython);


function callpython(req, res){
    console.log(req.params);
    console.log('inside callpython(req, res): call python')
    console.log('WARNING: if fail check')

    var child = exec('python ../../runtrackers.py ' //'python C:/Users/anna_/azuretest/annotation-tool/public/runtrackers.py '
    + req.params["leftVal"] + ' ' 
    + req.params["topVal"] + ' '
    + req.params["widthVal"] + ' '
    + req.params["heightVal"] + ' '
    + req.params["framenoVal"]
    );


    var responseSent = false; // ensure that process sends only one response

    child.stdout.on('data', function(data){
        if (responseSent == false){
            console.log('res.send(data)')
            console.log(data)

            res.send(data)
            responseSent = true;
        }
    })
    child.on('close', function(code) {
        console.log('closing code: ' + code)
    })
}
module.exports = router;


