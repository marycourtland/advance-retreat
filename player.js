const utils = require('./utils')
const energyActions = require('./energy-actions')
                      
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
  this.energy = Math.min(this.energy, 100)
  this.energy = Math.max(this.energy, 0)
  
  this.emit('player:refresh', this)
  
}

module.exports = Player