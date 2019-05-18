// PROTOTYPE!!!!

/* global utils, io, fabric, Pizzicato, Game */
/* global addCoords, randCoords */

// meh
const plantRadius = 40

const rechargeTime = 1000

const soundFiles = {
  birdsong: 'https://cdn.glitch.com/46e2e6a3-673c-4740-9ce0-0ab28c854d9d%2Fbirdsong.mp3?1557628239205',
}
const sounds = {} // will get populated

window.isGroup = false

const MIN_ENERGY = 80


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
  game = new Game('game', {
    x: window.innerWidth,
    y: window.innerHeight
  })
  // game.shouldPlantOneOnMousemove()
  // player.init()
  
  
  
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
      
      
    socket.on("player:refresh", (thePlayer) => {
      if (thePlayer.id !== player.id) { return }
      console.log('REFRESHING PLAYER', player.id, player.energy)
      
      player.energy = thePlayer.energy
      // TODO: anything else to refresh?

      // this player
      player.draw()

      // player info
      $.text("player-energy", `Energy: ${player.energy}%`)
      
      // playersById[player.id] = playerObj

      // check for retreat mode
      if (player.mode === 'advance' && player.energy === 0) {
        setTimeout(function() {
          player.modeRetreat()
        }, 500)
      }
      else if (player.mode === 'retreat' && player.energy >= MIN_ENERGY) {
        // Player can go back to normal mode now
        $.removeClass('retreat-overlay', 'hidden')
      }
    })
    })
  }, 1000)
  
  // action buttons
  const actions = {
    'plant': () => player.plant(),
    'turbine': () => player.buildTurbine(),
    'retreat': () => {
      player.modeRetreat()
    },
    'return': () => {
      player.modeAdvance()
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
  color: 'blue',
  mode: 'advance',
  energy: 100, // energy level 0 to 100
  object: null,
  
  // meh
  rechargeInterval: null,
  
  init: function() {
    socket.emit('game:join', {id: this.id}, (error, playerData) => {
      this.id = playerData.id
      this.coords = playerData.coords
      this.color = playerData.color
      socket.emit('view:show-me-the-map', {})
      
      
      // some UI crap
      const zoom = 4
      const centerOffset = window.innerHeight * 0.05
      
      // fabricjs is weird so set zoom first
      game.canvas.zoomToPoint(game.canvas.getVpCenter(), zoom)
      
      // center on player
      const playerObj = this.draw()
      const playerCenter = playerObj.getCenterPoint()
      const canvasCenter = game.canvas.getVpCenter()
      game.canvas.relativePan(new fabric.Point(
        (canvasCenter.x - playerCenter.x)*zoom,
        (canvasCenter.y - centerOffset - playerCenter.y)*zoom
      ))
    })
  },
  
  recharge: function() {
    // yay
    socket.emit('action:recharge')
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
  
  buildTurbine: function(coords) {
    coords = coords || this.coords
    if (!coords) { return }
    game.drawTurbine(coords)
    socket.emit('action:turbine', coords)
  },
  
  modeAdvance: function() {
    if (this.mode === 'advance') { return }

    game.removeRetreatOverlay()

    // wait until overlay is finished to change mode
    setTimeout(() => {
      this.mode = 'advance';
      if (this.rechargeInterval) {
        clearInterval(this.rechargeInterval)
        delete this.rechargeInterval
      }
      sounds.birdsong.pause()  

      $.removeClass('actions', 'hidden')
    }, 3000)
    $.addClass('retreat-overlay', 'hidden')

  },
  
  modeRetreat: function() {
    if (this.mode === 'retreat') { return }


    game.drawRetreatOverlay()

    // wait until overlay is finished to change mode
    setTimeout(() => {
      this.mode = 'retreat';
      this.rechargeInterval = setInterval(function() {
        player.recharge()
      }, rechargeTime)  
      sounds.birdsong.play()
    }, 3000)

    if (player.energy >= MIN_ENERGY) {
      $.removeClass('retreat-overlay', 'hidden')
    }
    
    $.addClass('actions', 'hidden')
  },

  draw: function() {
    if (!this.object) {
      this.object = game.drawPlayer(this)

    }
    else {
      this.object = game.refreshPlayer(this.object, this)
      game.canvas.renderAll() // meh, not refreshing?
    }

    // player info
    $.text("player-energy", `Energy: ${player.energy}%`)

    return this.object
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

$.text = function(id, text) {
  const element = document.getElementById(id);
  if (!element) { return }
  element.innerText = text
}