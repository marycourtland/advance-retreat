// PROTOTYPE!!!!

/* global fabric, Game */

(function() {


  const gameSize = {x: 800, y: 524}

  const paintRadius = 30 // region in which to paint
  const paintStrength = 2
  const paintRate = 5 // paints per second
  const dotSize = 2 // size of each dot


  const Game = function(canvasId, player) {
    this.player = player
    this.canvas = new fabric.Canvas(canvasId, {
      backgroundColor: 'lightgray',
      selection: false
    });

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
  
  Game.prototype.plantOne = function(coords) {
    if (this.player) {
      this.player.plant(coords)
    }
    
    this.drawPlant(coords)
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
  }
  
  

  Game.prototype.drawPlant = function(coords) {
    const img = new fabric.Image(document.getElementById('plant'), {
      left: coords.x,
      top: coords.y,
      opacity: 0.8,
      selectable: false
    });
    const scaleBase = 0.1
    const scaleFuzz = Math.random() * (scaleBase)
    img.scale(scaleBase + (scaleFuzz - (scaleFuzz/2)))
    this.canvas.add(img);
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