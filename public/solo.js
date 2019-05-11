// PROTOTYPE!!!!

/* global io, fabric, Game */



var socket
var game

window.onload = function() {
  document.getElementById("intro").onclick = function() {
    document.getElementById("intro").style.display = "none";
  }
}

function start() {
  socket = io()
  game = new Game('game')
  game.shouldPlantOneOnMousemove()
  player.init()
  
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      player.init()
    })
  }, 1000)
  
  // action buttons
  document.getElementById('action-plant').onclick = function() {
    player.plant()
  }
}

// TODO: there shouldn't be a mousemove event for planting. But it's fun soooo


const player = {
  id: null,
  coords: {x: 0, y: 0},
  
  init: function() {
    socket.emit('game:join', {}, (error, playerData) => {
      this.id = playerData.id
      this.coords = playerData.coords
    })
  },
  plant: function(coords) {
    coords = coords || this.coords
    if (!coords) { return }
    game.plantOne(coords)
    socket.emit('action:plant', coords)
  }
}

