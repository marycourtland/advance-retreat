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
    data = data || {}
    
    // revive old players if they exist
    var player = playersById[data.id]
    if (player) {
      player.active = true
      socket.playerId = player.id
    }
    else {
      player = addPlayer(data.id)
    }
    
    console.log('player connected', socket.id, player.color, player.id, `-> ${Object.keys(playersById).length} players`)
    socket.playerId = player.id
    callback(null, player)
  });
  
  socket.on('action:plant', (coords) => {
    var player = playersById[socket.playerId]
    if (player) {
      addPlant(coords)
      player.updateEnergy(
    }
    
  });
  
  socket.on('disconnect', () => {
    const player = playersById[socket.playerId]
    if (player) {
      console.log('player inactive:', player.id)
      player.active = false
    }
    
    // TODO: clean up players which have been inactive after a while
  });
});



// *** THE GAME ***
// TODO: clean up

const gameSize = {
  x: 800,
  y: 524
}

const Player = require('./player')
const utils = require('./utils')
const energyActions = require('./energy-actions')

// meh
const playersById = {}
const items = []


function addPlayer(id) {
  const player = new Player(
    `player${new Date().valueOf() - 1557600000000}`, // id
    utils.randCoords(gameSize)
  )
  
  // this will overwrite old players
  if (id) { player.id = id }
  
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