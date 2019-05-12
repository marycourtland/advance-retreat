const utils = require('./utils')
// const 
                      
function Player(id, coords) {
  this.id = id
  this.coords = coords
  this.active = true
  this.energy = 100 // full energy
  
  // something to distinguish different people. HSL 
  this.color = [utils.randInt(0, 360), 50, 40]
}

Player.prototype = {}

Player.prototype.emit = function(evt, data) {
  if (!this.socket) { return }
  this.socket.emit(evt, data)
}

Player.prototype.setSocket = function(socket) {
  this.socket = socket
}

Player.prototype.updateEnergy = function(dE) {
  this.energy += dE
  
}

module.exports = Player