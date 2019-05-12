const utils = {}
module.exports = utils

utils.addCoords = function(coords1, coords2) {
  return {
    x: coords1.x + coords2.x,
    y: coords1.y + coords2.y,
  }
}


utils.randCoords = function(coords1, coords2) {
  if (!coords2) {
    coords2 = coords1
    coords1 = {x: 0, y: 0}
  }
  return {
    x: utils.randInt(coords1.x, coords2.x),
    y: utils.randInt(coords1.y, coords2.y),
  }
}

utils.randInt = function(a, b) {
  if (typeof b === 'undefined') {
    b = a
    a = 0
    
  } 
  return a + Math.floor(Math.random() * (b - a))
}


utils.getId = function(prefix) {
  return `${prefix}${new Date().valueOf() - 1557600000000}`
}