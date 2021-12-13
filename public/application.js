import Keyframes from '@keyframes/core'

try{
  var socket = io();

  // Prints message to browser console that the server has logged connection
  socket.on('connect', () => {
    console.log('Connection Established with Server!');
  });

  // Redirection message
  socket.on('redirect', function(destination){
    window.location.href = destination;
  });

  // Recieve messages through the ioSocket and update the DOM with jquery
  socket.on('message', (message) => {
    console.log("Got a message!");
    console.log(message);
    //console.log('Something came along on the "Message" channel:', message);

    if (message["TAG"] == "REACTOR"){
      for(var key in message["DATA"]){
        $(".reactor-" + key).text(message["DATA"][key]);
      }
    } else if(message["TAG"] == "BOILER"){
      for(var key in message["DATA"]){
        $(".boiler-" + key).text(message["DATA"][key]);
      }
    } else if(message["TAG"] == "TURBINE"){
      for(var key in message["DATA"]){
        $(".turbine-" + key).text(message["DATA"][key]);
      }
    } else if(message["TAG"] == "INDUCTION"){
      for(var key in message["DATA"]){
        $(".induction-" + key).text(message["DATA"][key]);
      }
    }
  });

  var input = document.getElementById('input');

  function submit(){
    socket.send({
      'TYPE' : "RCO",
      'UUID' : input.value
    });
  }

  function scram(){
    socket.send({
      'TYPE' : 'MSG',
      'DATA' : 'SCRAM'
    });
  }

  function sendMessage(){
    socket.send({
      'TYPE' : 'MSG',
      'DATA' : input.value
    });
  }
} catch(err){
  console.log(err);
}



// Graph Updates & Management
var reactorTempGraph = document.getElementById("reactorTempLine")

$(document).ready(function() {
  var x = 0;
  var y1 = 0;
  var y2 = 0;
  var y = 0;
  var counter = 0;
  var point = 0 + "," + Math.round(Math.random() * 1000);

  function upD() {
    if(counter <= 12){
      x += 40;
      y2 = y1;
      y1 = y;
      y = Math.round(Math.random() * 70);
      point += " " + x + "," + y;
      console.log(counter);

      document.getElementById('reactorTempLine').setAttribute('points',point);
      console.log($.keyframe.isSupported());

      // jquery keyframe library
      $.keyframe.define({
         name: 'myfirst',
         from: {
             'stroke-dashoffset': '80%'
         },
         to: {
            'stroke-dashoffset': '0'
         }
      });

      $("#reactorTempLine").css({"stroke-dasharray":'100%',"stroke-dashoffset":'100%'});
      $("#reactorTempLine").playKeyframe({
        name: 'myfirst',
        duration: '5s',
        timingFunction: 'linear',
        iterationCount: '1'
      });

      counter = counter + 1;
    }
  }
  window.setInterval(upD,1000);
});
