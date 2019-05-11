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
  canvas = new fabric.StaticCanvas('game', {
    backgroundColor: 'lightgray'
    // ...
  });
  
  canvas.on({
    'touch:gesture': function() {
      console.log('Evt - Gesture');
    },
    'touch:drag': function() {
      console.log('Evt - Dragging');
    },
    'touch:orientation': function() {
      console.log('Evt - Orientation');
    },
    'touch:shake': function() {
      console.log('Evt - Shaking');
    },
    'touch:longpress': function() {
      console.log('Evt - Longpress');
    },
    'touch:longpress': function() {
      console.log('Evt - Longpress');
    },
    'event:dragover': function() {
      console.log('Evt - dragover');
    },
    'event:dragover': function() {
      console.log('Evt - dragover');
    }
  });
  
  paint({x: 200, y: 200})
  
  return
  
  // {"e":{"isTrusted":true},"target":null,"subTargets":[],"button":1,"isClick":false,"pointer":{"x":252,"y":114.15625},"absolutePointer":{"x":252,"y":114.15625},"transform":null}
  
  
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


function paint(coords) {
    // just do a single handful
    var dotCoords
    for (var i = 0; i < paintStrength; i++) {
        dotCoords = randCoords(
            addCoords(coords, {x: -paintRadius, y: -paintRadius}),
            addCoords(coords, {x: paintRadius, y: paintRadius})
        )
      
        const dot = new fabric.Circle({
          left: dotCoords.x,
          top: dotCoords.y,
          fill: 'green',
          radius: paintDotSize
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
