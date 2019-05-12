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

io.on('connection', function (socket) {
  
  socket.on('show-me-the-map', (d) => {
    socket.join("map-view")
  })
  
  socket.on('game:join', (data, callback) => {
    const newPlayer = addPlayer()
    callback(null, newPlayer)
    
  });
  
  socket.on('action:plant', (coords) => {
    addPlant(coords)
    
  });
  
  socket.on('disconnect', () => {
  });
});



//// THE GAME

const gameSize = {
  x: 800,
  y: 524
}

const Player = require('./player')
const utils = require('./public/utils')

// meh
const playersById = {}

const items = []


function addPlayer() {
  const player = new Player(
    `player${new Date().valueOf() - 1557600000000}`, // id
    utils.randCoords(gameSize)
  )
  
  playersById[player.id] = player
  
  io.in("map-view").emit("new:player", player) 
  
  return player
}

function addPlant(coords) {
  console.log('planting', coords)
  const newPlant = {
    type: 'plant',
    coords: coords
  }
  items.push(newPlant)
  io.in("map-view").emit("new:plant", newPlant) 
  
}