const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const webapp = express();

// Setup Variables
const ccPort = 4000;
const httpsPort = 443;
const httpPort = 80;
const useccTLS = true;
const usewebTLS = true;
const useLocalSSL = false;   // Use the local certificate to test locally

var connections = [];
var sslInfo;

// SSL/TLS info
if (usewebTLS){

  if(useLocalSSL){
    sslInfo = {
      cert: fs.readFileSync('ssl/https.crt'),
      key: fs.readFileSync('ssl/https.key')
    };
  } else{
    sslInfo = {
      cert: fs.readFileSync('../../../../etc/letsencrypt/live/cc-jef.com/fullchain.pem'),
      key: fs.readFileSync('../../../../etc/letsencrypt/live/cc-jef.com/privkey.pem')
    };
  }
}

var webServer;
if (usewebTLS){
  webServer = https.Server(sslInfo, webapp);
} else{
  webServer = http.Server(webapp);
}
const httpsio = require('socket.io')(webServer);
webapp.use(express.static('public'));

// Should we encrypt the ccClient <-> Server websocket? (disable during local testing)
var wss;
if (useccTLS){
  const cchttpsServer = https.Server(sslInfo);
  cchttpsServer.listen(ccPort);

  const webSocketServer = WebSocket.Server;
  wss = new webSocketServer({
    server : cchttpsServer
  });
} else{
  wss = new WebSocket.Server({ port : ccPort});
}

// Listen for incoming connections on http server
webServer.listen(process.env.PORT || httpsPort || httpPort, function(){
  console.log('Webserver Started at Port: ' + httpsPort);
});

// Default https page
webapp.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/website/index.html'));
});

// Handle connections coming back from the browser clients (probably to send data to CC client)
httpsio.on('connection', (socket) => {
  console.log("Connection with webclient Established!");

  // Check if connection is reconnect from the redirection (comparing socket IP-adress)
  for (const connection of connections){
    if (connection['WEBSOCKET'] == socket.conn.remoteAddress){
      connection['WEBSOCKET'] = socket;
      connection['CCSOCKET'].send("Web-Client has Connected to JEF with UUID: " + connection['UUID']);
      connection['CCSOCKET'].send('RAD');   // Request All Data
      connection['STATUS'] = 'CONNECTED';
    }
  }

  // Check message coming from broswer client to server (Either setup request or CC data to be sent)
  socket.on('message', (message) => {
    console.log("Webclient sent Message: " + message);

    // A connection request (setup), RCO = Request Connection
    if (message['TYPE'] == "RCO"){
      console.log("Webclient Requesting Connection with: " + message['UUID']);

      // Add webclient to the connection in connections
      var connFound = false
      for (const connection of connections){
        if (connection['UUID'] == message['UUID']){
          // get the client address (needed to reconnect after)
          connection['WEBSOCKET'] = socket.conn.remoteAddress;    // Will always be 1 when using localhost
          connection['CCSOCKET'].send("Web-Client has Connected!");
          connection['STATUS'] = 'CONNECTING'
          connFound = true;
        }
      }

      // Return webpage with connection to CC-Client
      if (connFound){
        console.log("Established Connection Link with UUID: " + message['UUID']);
        socket.emit('redirect', 'controlpanel.html');
      } else{
        console.log("No Connection with UUID " + message['UUID'] + " was found!")
      }
    } else if (message['TYPE'] == "MSG") {
      for (const connection of connections){
        if (connection['WEBSOCKET'] == socket && message['DATA'] != null){
          // get the client address (needed to reconnect after)
          console.log("Furthering Message to Websocket");
          connection['CCSOCKET'].send(message['DATA']);
        }
      }
    }
  });
});

// Listen for connections from CC clients, if there's a valid browser client then send the data through the ioSocket to it.
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data){
    // Check if connection is requesting a UUID
    if (data == "RID"){
      let uuid = uuidv4();
      console.log("Gave new Connection the UUID: " + uuid);

      // Add the connection and UUID to the client array
      connections.push({
        'UUID' : uuid,
        'CCSOCKET' : ws,
        'WEBSOCKET' : null,
        'STATUS' : 'NONE'
      });

      // Send back the UUID to the cc client
      ws.send(uuid);
    } else{
      for (const connection of connections){
        if (connection['CCSOCKET'] == ws && connection['WEBSOCKET'] != null && connection['STATUS'] == 'CONNECTED'){
          connection['WEBSOCKET'].send(JSON.parse(data));
        }
      }
    }
  });

  // When the websocket is closed
  ws.on('close', function close(reasonCode, description){
    console.log("Closing CC-Client Connection");

    // Search the connections for an instance to remove
    for (const connection of connections){
      if (connection['CCSOCKET'] == ws){
        console.log("Connection found stored, removing from connection array");
        connections.pop(ws);
      }
    }
  });
});
