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
function makeSVG(tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs)
    el.setAttribute(k, attrs[k]);
  return el;
}

class Graph{
  constructor(width, height, xDiff, lineLimit, container){
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

    this.lines = [];
    this.idCounter = 0;
    this.lastPoint = width-xDiff + "," + height/2;
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
    var newLine = makeSVG('polyline', {points : this.lastPoint + " " + newPoint, stroke : "#ad0000"});
    newLine.id = "reactorLine-" + this.idCounter;
    newLine.style.cssText = "stroke-dasharray:100%;stroke-dashoffset:100%";
    document.getElementById('reactorTempLines').appendChild(newLine);

    $("#reactorLine-" + this.idCounter).playKeyframe({
      name: 'grow',
      duration: '1s',
      timingFunction: 'linear',
      iterationCount: '1'
    });

    this.idCounter++;
    if(this.idCounter >= this.lineLimit) this.idCounter = 0;
    this.lastPoint = " " + (this.width - this.xDiff) + "," + y;
    this.lines.push(newLine);
  }
}

$(window).on('load', function() {
  let tempGraph = new Graph(440, 300, 40, 11, document.getElementById('reactorTempLines'))

  function addValueToGraph(){
    y = Math.round(Math.random() * 300);

    tempGraph.addEntry(y);
  }

  window.setInterval(addValueToGraph,1000);
});
