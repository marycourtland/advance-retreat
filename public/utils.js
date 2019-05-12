const utils = {}

if (!window) {
  module.exports = utils
}

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

// html stuff

utils.show = function(id, display) {
  const element = document.getElementById(id);
  if (!element) { return }
  element.style.display = display || 'block'
}

utils.hide = function(id) {
  const element = document.getElementById(id);
  if (!element) { return }
  element.style.display = 'none'
}

utils.addClass = function(id, newClass) {
  const element = document.getElementById(id);
  if (!element) { return }
  const classes = element.className.split(" ")
  if (classes.indexOf(newClass) > -1) { return }
  classes.push(newClass)
  element.className = classes.join(" ")
}

utils.removeClass = function(id, oldClass) {
  const element = document.getElementById(id);
  if (!element) { return }
  const classes = element.className.split(" ")
  if (classes.indexOf(oldClass) === -1) { return }
  classes.splice(classes.indexOf(oldClass), 1)
  element.className = classes.join(" ")
}