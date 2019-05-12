// PROTOTYPE!!!!

/* global fabric, Game */

(function() {


  var gameSize = {x: 800, y: 524}

  const paintRadius = 30 // region in which to paint
  const paintStrength = 2
  const paintRate = 5 // paints per second
  const dotSize = 2 // size of each dot
  const faceSize = 15
  
  // for mobile client
  const buttonRadius = 50


  const Game = function(canvasId, size) {
    if (size) {
      gameSize = size
    }
    this.canvas = new fabric.Canvas(canvasId, {
      selection: false
    });
    this.canvas.setWidth(gameSize.x)
    this.canvas.setHeight(gameSize.y)

  }
  
  window.Game = Game;
  Game.prototype = {}
  
  Game.prototype.shouldPlantOnMousemove = function() {
    this.canvas.on({
      'mouse:move': (event) => {
        var p = this.canvas.getPointer(event.e)
        this.plantMany(p)
      }
    });
  }
  
  Game.prototype.shouldPlantOneOnMousemove = function() {
    this.canvas.on({
      'mouse:move': (event) => {
        var p = this.canvas.getPointer(event.e)
        this.plantOne(p)
      }
    });
  }
  
  Game.prototype.plantOne = function(coords) {
    return this.drawPlant(coords)
  }

  Game.prototype.plantMany = function(coords) {
    for (var i = 0; i < paintStrength; i++) {
      this.plantOne(randCoords(
        addCoords(coords, {x: -paintRadius, y: -paintRadius}),
        addCoords(coords, {x: paintRadius, y: paintRadius})
      ))
    }
  }

  Game.prototype.drawDot = function(coords) {
    const dot = new fabric.Circle({
      left: coords.x,
      top: coords.y,
      fill: 'green',
      radius: dotSize,
      selectable: false
    });
    this.canvas.add(dot);
    
    return dot
  }
  

  Game.prototype.drawPlant = function(coords) {
    const plantImg = new fabric.Image(document.getElementById('plant'), {
      left: coords.x,
      top: coords.y,
      opacity: 0.8,
      selectable: false
    });
    const scaleBase = 0.1
    const scaleFuzz = Math.random() * (scaleBase)
    plantImg.scale(scaleBase + (scaleFuzz - (scaleFuzz/2)))
    this.canvas.add(plantImg);
    
    return plantImg
  }
  
  Game.prototype.drawPlayer = function(player, coords) {
    coords = coords || player.coords
    const color = Array.isArray(player.color) ?
      `hsl(${player.color[0]}, ${player.color[1]}%, ${player.color[2]}%)`
      : player.color
    
    
    // blah
    const eyelidColor = Array.isArray(player.color) ?
      `hsl(${player.color[0]}, 60%, 20%)`
      : "gray"
    
    const face = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      fill: color || 'blue',
      radius: faceSize,
      selectable: false
    });
    
    // lol
    
    const eyeSep = 5
    const pupilOffset = {x: 1, y: 1}
    
    const eye1 = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: -eyeSep,
      fill: 'white',
      radius: 4,
      selectable: false
    })
    const eye2 = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: eyeSep,
      fill: 'white',
      radius: 4,
      selectable: false
    })
    const pupil1 = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: -eyeSep + pupilOffset.x,
      top: pupilOffset.y,
      fill: 'black',
      radius: 2,
      selectable: false
    })
    const pupil2 = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: eyeSep + pupilOffset.x,
      top: pupilOffset.y,
      fill: 'black',
      radius: 2,
      selectable: false
    })
    
    const eyelidAngles = getEyelidAngles(player)
    
    const eyelid1 = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: -eyeSep,
      fill: eyelidColor,
      radius: 4.01,
      startAngle: eyelidAngles.start,
      endAngle: eyelidAngles.end,
      selectable: false
    })
    const eyelid2 = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: eyeSep,
      fill: eyelidColor,
      radius: 4.01,
      startAngle: eyelidAngles.start,
      endAngle: eyelidAngles.end,
      selectable: false
    })
    
    var playerObj = new fabric.Group([
      face,
      eye1, eye2,
      pupil1, pupil2,
      eyelid1, eyelid2
    ], {
      left: coords.x,
      top: coords.y,
    })
    
    // blah... want to access these later
    playerObj.face = face
    playerObj.eye1 = eye1
    playerObj.eye2 = eye2
    playerObj.pupil1 = pupil1
    playerObj.pupil2 = pupil2
    playerObj.eyelid1 = eyelid1
    playerObj.eyelid2 = eyelid2
    
    this.canvas.add(playerObj)
    
    player.object = playerObj // blah
    
    return playerObj
  }
  
  
  // blah
  Game.prototype.refreshPlayer = function(playerObj, player) {
    // refresh eyelids
    const eyelidAngles = getEyelidAngles(player)
    console.log('ok', player.energy, eyelidAngles)
    playerObj.eyelid1.set('startAngle', eyelidAngles.start)
    playerObj.eyelid1.set('endAngle', eyelidAngles.end)
    
    
    // TODO: (later?) refresh coords, pupils, etc.
  }
  
  
  // UNUSED
  Game.prototype.drawButton = function(coords, events) {
    
    const circle1 = new fabric.Circle({
      left: coords.x - (buttonRadius + 20)/2,
      top: coords.y - (buttonRadius + 20)/2,
      fill: '#324a70',
      radius: buttonRadius + 20,
      selectable: false
    });
    const circle2 = new fabric.Circle({
      left: coords.x - (buttonRadius)/2,
      top: coords.y - (buttonRadius)/2,
      fill: '#cde2f2',
      radius: buttonRadius,
      selectable: false
    });
    
    if (events) {
      circle2.on(events)
    }
    
    this.canvas.add(circle1);
    this.canvas.add(circle2);
  }

})()



//////

function addCoords(coords1, coords2) {
  return {
    x: coords1.x + coords2.x,
    y: coords1.y + coords2.y,
  }
}


function randCoords(coords1, coords2) {
  if (!coords2) {
    coords2 = coords1
    coords1 = {x: 0, y: 0}
  }
  return {
    x: randInt(coords1.x, coords2.x),
    y: randInt(coords1.y, coords2.y),
  }
}

function randInt(a, b) {
  if (typeof b === 'undefined') {
    b = a
    a = 0
  }
  return a + Math.floor(Math.random() * (b - a))
}

// blah


// this returns the angles needed to render the eyelid
function getEyelidAngles(player) {
  const energyLevel = player.energy / 100
  const eyelidLevel = Math.sin(Math.PI/2 * (1-energyLevel))
  const eyelidAngleStart = 3*Math.PI/2 - (1.2 * Math.PI/2) * eyelidLevel
  const eyelidAngleEnd = 3*Math.PI/2 + (1.2 * Math.PI/2) * eyelidLevel
  return {start: eyelidAngleStart, end: eyelidAngleEnd}
}