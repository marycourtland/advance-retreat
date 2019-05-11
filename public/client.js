// PROTOTYPE!!!!

/* global fabric */



const gameSize = {x: 800, y: 524}

const paintRadius = 15 // region in which to paint
const paintStrength = 2
const paintRate = 5 // paints per second
const paintDotSize = 2 // size of each dot

var canvas, ctx

var paintInterval

window.onload = function() {
  canvas = new fabric.Canvas('game', {
    backgroundColor: 'gray',
    selectionColor: 'blue',
    selectionLineWidth: 2
    // ...
  });
  
  return
  
  
  
  
  canvas = document.getElementById('game')
  ctx = canvas.getContext('2d')
  
  canvas.onmousedown = function(evt) {
    const coords  = { x: evt.clientX, y: evt.clientY }
    console.log('coords', coords)
    paintInterval = setInterval(() => {
      paint(ctx, coords)
    }, 1000 / paintRate)
  }
  
  canvas.onmouseup = function(evt) {
    clearInterval(paintInterval)
  }
  
  paint(ctx, {x: 200, y: 200})
}


function paint(ctx,  coords) {
    // just do a single handful
    var dotCoords
    for (var i = 0; i < paintStrength; i++) {
        dotCoords = randCoords(
            addCoords(coords, {x: -paintRadius, y: -paintRadius}),
            addCoords(coords, {x: paintRadius, y: paintRadius})
        )
      
        const dot = new fabric.Rect({
          left: dotCoords.x,
          top: dotCoords.y,
          fill: 'green',
          width: paintDotSize,
          height: paintDotSize
        });
        canvas.add(dot);
    }
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
