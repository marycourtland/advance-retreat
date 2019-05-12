// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

window.onload = function() {
  game = new Game('game')
  game.shouldPlantOnMousemove()
  
  game.drawPlayer({x: 100, y: 100})

  setTimeout(function() {
    socket = io()
    socket.on("connect", () => {
      socket.emit("show-me-the-map")
    })
    
    socket.on("new:plant", (plant) => {
      game.plantOne(plant.coords)
    })
  }, 1000)
  
}

