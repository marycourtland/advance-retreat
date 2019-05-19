const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const DEFAULT_PORT = 8000


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

const listener = server.listen(process.env.PORT || DEFAULT_PORT, function() {
  console.log('Listening on port ' + listener.address().port);
})

// blah
global.io = io

io.on('connection', function (socket) {
  
  socket.on('view:show-me-the-map', (data, callback) => {
    socket.join("map-view")
    
    if (typeof callback === 'function') {
      callback(null, {
        players: playersById,
        items: itemsById,
        motivations: motivations
      })
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
      player.updateEnergy(energyActions.plant)
    }
    
  });
  
  socket.on('action:turbine', (coords) => {
    var player = playersById[socket.playerId]
    if (player) {
      addTurbine(coords)
      player.updateEnergy(energyActions.turbine)
    }
  });
  
  socket.on('action:recharge', (coords) => {
    var player = playersById[socket.playerId]
    if (player) {
      player.updateEnergy(energyActions.recharge)
    }
  })
  
  socket.on('action:move', (data) => {
    if (!data.coords) { return }
    var player = playersById[socket.playerId]
    if (player) {
      player.updateCoords(data.coords)
    }
  })

  
  socket.on('action:motivation', (data) => {
    if (!data.text) { return }

    // player gets a lot of energy
    var player = playersById[socket.playerId]
    if (player) {
      player.updateEnergy(energyActions.motivation)
    }

    showMotivationText(data.text)
  })
  
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
const coordLocations = require('./locations.json')

// meh
const playersById = {}
const itemsById = {}
const motivations = []


function addPlayer(id) {
  const player = new Player(
    utils.getId('player'),
    utils.randCoordsNearPoints(coordLocations, 10)
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
  io.in("map-view").emit("item:new", newPlant) 
}

function addTurbine(coords) {
  console.log('building turbine', coords)
  const newTurbine = new Item(
    'turbine',
    utils.getId('turbine'),
    coords
  )
  itemsById[newTurbine.id] = newTurbine
  io.in("map-view").emit("item:new", newTurbine)
}

function showMotivationText(text) {
  if (!text || typeof text !== 'string') { return }
  motivations.splice(0, 0, text.trim()) // put new ones at the beginning
  global.io.in('map-view').emit("motivations:refresh", motivations)
}