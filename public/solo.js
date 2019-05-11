// PROTOTYPE!!!!

/* global fabric */



const gameSize = {x: 800, y: 524}

const paintRadius = 15 // region in which to paint
const paintStrength = 2
const paintRate = 5 // paints per second
const paintDotSize = 2 // size of each dot

var canvas

window.onload = function() {
  canvas = new fabric.Canvas('game', {
    backgroundColor: 'lightgray',
    selection: false
  });
  
  canvas.on({
    'mouse:move': function(event) {
      var p = canvas.getPointer(event.e)
      paint(p)
      paint(p)
      paint(p)
    },
    'touch:gesture': function() {
      var text = document.createTextNode(' Gesture ');
    },
    'touch:drag': function() {
      var text = document.createTextNode(' Dragging ');
    },
    'touch:orientation': function() {
      var text = document.createTextNode(' Orientation ');
    },
    'touch:shake': function() {
      var text = document.createTextNode(' Shaking ');
      var p = canvas.getPointer(event.e)
      paint(p)
    },
    'touch:longpress': function() {
      var p = canvas.getPointer(event.e)
      paint(p)
      var text = document.createTextNode(' Longpress ');
    }
  });
  
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
          radius: paintDotSize,
          selectable: false
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
