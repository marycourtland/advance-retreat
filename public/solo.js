// PROTOTYPE!!!!

/* global io, fabric, Game */



var socket
var game

window.onload = function() {
  socket = io()
  game = new Game('game')
  player.init()
  
  
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      player.init()
    })
  }, 1000)
}


const player = {
  init: function() {
    socket.emit('join', (playerData) => {
    })
  },
  plant: function(coords) {
    // emit to socket
    socket.emit('action:plant', coords)
  }
}

