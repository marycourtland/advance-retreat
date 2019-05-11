// PROTOTYPE!!!!

/* global fabric, Game */

(function() {


  const gameSize = {x: 800, y: 524}

  const paintRadius = 30 // region in which to paint
  const paintStrength = 2
  const paintRate = 5 // paints per second
  const dotSize = 2 // size of each dot


  const Game = function(canvasId) {
    this.canvas = new fabric.Canvas(canvasId, {
      backgroundColor: 'lightgray',
      selection: false
    });

    this.canvas.on({
      'mouse:move': (event) => {
        var p = this.canvas.getPointer(event.e)
        this.paint(p)
      }
    });
  }
  
  window.Game = Game;
  Game.prototype = {}

  Game.prototype.paint = function(coords) {
    // just do a single handful
    var dotCoords
    for (var i = 0; i < paintStrength; i++) {
      this.drawPlant(randCoords(
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