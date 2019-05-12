// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

var playersById = {}

window.isGroup = true

window.onload = function() {
  game = new Game('game')
  game.shouldPlantOnMousemove()

  setTimeout(function() {
    socket = io()
    socket.on("connect", () => {
      socket.emit("view:show-me-the-map", {}, (error, stuff) => {
        for (var playerId in stuff.players) {
          game.drawPlayer(stuff.players[playerId])
        }
        for (var itemId in stuff.items) {
          var item = stuff.items[itemId]
          if (item.type === 'plant') {
            game.plantOne(item.coords)
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
    
    socket.on("player:refresh", (player) => {
      console.log('REFRESHING PLAYER', player.id, player.energy)
      var playerObj = null
      if (player.id in playersById) {
        playerObj = playersById[player.id].object
      }
      
      if (!playerObj) {
        playerObj = game.drawPlayer(player)
      }
      else {
        game.refreshPlayer(playerObj, player)
      }
      
      player.object = playerObj
      playersById[player.id] = playerObj
    })
  }, 1000)
  
}

