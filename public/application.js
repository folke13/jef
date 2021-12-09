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
