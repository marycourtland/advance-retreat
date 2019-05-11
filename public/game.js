// PROTOTYPE!!!!

/* global fabric, Game */

function() {


  const gameSize = {x: 800, y: 524}

  const paintRadius = 15 // region in which to paint
  const paintStrength = 2
  const paintRate = 5 // paints per second
  const dotSize = 2 // size of each dot

  var canvas

  window.onload = function() {
    canvas = new fabric.Canvas('game', {
      backgroundColor: 'lightgray',
      selection: false
    });

    canvas.on({
      'mouse:move': (event) => {
        var p = canvas.getPointer(event.e)
        this.paint(p)
      }
    });
  }


  const Game = {}

  Game.init = function(canvas) {
    this.canvas = canvas
  }

  Game.paint = function(coords) {
    // just do a single handful
    var dotCoords
    for (var i = 0; i < paintStrength; i++) {
      Game.drawDot(randCoords(
        addCoords(coords, {x: -paintRadius, y: -paintRadius}),
        addCoords(coords, {x: paintRadius, y: paintRadius})
      ))
    }
  }

  Game.drawDot = function(coords) {
      const dot = new fabric.Circle({
        left: coords.x,
        top: coords.y,
        fill: 'green',
        radius: dotSize,
        selectable: false
      });
      this.canvas.add(dot);
  }




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
})()