// PROTOTYPE!!!!

/* global io, fabric, Game */


var g
var socket

window.onload = function() {
  g = new Game('game')
  
  
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      socket.emit("start")
    })
  }, 1000)
  
}

