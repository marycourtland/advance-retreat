const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(express.static('public'));

// mobile client
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/solo.html');
});

// main game
app.get('/game', function(request, response) {
  response.sendFile(__dirname + '/views/group.html');
});



const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

var mainSocket = null


io.on('connection', function (socket) {
  console.log('Socket connected!', socket.id)
  
  socket.on('start', (d) => {
    mainSocket = socket
  })
  
  socket.on('join', (d) => socket.join(d));
  
  socket.on('data', (d) => {
  });
  
  // socket.on('disconnect', function () {
  // });
});