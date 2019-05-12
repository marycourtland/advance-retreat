const utils = require('./utils')
// const 
                      
function Plant(id, coords) {
  this.id = id
  this.type = 'plant'
  this.coords = coords
  this.active = true
}

Plant.prototype = {}

module.exports = Plant