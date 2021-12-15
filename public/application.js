var socket = io();
let reactorTempGraph;
let reactorCoolantGraph;

var bufferValues = {
  'reactorTemp': null,
  'reactorCoolantAmount': null,
  'reactorHeatedAmount': null
};

$(window).on('load', function() {
  reactorTempGraph = new Graph(440, 300, 40, 11, document.getElementById('reactorTempLines'), 'reactorTempLine');
  reactorCoolantGraph = new Graph(480, 300, 40, 11, document.getElementById('reactorCoolantLines'), 'reactorCoolantLine');
  reactorHeatedGraph = new Graph(480, 300, 40, 11, document.getElementById('reactorHeatedLines'), 'reactorHeatedLine');

  socket.send({
    'TYPE' : 'MSG',
    'DATA' : 'RAD'
  });

  function updateGraphs(){
    if(bufferValues['reactorTemp'] != null){
      var unitPerPixel = (300/(1200-200));
      var pixelAdjustedValue = Math.floor(unitPerPixel * bufferValues['reactorTemp']);
      reactorTempGraph.addEntry(325-pixelAdjustedValue);
    }

    if(bufferValues['reactorCoolantAmount'] != null){
      unitPerPixel = (300/(583200000));
      pixelAdjustedValue = Math.floor(unitPerPixel * bufferValues['reactorCoolantAmount']);
      reactorCoolantGraph.addEntry(347-pixelAdjustedValue);
    }

    if(bufferValues['reactorHeatedAmount'] != null){
      unitPerPixel = (300/(5832000000));
      pixelAdjustedValue = Math.floor(unitPerPixel * bufferValues['reactorHeatedAmount']);
      reactorHeatedGraph.addEntry(347-pixelAdjustedValue);
    }
  }

  window.setInterval(updateGraphs, 1000);
});


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
  //console.log(message);
  //console.log('Something came along on the "Message" channel:', message);

  if (message["TAG"] == "REACTOR"){
    for(var key in message["DATA"]){
      if (message['DATA']['temperature'] && reactorTempGraph){
        bufferValues['reactorTemp'] = message['DATA']['temperature'];
      } else if(message['DATA']['coolantAmount'] >= 0 && reactorCoolantGraph){
        bufferValues['reactorCoolantAmount'] = message['DATA']['coolantAmount'];
      } else if(message['DATA']['heatedAmount'] >= 0 && reactorHeatedGraph){
        bufferValues['reactorHeatedAmount'] = message['DATA']['heatedAmount'];
      } else{
        $(".reactor-" + key).text(message["DATA"][key]);
      }
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

// Graph Updates & Management
function makeSVG(tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs)
    el.setAttribute(k, attrs[k]);
  return el;
}

class Graph{
  constructor(width, height, xDiff, lineLimit, container, tag){
    // Define the keyframe that will be used for animation
    $.keyframe.define({
       name: 'grow',
       from: {
           'stroke-dashoffset': '100%'
       },
       to: {
          'stroke-dashoffset': '0'
       }
    });

    this.width = width;
    this.height = height;
    this.xDiff = xDiff;
    this.lineLimit = lineLimit;
    this.container = container;
    this.tag = tag;

    this.lines = [];
    this.idCounter = 0;
    this.lastPoint = '';
  }

  addEntry(newEntry){
    // Remove old lines
    if(this.lines.length >= this.lineLimit){
      this.lines[0].remove();
      this.lines.shift();
    }

    // Push back existing lines
    var xDiff = this.xDiff;
    this.lines.forEach(function(line){
      var oldAttr = line.getAttribute("points");
      var numbers = oldAttr.match(/\d+/g);
      line.style.cssText = "stroke-dasharray:100%;stroke-dashoffset:0%";

      // Modify the numbers to shift left with xDiff
      numbers[0] = numbers[0] - xDiff;
      numbers[2] = numbers[2] - xDiff;

      var newPoints = numbers[0] + "," + numbers[1] + " " + numbers[2] + "," + numbers[3];
      line.setAttribute('points', newPoints);
    });

    // Create new line
    var newPoint = " " + this.width + "," + newEntry;
    if(this.lastPoint == '') this.lastPoint = this.width-this.xDiff + "," + newEntry;
    var newLine = makeSVG('polyline', {points : this.lastPoint + " " + newPoint, stroke : "#ad0000"});
    newLine.id = this.tag + this.idCounter;
    newLine.style.cssText = "stroke-dasharray:100%;stroke-dashoffset:100%";
    this.container.appendChild(newLine);

    $("#" + newLine.id).playKeyframe({
      name: 'grow',
      duration: '10s',
      timingFunction: 'linear',
      iterationCount: '1'
    });

    this.idCounter++;
    if(this.idCounter >= this.lineLimit) this.idCounter = 0;
    this.lastPoint = " " + (this.width - this.xDiff) + "," + newEntry;
    this.lines.push(newLine);
  }
}
