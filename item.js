const utils = require('./utils')

                      
function Item(type, id, coords) {
  this.id = id
  this.type = type
  this.coords = coords
  this.active = true
}

Item.prototype = {}

module.exports = Item