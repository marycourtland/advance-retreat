// PROTOTYPE!!!!

/* global io, fabric, Game */



var socket
var game

window.onload = function() {
  socket = io()
  game = new Game('game', player)
  game.shouldPlantOneOnMousemove()
  player.init()
  
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      player.init()
    })
  }, 1000)
  
  // action buttons
  game.drawButton({x: 20, y: 20}, {
    "event:mouseup": (evt) => {
      console.log('plant action')
      player.plant()
    }
  })
  
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
    socket.emit('action:plant', coords)
  }
}

