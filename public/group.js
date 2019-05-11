// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

window.onload = function() {
  game = new Game('game')

  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      socket.emit("show-me-the-map")
    })
  }, 1000)
  
}

