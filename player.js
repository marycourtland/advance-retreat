const utils = require('./utils')
                      
module.exports = function Player(id, coords) {
  this.id = id
  this.coords = coords
  this.active = true
  this.energy = 100 // full energy
  
  // something to distinguish different people. HSL 
  this.color = [utils.randInt(0, 360), 50, 40]
}