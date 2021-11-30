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
  messageDecoded = String.fromCharCode.apply(null, new Uint8Array(message));

  console.log('Something came along on the "Message" channel:', messageDecoded);

  $(".data").append("<p>" + messageDecoded + "</p>");
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
