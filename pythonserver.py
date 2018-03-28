#
#   Hello World server in Python
#   Binds REP socket to tcp://*:5000
#

import time
import zmq
import json

context = zmq.Context()
socket = context.socket(zmq.REP)
# Let the socket listen to connections from any IP and port 5000 socket.bind("tcp://*:5000")
print "Socket created.."
print "Entering a loop to listen for connections"

while True:
    #  Wait for next request from client
    message = socket.recv()
    #  Do some 'awesome computation work'
    time.sleep(1)
    received_message = json.loads(message)
    print("Received message on server is: "+received_message['message'])
    received_message['message'] = "Awesome results from python\n"

    #  Send reply back to client
    socket.send(json.dumps(received_message));