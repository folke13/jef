var socket = io();

let reactorTempGraph;
let reactorCoolantGraph;
let reactorHeatedGraph;
let boilerSteamGraph;
let boilerHeatedGraph;
let boilerWaterGraph;
let turbineProductionGraph;
let turbineSteamGraph;
let turbineFlowrateGraph;
let inductionEnergyGraph;
let inductionInputGraph;
let inductionOutputGraph;

var bufferValues = {
  'reactorTemp': null,
  'reactorCoolantPercentage': null,
  'reactorHeatedPercentage': null,
  'boilerSteamPercentage': null,
  'boilerWaterPercentage': null,
  'boilerHeatedPercentage': null,
  'turbineProductionPercentage': null,
  'turbineMaxProduction': null,
  'turbineFlowratePercentage': null,
  'turbineMaxFlowrate': null,
  'turbineFlowrate': null,
  'turbineSteamPercentage': null,
  'inductionEnergyPercentage': null,
  'inductionInput': null,
  'inductionOutput': null,
  'inductionTransferCap': null
};

var burnrateInput = document.getElementById('burnrateInput');

$(window).on('load', function() {
  reactorTempGraph = new Graph(480, 300, 40, 11, document.getElementById('reactorTempLines'), 'reactorTempLine');
  reactorCoolantGraph = new Graph(480, 300, 40, 11, document.getElementById('reactorCoolantLines'), 'reactorCoolantLine');
  reactorHeatedGraph = new Graph(480, 300, 40, 11, document.getElementById('reactorHeatedLines'), 'reactorHeatedLine');
  boilerSteamGraph = new Graph(480, 300, 40, 11, document.getElementById('boilerSteamLines'), 'boilerSteamLine');
  boilerHeatedGraph = new Graph(480, 300, 40, 11, document.getElementById('boilerHeatedLines'), 'boilerHeatedLine');
  boilerWaterGraph = new Graph(480, 300, 40, 11, document.getElementById('boilerWaterLines'), 'boilerWaterLine');
  turbineProductionGraph = new Graph(480, 300, 40, 11, document.getElementById('turbineProductionLines'), 'turbineProductionLine');
  turbineSteamGraph = new Graph(480, 300, 40, 11, document.getElementById('turbineSteamLines'), 'turbineSteamLine');
  turbineFlowrateGraph = new Graph(480, 300, 40, 11, document.getElementById('turbineFlowrateLines'), 'turbineFlowrateLine');
  inductionEnergyGraph = new Graph(480, 300, 40, 11, document.getElementById('inductionEnergyLines'), 'inductionEnergyLine');
  inductionInputGraph = new Graph(480, 300, 40, 11, document.getElementById('inductionInputLines'), 'inductionInputLine');
  inductionOutputGraph = new Graph(480, 300, 40, 11, document.getElementById('inductionOutputLines'), 'inductionOutputLine');

  socket.send(JSON.stringify({
    'TYPE' : 'RAD',
    'DATA' : null
  }));

  function updateGraphs(){
    if(bufferValues['reactorTemp'] != null){
      var unitPerPixel = (300/(1200-200));
      var pixelAdjustedValue = Math.floor(unitPerPixel * bufferValues['reactorTemp']);
      reactorTempGraph.addEntry(405 - pixelAdjustedValue);
    }

    if(bufferValues['reactorCoolantPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['reactorCoolantPercentage']);
      reactorCoolantGraph.addEntry(346 - yValue);
    }

    if(bufferValues['reactorHeatedPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['reactorHeatedPercentage']);
      reactorHeatedGraph.addEntry(346 - yValue);
    }

    if(bufferValues['boilerSteamPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['boilerSteamPercentage']);
      boilerSteamGraph.addEntry(346 - yValue);
    }

    if(bufferValues['boilerWaterPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['boilerWaterPercentage']);
      boilerWaterGraph.addEntry(346 - yValue);
    }

    if(bufferValues['boilerHeatedPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['boilerHeatedPercentage']);
      boilerHeatedGraph.addEntry(346 - yValue);
    }

    if(bufferValues['turbineProductionPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['turbineProductionPercentage']);
      turbineProductionGraph.addEntry(346 - yValue);
    }

    if(bufferValues['turbineFlowratePercentage'] != null){
      yValue = Math.floor(300 * bufferValues['turbineFlowratePercentage']);
      turbineFlowrateGraph.addEntry(346 - yValue);
    }

    if(bufferValues['turbineSteamPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['turbineSteamPercentage']);
      turbineSteamGraph.addEntry(346 - yValue);
    }

    if(bufferValues['inductionEnergyPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['inductionEnergyPercentage']);
      inductionEnergyGraph.addEntry(346 - yValue);
    }

    if(bufferValues['inductionInputPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['inductionInputPercentage']);
      inductionInputGraph.addEntry(346 - yValue);
    }

    if(bufferValues['inductionOutputPercentage'] != null){
      yValue = Math.floor(300 * bufferValues['inductionOutputPercentage']);
      inductionOutputGraph.addEntry(346 - yValue);
    }
  }

  window.setInterval(updateGraphs, 1000);
});

// Prints message to browser console that the server has logged connection
socket.on('connect', () => {
  console.log('Connection Established with Server!');
});

// Recieve messages through the ioSocket and update the DOM with jquery
socket.on('message', (message) => {
  //console.log(message);
  if (message["TAG"] == "REACTOR"){
    for(var key in message["DATA"]){
      if(message['DATA']['status'] == true){
        $("#reactor-status").css('color', 'green');
      } else if(message['DATA']['status'] == false){
        $("#reactor-status").css('color', 'red');
      }

      if (message['DATA']['temperature'] >= 0 && reactorTempGraph){
        bufferValues['reactorTemp'] = message['DATA']['temperature'];
        $("#reactor-temperature").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['coolantFilledPercentage'] >= 0 && reactorCoolantGraph){
        bufferValues['reactorCoolantPercentage'] = message['DATA']['coolantFilledPercentage'];
        $("#reactor-coolantFilledPercentage").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['heatedFilledPercentage'] >= 0 && reactorHeatedGraph){
        bufferValues['reactorHeatedPercentage'] = message['DATA']['heatedFilledPercentage'];
        $("#reactor-heatedFilledPercentage").text(improveValue(message["DATA"][key], key));
      } else{
        $("#reactor-" + key).text(improveValue(message["DATA"][key], key));
      }
    }
  } else if(message["TAG"] == "BOILER"){
    for(var key in message["DATA"]){
      if(message['DATA']['status'] == true){
        $("#boiler-status").css('color', 'green');
      } else if(message['DATA']['status'] == false){
        $("#boiler-status").css('color', 'red');
      }

      if (message['DATA']['steamFilledPercentage'] >= 0 && boilerSteamGraph){
        bufferValues['boilerSteamPercentage'] = message['DATA']['steamFilledPercentage'];
      } else if(message['DATA']['waterFilledPercentage'] >= 0 && boilerWaterGraph){
        bufferValues['boilerWaterPercentage'] = message['DATA']['waterFilledPercentage'];
      } else if(message['DATA']['heatedCoolantFilledPercentage'] >= 0 && boilerHeatedGraph){
        bufferValues['boilerHeatedPercentage'] = message['DATA']['heatedCoolantFilledPercentage'];
      } else{
        $("#boiler-" + key).text(improveValue(message["DATA"][key], key));
      }
    }
  } else if(message["TAG"] == "TURBINE"){
    for(var key in message["DATA"]){
      if(message['DATA']['status'] == true){
        $("#turbine-status").css('color', 'green');
      } else if(message['DATA']['status'] == false){
        $("#turbine-status").css('color', 'red');
      }

      if (message['DATA']['productionRate'] >= 0 && bufferValues['turbineMaxProduction'] > 0 && turbineProductionGraph){
        bufferValues['turbineProductionPercentage'] = message['DATA']['productionRate'] / bufferValues['turbineMaxProduction'];
        $("#turbine-productionRate").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['flowRate'] >= 0 && bufferValues['turbineMaxFlowrate'] > 0 && turbineFlowrateGraph){
        bufferValues['turbineFlowrate'] = message['DATA']['flowRate'];
        bufferValues['turbineFlowratePercentage'] = message['DATA']['flowRate'] / bufferValues['turbineMaxFlowrate'];
      } else if(message['DATA']['steamFilledPercentage'] >= 0 && turbineSteamGraph){
        bufferValues['turbineSteamPercentage'] = message['DATA']['steamFilledPercentage'];
      } else if(message['DATA']['maxProduction'] > 0){
        bufferValues['turbineMaxProduction'] = message['DATA']['maxProduction'];
        $("#turbine-maxProduction").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['maxFlowRate'] > 0){
        bufferValues['turbineMaxFlowrate'] = message['DATA']['maxFlowRate'];
        if(bufferValues['turbineFlowrate'] >= 0){
          bufferValues['turbineFlowratePercentage'] = bufferValues['turbineFlowrate'] / bufferValues['turbineMaxFlowrate'];
        }
      } else{
        $("#turbine-" + key).text(improveValue(message["DATA"][key], key));
      }
    }
  } else if(message["TAG"] == "INDUCTION"){
    for(var key in message["DATA"]){
      if (message['DATA']['energyFilledPercentage'] >= 0 && inductionEnergyGraph){
        bufferValues['inductionEnergyPercentage'] = message['DATA']['energyFilledPercentage'];
        $("#induction-energyFilledPercentage").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['lastInput'] >= 0 && bufferValues['inductionTransferCap'] > 0 && inductionInputGraph){
        bufferValues['inductionInputPercentage'] = message['DATA']['lastInput'] / bufferValues['inductionTransferCap'];
        $("#induction-lastInput").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['lastOutput'] >= 0 && bufferValues['inductionTransferCap'] > 0 && inductionOutputGraph){
        bufferValues['inductionOutputPercentage'] = message['DATA']['lastOutput'] / bufferValues['inductionTransferCap'];
        $("#induction-lastOutput").text(improveValue(message["DATA"][key], key));
      } else if(message['DATA']['transferCap'] > 0){
        bufferValues['inductionTransferCap'] = message['DATA']['transferCap'];
        $("#induction-transferCap").text(improveValue(message["DATA"][key], key));
      } else{
        $("#induction-" + key).text(improveValue(message["DATA"][key], key));
      }
    }
  }
});

function improveValue(value, key){
  if(key == 'temperature' || key == 'environmentalLoss' || key == 'burnRate' || key == 'actualBurnRate'){
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if(key.includes('Percentage')){
    return Math.round((value + Number.EPSILON) * 100) / 100 * 100; // multiplied by 100 for percentage reasons
  } else if(key == 'status'){
    return (value == false) ? "INACTIVE" : "ACTIVE";
  } else if(key == 'heatedName' && value == 'mekanism:empty_gas'){
    return 'EMPTY';
  } else if(key == 'dumpingMode'){
    return value;
  }else{
    return Math.round(value + Number.EPSILON).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

function scram(){
  socket.send(JSON.stringify({
    'TYPE' : 'SCRAM',
    'DATA' : null
  }));
}

function setBurnrate(){
  socket.send(JSON.stringify({
    'TYPE' : 'BURNRATE',
    'DATA' : Number(burnrateInput.value)
  }));
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
