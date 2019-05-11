
const gameSize = {x: 800, y: 524}

const paintRadius = 40 // region in which to paint
const paintRate = 10 // squares at a time
const paintDotSize = 3 // size of each dot

window.onload = function() {
  const canvas = document.getElementById('game')
  const ctx = canvas.getContext('2d')
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

function go() {
  paint({x: 200, y: 200})
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
        x: randInt()
    }
}

function randInt(a, b) {
    if (typeof b === 'undefined') {
        b = a
        a = 0
    }
    return a + Math.floor(Math.random() * (b - a))
}
