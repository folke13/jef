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

function makeSVG(tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs)
    el.setAttribute(k, attrs[k]);
  return el;
}

$(window).on('load', function() {
  var x = 440;
  var xDiff= 40;
  var y1 = 0;
  var y2 = 0;
  var y = 0;
  var lines = [];
  var counter = 0;
  var lastPoint = 400 + "," + Math.round(Math.random() * 300);
  var reactorTempLines = document.getElementById("reactorTempLines")

  function addValueToGraph() {
    if(counter < 11){
      y2 = y1;
      y1 = y;
      y = Math.round(Math.random() * 300);
      var newPoint = " " + x + "," + y;

      // Push back existing lines
      lines.forEach(function(line){
        var oldAttr = line.getAttribute("points");
        var numbers = oldAttr.match(/\d+/g);

        console.log("numbers: " + numbers);
        console.log("line amount: " + lines.length);

        // Modify the numbers to shift left with xDiff
        numbers[0] = numbers[0] - xDiff;
        numbers[2] = numbers[2] - xDiff;

        var newPoints = numbers[0] + "," + numbers[1] + " " + numbers[2] + "," + numbers[3];
        line.setAttribute('points', newPoints);
      });

      // Create new line
      var newLine = makeSVG('polyline', {points : lastPoint + " " + newPoint, stroke : "#ad0000"});
      document.getElementById('reactorTempLines').appendChild(newLine);
      lastPoint = " " + 400 + "," + y;
      lines.push(newLine);

      // jquery keyframe library
      /*$.keyframe.define({
         name: 'myfirst',
         from: {
             'stroke-dashoffset': '100%'
         },
         to: {
            'stroke-dashoffset': '0'
         }
      });

      $("#reactorTempLine").css({"stroke-dasharray":'100%',"stroke-dashoffset":'100%'});
      $("#reactorTempLine").playKeyframe({
        name: 'myfirst',
        duration: '2s',
        timingFunction: 'linear',
        iterationCount: '11'
      });*/

      counter = counter + 1;
    }
  }
  window.setInterval(addValueToGraph,2000);
});
