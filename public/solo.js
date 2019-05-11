// PROTOTYPE!!!!

/* global io, fabric, Game */



var socket
var game

window.onload = function() {
  socket = io()
  game = new Game('game', player)
  player.init()
  
  
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      player.init()
    })
  }, 1000)
}

// TODO: there shouldn't be a mousemove event for planting


const player = {
  id: null,
  coords: {x: 0, y: 0},
  
  init: function() {
    socket.emit('join', (playerData) => {
      this.id = playerData.id
      this.coords = playerData.coords
    })
  },
  plant: function(coords) {
    // emit to socket
    socket.emit('action:plant', coords)
  }
}

