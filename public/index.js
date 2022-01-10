var socket = io();

var uuid = document.getElementById('inputField');

// Redirection message
socket.on('redirect', function(destination){
  window.location.href = destination;
});

socket.on('warning', function(errorText){
  console.log('WARNING: ' + errorText + '!');
});

// Prints message to browser console that the server has logged connection
socket.on('connect', function(){
  console.log('Connection Established with Server!');
});

function connect(){
  socket.send({
    'TYPE' : "RCO",
    'UUID' : uuid.value
  });
}
