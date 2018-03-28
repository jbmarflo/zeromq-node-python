// Require the libraries for handling requests
const express = require('express');
const app = express();
// Require the ZeroMQ package for socket connections
var zmq = require('zeromq');
// A package to create unique uuid
var uuidv4 = require('uuid/v4');

// socket to talk to server
var requester = zmq.socket('req');
var responses = {};
// PYTHONSERVICE_PORT_5000_TCP is an environment variable
// made available by docker to identify the linked container
// inside the web container
// You can replace it with a remote IP:Port in the form:
// tcp://<remoteIP>:<remotePort>

requester.connect(process.env.PYTHONSERVICE_PORT_5000_TCP);
// A callback function for server response
requester.on("message", function(data) {
    console.log("Received reply");
    var data = JSON.parse(data);
    var msgId = data.id;
    var res = responses[msgId];
    // res is an object used to send responses back to client
    res.send(data.message);
    responses[msgId] = null;
});

app.get('/', function (req, res) {
    console.log("Sending request...");
    var msgId = uuidv4();
    var data = { id: msgId, message: 'Request to send some amazing data...'};
    responses[msgId] = res;
    requester.send(JSON.stringify(data));
})

app.listen(80, function () {
    console.log('Example app listening on port 80')
})

process.on('SIGINT', function() {
    requester.close();
});