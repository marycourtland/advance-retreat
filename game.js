const gameSize = {
  x: 800,
  y: 524
}

const Player = require('./player')
const utils = require('./utils')

// meh
const playersById = {}

function addPlayer() {
  const player = new Player(
    `player${new Date().valueOf() - 1557600000000}`, // id
    utils.randCoords(gameSize)
  )
  
  playersById[player.id] = player
  
  return player
}