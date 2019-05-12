// PROTOTYPE!!!!

/* global io, fabric, utils, Game */



var socket
var game

window.onload = function() {
  const intro = document.getElementById("intro")
  intro.onclick = function() {
    utils.addClass('intro', 'hidden')
  }
  start()
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
  const actions = {
    'plant': () => player.plant(),
    'retreat': () => {
      player.modeAdvance()
      utils.removeClass('retreat-overlay', 'hidden')
    },
    'return': () => {
      player.modeRetreat()
      utils.addClass('retreat-overlay', 'hidden')
    }
  }
  
  for (var a in actions) {
    document.getElementById(`action-${a}`).onclick = actions[a]
  }
}

// TODO: there shouldn't be a mousemove event for planting. But it's fun soooo


const player = {
  id: null,
  coords: {x: 0, y: 0},
  mode: 'advance',
  
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
  },
  
  modeAdvance: function() {
    if (this.mode === 'advance') { return }
    this.mode = 'advance'
  },
  
  modeRetreat: function() {
    if (this.mode === 'retreat') { return }
    this.mode = 'retreat'
  }
}

