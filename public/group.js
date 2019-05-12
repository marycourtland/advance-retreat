// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

window.onload = function() {
  game = new Game('game')
  game.shouldPlantOnMousemove()
  
  game.drawPlayer({coords: {x: 100, y: 100}})

  setTimeout(function() {
    socket = io()
    socket.on("connect", () => {
      socket.emit("view:show-me-the-map", (items) => {
      })
    })
    
    socket.on("new:plant", (plant) => {
      game.plantOne(plant.coords)
    })
    
    socket.on("new:player", (player) => {
      console.log('got player', player)
      game.drawPlayer(player)
    })
  }, 1000)
  
}

