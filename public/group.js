// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

window.onload = function() {
  game = new Game('game')
  game.shouldPlantOnMousemove()

  setTimeout(function() {
    socket = io()
    socket.on("connect", () => {
      socket.emit("view:show-me-the-map", {}, (error, stuff) => {
        console.log(stuff)
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
    
    socket.on("player:new", (player) => {
      console.log('got player', player)
      game.drawPlayer(player)
    })
  }, 1000)
  
}

