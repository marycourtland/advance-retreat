
const gameSize = {x: 800, y: 524}

const paintRadius = 15 // region in which to paint
const paintRate = 5 // squares at a time
const paintDotSize = 2 // size of each dot

var canvas, ctx

window.onload = function() {
  canvas = document.getElementById('game')
  ctx = canvas.getContext('2d')
  
  canvas.onmousedown = function(evt) {
    const coords = { x: evt.clientX, y: evt.clientY }
    console.log('coords', coords)
    
  }
  
  paint(ctx, {x: 200, y: 200})
}

function paint(ctx,  coords) {
    // just do a single handful
    var dotCoords
    for (var i = 0; i < paintRate; i++) {
        dotCoords = randCoords(
            addCoords(coords, {x: -paintRadius, y: -paintRadius}),
            addCoords(coords, {x: paintRadius, y: paintRadius})
        )
        ctx.fillStyle = 'green'
        ctx.fillRect(
            dotCoords.x,
            dotCoords.y,
            paintDotSize,
            paintDotSize
        )
    }
}



// function step(timestamp) {
//   if (!start) start = timestamp;
//   var progress = timestamp - start;
//   element.style.transform = 'translateX(' + Math.min(progress / 10, 200) + 'px)';
//   if (progress < 2000) {
//     window.requestAnimationFrame(step);
//   }
// }

// window.requestAnimationFrame(step);

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
