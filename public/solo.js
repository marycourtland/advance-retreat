// PROTOTYPE!!!!

/* global utils, io, fabric, Pizzicato, Game */
/* global addCoords, randCoords */

// meh
const plantRadius = 40

const soundFiles = {
  birdsong: 'https://cdn.glitch.com/46e2e6a3-673c-4740-9ce0-0ab28c854d9d%2Fbirdsong.mp3?1557628239205',
}
const sounds = {} // will get populated

///

var socket
var game

// hack to get audio to work
window.addEventListener("touchstart", window.unlock);

window.onload = function() {
  const intro = document.getElementById("intro")
  intro.onclick = function() {
    // not sure if this would be OK outside of the user onclick. TODO: try that
    loadSounds(() => {
      $.addClass('intro', 'hidden')
      start()
    })
  }
}

function loadSounds(done) {
  for (var sound in soundFiles) {
    sounds[sound] = new Pizzicato.Sound({ 
      source: 'file',
      options: {
        path: soundFiles[sound],
        loop: true,
        attack: 1,
        release: 1
      }
    }, function() {
      done()
    });
  }
}


function start() {
  socket = io()
  game = new Game('game')
  game.shouldPlantOneOnMousemove()
  player.init()
  
  
  
  var sawtoothWave = new Pizzicato.Sound({ 
      source: 'wave',
      options: {
          type: 'sawtooth'
      }
  });
  var delay = new Pizzicato.Effects.Delay();
  sawtoothWave.addEffect(delay);
  
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
      player.modeRetreat()
      $.removeClass('retreat-overlay', 'hidden')
    },
    'return': () => {
      player.modeAdvance()
      $.addClass('retreat-overlay', 'hidden')
    }
  }
  
  for (var a in actions) {
    document.getElementById(`action-${a}`).onclick = actions[a]
  }
}

// TODO: there shouldn't be a mousemove event for planting.
// But it's fun soooo


const player = {
  id: null,
  coords: {x: 0, y: 0},
  mode: 'advance',
  
  init: function() {
    socket.emit('game:join', {id: this.id}, (error, playerData) => {
      this.id = playerData.id
      this.coords = playerData.coords
      
      var playerObj = game.drawPlayer(this, {x: 0, y: 0})
      // game.canvas.zoomToPoint(playerObj.getCenterPoint())
    })
  },

  plant: function(coords) {
    coords = coords || randCoords(
      addCoords(this.coords, {x: -plantRadius, y: -plantRadius}),
      addCoords(this.coords, {x: plantRadius, y: plantRadius})
    )
    if (!coords) { return }
    game.plantOne(coords)
    socket.emit('action:plant', coords)
  },
  
  modeAdvance: function() {
    if (this.mode === 'advance') { return }
    this.mode = 'advance'
    
    sounds.birdsong.pause()
  },
  
  modeRetreat: function() {
    if (this.mode === 'retreat') { return }
    this.mode = 'retreat'
    
    sounds.birdsong.play()
  }
}


// html crap

const $ = {}
$.show = function(id, display) {
  const element = document.getElementById(id);
  if (!element) { return }
  element.style.display = display || 'block'
}

$.hide = function(id) {
  const element = document.getElementById(id);
  if (!element) { return }
  element.style.display = 'none'
}

$.addClass = function(id, newClass) {
  const element = document.getElementById(id);
  if (!element) { return }
  const classes = element.className.split(" ")
  if (classes.indexOf(newClass) > -1) { return }
  classes.push(newClass)
  element.className = classes.join(" ")
}

$.removeClass = function(id, oldClass) {
  const element = document.getElementById(id);
  if (!element) { return }
  const classes = element.className.split(" ")
  if (classes.indexOf(oldClass) === -1) { return }
  classes.splice(classes.indexOf(oldClass), 1)
  element.className = classes.join(" ")
}