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
const ZOOM = 1

const playersById = {}
var socket
var game

// hack to get audio to work
window.addEventListener("touchstart", window.unlock);

window.onload = function() {
  const motivate = document.getElementById("motivate-input")
  motivate.onclick = function() {
    $.hide("motivate-input")
  }
  const motivateText = document.getElementById("motivate-text")
  motivateText.onclick = function(evt) {
    evt.stopPropagation()
  }
  
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
  

  // TODO: clean up ambigious 'player' var names
  
  setTimeout(function() {
    socket = io()
    socket.on("connect", function() {
      player.init()
      player.shouldMoveOnTouch()

      socket.on("player:refresh", (thePlayer) => {
        var player;
        if (thePlayer.id === window.player.id) {
          player = window.player;
        }
        else if (thePlayer.id in playersById) {
          player = playersById[thePlayer.id];
        }
        else {
          playersById[thePlayer.id] = thePlayer;
          player = thePlayer;
        }
        console.log('REFRESHING PLAYER', player.id, thePlayer.coords)
        
        player.energy = thePlayer.energy
        player.coords.x = thePlayer.coords.x
        player.coords.y = thePlayer.coords.y
        // TODO: anything else to refresh?

        // this player

        if (thePlayer.id === window.player.id) {
          window.player.draw()

          // check for retreat mode
          if (player.mode === 'advance' && player.energy === 0) {
            setTimeout(function() {
              player.modeRetreat()
            }, 500)
          }
          else if (player.mode === 'retreat' && player.energy >= MIN_ENERGY) {
            // Player can go back to normal mode now
            $.show("action-return")
          }
        }
        else {
          // drawing a different player
          drawPlayer(player)
          
        }

        
        // playersById[player.id] = playerObj

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
    },
    'motivate': () => {
      $.show("motivate-input")
      $.focus("motivate-text")
    },
    'motivate-send': () => {
      $.hide("motivate-input")
      socket.emit('action:motivation', {
        text: document.getElementById("motivate-text").value.trim()
    })
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
    window.player = this
    socket.emit('game:join', {id: this.id}, (error, playerData) => {
      this.id = playerData.id
      this.coords = playerData.coords
      this.color = playerData.color
      socket.emit('view:show-me-the-map', {}, (error, stuff) => {
        var player;
        for (var playerId in stuff.players) {
          if (playerId === this.id) { return }
          player = stuff.players[playerId]
          drawPlayer(player)
          playersById[playerId] = player
        }
        for (var itemId in stuff.items) {
          var item = stuff.items[itemId]
          if (item.type === 'plant') {
            game.plantOne(item.coords)
          }
          if (item.type === 'turbine') {
            game.drawTurbine(item.coords)
          }
        }
        // make sure player is in front
        this.object.bringToFront()
      })
      
      // center on players
      this.draw()
      this.centerGameOnMe()
    })
  },

  centerGameOnMe: function() {
    const centerOffset = window.innerHeight * 0.05
    
    // fabricjs is weird so set zoom first
    // game.canvas.zoomToPoint(game.canvas.getVpCenter(), ZOOM)

    const playerCenter = this.object.getCenterPoint()
    const canvasCenter = game.canvas.getVpCenter()
    game.canvas.relativePan(new fabric.Point(
      (canvasCenter.x - playerCenter.x)*ZOOM,
      (canvasCenter.y - centerOffset - playerCenter.y)*ZOOM
    ))
  },

  shouldMoveOnTouch: function() {
    game.canvas.on({
      'mouse:down': (event) => {
        var p = game.canvas.getPointer(event.e)
        this.moveToward(p)
      }
    });
  },

  moveToward: function(coords) {
    if (this.mode === 'retreat') { return }
    const velocity = 15
    const angle = _.angleTo(this.coords, coords)
    const newCoords = _.addRthToCoords(
      this.coords,
      {r: velocity, th: angle}
    )
    this.coords = newCoords
    // wait until server sends a refresh event to update position
    socket.emit('action:move', {coords: newCoords})
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
    this.zoom(1, 3000)

    // wait until overlay is finished to change mode
    setTimeout(() => {
      this.mode = 'advance';
      if (this.rechargeInterval) {
        clearInterval(this.rechargeInterval)
        delete this.rechargeInterval
      }
      sounds.birdsong.pause()  

      $.removeClass('actions', 'hidden')
      $.addClass('retreat-overlay', 'hidden')
    }, 3000)

  },
  
  modeRetreat: function() {
    if (this.mode === 'retreat') { return }

    game.drawRetreatOverlay()
    this.zoom(4, 3000)

    // wait until overlay is finished to change mode
    setTimeout(() => {
      this.mode = 'retreat';
      this.rechargeInterval = setInterval(function() {
        player.recharge()
      }, rechargeTime)
      // do this immediately
      $.removeClass('retreat-overlay', 'hidden')

      this.object.bringToFront()
      
      sounds.birdsong.play()
    }, 3000)


    if (player.energy >= MIN_ENERGY) {
      $.show("action-return")
    }
    else {
      $.hide("action-return")
    }
    
    $.addClass('actions', 'hidden')
  },

  zoom: function(zoom, duration) {
    this.object.animate('scaleX', zoom, {
      duration: duration,
      onChange: this.object.canvas.renderAll.bind(this.object.canvas),
      onComplete: () => {},
      easing: fabric.util.ease['easeOutQuad']
    })

    this.object.animate('scaleY', zoom, {
      duration: duration,
      onChange: this.object.canvas.renderAll.bind(this.object.canvas),
      onComplete: () => {},
      easing: fabric.util.ease['easeOutQuad']
    })
  },

  draw: function() {
    drawPlayer(this)

    // player info
    $.text("player-energy", `Your energy: ${player.energy}%`)

    return this.object
  }
}

function drawPlayer(player) {
  if (!player.object) {
    player.object = game.drawPlayer(player)

  }
  else {
    player.object = game.refreshPlayer(player.object, player)
  }

  if (player.id !== window.player.id) {
    player.object.set('scaleX', 0.7)
    player.object.set('scaleY', 0.7)
    if (window.player.mode === 'advance') {
      player.object.moveTo(1)
    }
    else {
      player.object.moveTo(2)
    }
  }
  else {
    player.centerGameOnMe()
    player.object.bringToFront()
    game.canvas.renderAll()
  }
  return player
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

$.focus = function(id) {
  const element = document.getElementById(id);
  if (!element) { return }
  element.onfocus = function(evt) {
    evt.preventDefault()
  }
  element.focus({preventScroll: true})
}

// mathy
const _ = {}

_.angleTo = function(coords1, coords2) {
  if (!coords2) {
    coords2 = coords1
    coords1 = {x: 0, y: 0}
  }
  return Math.atan2((coords2.y - coords1.y), (coords2.x - coords1.x))
}

_.addRthToCoords = function(coords, rth) {
  return {
    x: coords.x + rth.r * Math.cos(rth.th),
    y: coords.y + rth.r * Math.sin(rth.th)
  }
}
