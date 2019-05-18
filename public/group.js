// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

var playersById = {}

window.isGroup = true

window.onload = function() {
  game = new Game('game')
  // game.shouldPlantOnMousemove()

  setTimeout(function() {
    socket = io()
    socket.on("connect", () => {
      socket.emit("view:show-me-the-map", {}, (error, stuff) => {
        var player;
        for (var playerId in stuff.players) {
          player = stuff.players[playerId]
          player.object = game.drawPlayer(player)
          playersById[playerId] = player
        }
        for (var itemId in stuff.items) {
          var item = stuff.items[itemId]
          if (item.type === 'plant') {
            game.plantOne(item.coords)
          }
          if (item.type === 'turbine') {
            game.drawTurbine(item.coords)
          }
        }
      })
    })
    
    
    socket.on("plant:new", (plant) => {
      game.plantOne(plant.coords)
    })
    
    
    socket.on("turbine:new", (turbine) => {
      game.drawTurbine(turbine.coords)
    })
    
    socket.on("player:new", (player) => {
      playersById[player.id] = player
      game.drawPlayer(player)
    })
    
    socket.on("player:refresh", (thePlayer) => {
      console.log('REFRESHING PLAYER', thePlayer.id, thePlayer.energy)
      var player = null
      if (thePlayer.id in playersById) {
        player = playersById[thePlayer.id]
      }
      else {
        player = thePlayer
        playersById[player.id] = player
      }

      player.energy = thePlayer.energy
      player.coords.x = thePlayer.coords.x
      player.coords.y = thePlayer.coords.y
      // TODO: anything else to refresh?

      playerObj = player.object
      
      if (!playerObj) {
        playerObj = game.drawPlayer(player)
      }
      else {
        game.refreshPlayer(playerObj, player)
      }
      
      player.object = playerObj
    })
  }, 1000)
  
}

