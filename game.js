const Player = require('./player')

// meh
const PlayerList = []

function addPlayer() {
  const player = new Player(
    `player${new Date().valueOf() - 1557600000000}`, // id
  )
}