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

app.get('/credits', function(request, response) {
  response.sendFile(__dirname + '/views/credits.html');
});

const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

// blah
global.io = io

io.on('connection', function (socket) {
  
  socket.on('view:show-me-the-map', (data, callback) => {
    socket.join("map-view")
    console.log(callback)
    
    if (typeof callback === 'function') {
      callback(null, {players: playersById, items: itemsById})
    }
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
    
    // player.setSocket(socket, io);
    
    console.log('player connected', socket.id, player.color, player.id, `-> ${Object.keys(playersById).length} players`)
    socket.playerId = player.id
    callback(null, player)
  });
  
  socket.on('action:plant', (coords) => {
    var player = playersById[socket.playerId]
    if (player) {
      addPlant(coords)
      console.log('GOING TO UPDATE ENERGY', player.id, energyActions.plant)
      player.updateEnergy(energyActions.plant)
    }
    
  });
  
  socket.on('action:turbine', (coords) => {
    var player = playersById[socket.playerId]
    if (player) {
      addTurbine(coords)
      console.log('GOING TO UPDATE ENERGY', player.id, energyActions.turbine)
      player.updateEnergy(energyActions.turbine)
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
const Item = require('./item')
const utils = require('./utils')
const energyActions = require('./energy-actions')

// meh
const playersById = {}
const itemsById = {}


function addPlayer(id) {
  const player = new Player(
    utils.getId('player'),
    utils.randCoords(gameSize)
  )
  
  // this will overwrite old players
  if (id) { player.id = id }
  
  playersById[player.id] = player
  
  io.in("map-view").emit("player:new", player) 
  
  return player
}

function addPlant(coords) {
  console.log('planting', coords)
  const newPlant = new Item(
    'plant',
    utils.getId('plant'),
    coords
  )
  itemsById[newPlant.id] = newPlant
  io.in("map-view").emit("plant:new", newPlant) 
}


function addTurbine(coords) {
  console.log('building turbine', coords)
  const newTurbine = new Item(
    'turbine',
    utils.getId('turbine'),
    coords
  )
  itemsById[newTurbine.id] = newTurbine
  io.in("map-view").emit("turbine:new", newTurbine)
}