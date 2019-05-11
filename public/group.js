// PROTOTYPE!!!!

/* global io, fabric, Game */


var g
var socket

window.onload = function() {
  g = new Game('game')
  
  
  // tell server that the game is starting 
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      socket.emit("show-me-the-map")
    })
  }, 1000)
  
}

