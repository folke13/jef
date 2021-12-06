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
    $(".reactor-actualBurnRate").text(message["DATA"]["actualBurnRate"]);
    $(".reactor-boilEfficiency").text(message["DATA"]["boilEfficiency"]);
    $(".reactor-burnRate").text(message["DATA"]["burnRate"]);
    $(".reactor-coolantName").text(message["DATA"]["coolant"]["name"]);
    $(".reactor-coolantAmount").text(message["DATA"]["coolant"]["amount"]);
    $(".reactor-coolantCap").text(message["DATA"]["coolantCap"]);
    $(".reactor-coolantFilledPercentage").text(message["DATA"]["coolantFilledPercentage"]);
    $(".reactor-coolantNeeded").text(message["DATA"]["coolantNeeded"]);
    $(".reactor-damagePercentage").text(message["DATA"]["damagePercent"]);
    $(".reactor-enviromentalLoss").text(message["DATA"]["environmentalLoss"]);
    $(".reactor-fuel").text(message["DATA"]["fuel"]);
    $(".reactor-fuelAssemblies").text(message["DATA"]["fuelAssemblies"]);
    $(".reactor-fuelCap").text(message["DATA"]["fuelCap"]);
    $(".reactor-fuelFilledPercentage").text(message["DATA"]["fuelFilledPercentage"]);
    $(".reactor-fuelNeeded").text(message["DATA"]["fuelNeeded"]);
    $(".reactor-fuelSurfaceArea").text(message["DATA"]["fuelSurfaceArea"]);
    $(".reactor-heatCapacity").text(message["DATA"]["heatedCapacity"]);
    $(".reactor-heatedName").text(message["DATA"]["heated"]["name"]);
    $(".reactor-heatedAmount").text(message["DATA"]["heated"]["amount"]);
    $(".reactor-heatedCap").text(message["DATA"]["heatedCap"]);
    $(".reactor-heatedFilledPercentage").text(message["DATA"]["heatedFilledPercentage"]);
    $(".reactor-heatedNeeded").text(message["DATA"]["heatedNeeded"]);
    $(".reactor-heatingRate").text(message["DATA"]["heatingRate"]);
    $(".reactor-maxBurnRate").text(message["DATA"]["maxBurnRate"]);
    $(".reactor-status").text(message["DATA"]["status"]);
    $(".reactor-temperature").text(message["DATA"]["temperature"]);
    $(".reactor-waste").text(message["DATA"]["waste"]);
    $(".reactor-wasteCap").text(message["DATA"]["wasteCap"]);
    $(".reactor-wasteFilledPercentage").text(message["DATA"]["wasteFilledPercentage"]);
    $(".reactor-wasteNeeded").text(message["DATA"]["wasteNeeded"]);
  } else if(message["TAG"] == "BOILER"){
    $(".boiler-boilCap").text(message["DATA"]["boilCap"]);
    $(".boiler-cooledCoolantName").text(message["DATA"]["cooledCoolant"]["name"]);
    $(".boiler-cooledCoolantAmount").text(message["DATA"]["cooledCoolant"]["amount"]);
    $(".boiler-cooledCoolantCap").text(message["DATA"]["cooledCoolantCap"]);
    $(".boiler-cooledCoolantFilledPercentage").text(message["DATA"]["cooledCoolantFilledPercentage"]);
    $(".boiler-cooledCoolantNeeded").text(message["DATA"]["cooledCoolantNeeded"]);
    $(".boiler-environmentalLoss").text(message["DATA"]["environmentalLoss"]);
    $(".boiler-heatedCoolantName").text(message["DATA"]["heatedCoolant"]["name"]);
    $(".boiler-heatedCoolantAmount").text(message["DATA"]["heatedCoolant"]["amount"]);
    $(".boiler-heatedCoolantCap").text(message["DATA"]["heatedCoolantCap"]);
    $(".boiler-heatedCoolantFilledPercentage").text(message["DATA"]["heatedCoolantFilledPercentage"]);
    $(".boiler-heatedCoolantNeeded").text(message["DATA"]["heatedCoolantNeeded"]);
    $(".boiler-lastBoilRate").text(message["DATA"]["lastBoilRate"]);
    $(".boiler-maxBoilRate").text(message["DATA"]["maxBoilRate"]);
    $(".boiler-status").text(message["DATA"]["status"]);
    $(".boiler-steam").text(message["DATA"]["steam"]);
    $(".boiler-steamCap").text(message["DATA"]["steamCap"]);
    $(".boiler-steamFilledPercentage").text(message["DATA"]["steamFilledPercentage"]);
    $(".boiler-superheaters").text(message["DATA"]["superheaters"]);
    $(".boiler-temperature").text(message["DATA"]["temperature"]);
    $(".boiler-water").text(message["DATA"]["water"]);
    $(".boiler-waterCap").text(message["DATA"]["waterCap"]);
    $(".boiler-waterFilledPercentage").text(message["DATA"]["waterFilledPercentage"]);
  } else if(message["TAG"] == "TURBINE"){
    $(".turbine-blades").text(message["DATA"]["blades"]);
    $(".turbine-coils").text(message["DATA"]["coils"]);
    $(".turbine-condensers").text(message["DATA"]["condensers"]);
    $(".turbine-dispersers").text(message["DATA"]["dispersers"]);
    $(".turbine-dumpingMode").text(message["DATA"]["dumpingMode"]);
    $(".turbine-flowRate").text(message["DATA"]["flowRate"]);
    $(".turbine-lastSteamInputRate").text(message["DATA"]["lastSteamInputRate"]);
    $(".turbine-maxFlowRate").text(message["DATA"]["maxFlowRate"]);
    $(".turbine-maxProduction").text(message["DATA"]["maxProduction"]);
    $(".turbine-maxWaterOutput").text(message["DATA"]["maxWaterOutput"]);
    $(".turbine-productionRate").text(message["DATA"]["productionRate"]);
    $(".turbine-status").text(message["DATA"]["status"]);
    $(".turbine-steam").text(message["DATA"]["steam"]);
    $(".turbine-steamCap").text(message["DATA"]["steamCap"]);
    $(".turbine-steamFilledPercentage").text(message["DATA"]["steamFilledPercentage"]);
    $(".turbine-steamNeeded").text(message["DATA"]["steamNeeded"]);
    $(".turbine-vents").text(message["DATA"]["vents"]);
  } else if(message["TAG"] == "INDUCTION"){
    $(".induction-cells").text(message["DATA"]["cells"]);
    $(".induction-energy").text(message["DATA"]["energy"]);
    $(".induction-energyCap").text(message["DATA"]["energyCap"]);
    $(".induction-energyFilledPercentage").text(message["DATA"]["energyFilledPercentage"]);
    $(".induction-energyNeeded").text(message["DATA"]["energyNeeded"]);
    $(".induction-lastInput").text(message["DATA"]["lastInput"]);
    $(".induction-lastOutput").text(message["DATA"]["lastOutput"]);
    $(".induction-providers").text(message["DATA"]["providers"]);
    $(".induction-transferCap").text(message["DATA"]["transferCap"]);
  }
});

var input = document.getElementById('input');

function submit(){
  socket.send({
    'TYPE' : "RCO",
    'UUID' : input.value
  });
}

function sendMessage(){
  socket.send({
      'TYPE' : 'MSG',
      'DATA' : input.value
  });
}
