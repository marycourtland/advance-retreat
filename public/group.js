// PROTOTYPE!!!!

/* global io, fabric, Game */


var socket
var game

var playersById = {}
var itemsById = {}

window.isGroup = true

window.onload = function() {
  game = new Game('game')
  // game.shouldPlantOnMousemove()

  setTimeout(function() {
    socket = io()
    socket.on("connect", () => {
      socket.emit("view:show-me-the-map", {}, (error, stuff) => {
        var player;
        for (var playerId in stuff.players) {
          player = stuff.players[playerId]
          if (player.id in playersById) { continue; }
          player.object = game.drawPlayer(player)
          playersById[playerId] = player
        }
        for (var itemId in stuff.items) {
          var item = stuff.items[itemId]
          if (item.id in itemsById) { continue; }
          var obj
          if (item.type === 'plant') {
            obj = game.plantOne(item.coords)
          }
          if (item.type === 'turbine') {
            obj = game.drawTurbine(item.coords)
          }
          itemsById[item.id] = obj
        }
      })
    })
    
    
    socket.on("item:new", (item) => {
      var obj
      if (item.type === 'plant') {
        obj = game.plantOne(item.coords)
      }
      if (item.type === 'turbine') {
        obj = game.drawTurbine(item.coords)
      }
      items[item.id] = obj
    })

    socket.on("item:removed", (item) => {
      if (!(item.id in items)) { return }
      game.canvas.remove(items[id])
    })
    
    socket.on("player:new", (player) => {
      if (player.id in playersById) { return }
      playersById[player.id] = player
      player.object = game.drawPlayer(player)
    })
    
    socket.on("player:refresh", (thePlayer) => {
      console.log('REFRESHING PLAYER', thePlayer.id, thePlayer.energy)
      var player = null
      if (thePlayer.id in playersById) {
        player = playersById[thePlayer.id]
      }
      else {
        player = thePlayer
        playersById[player.id] = player
      }

      player.energy = thePlayer.energy
      player.coords.x = thePlayer.coords.x
      player.coords.y = thePlayer.coords.y
      // TODO: anything else to refresh?

      playerObj = player.object
      
      if (!playerObj) {
        playerObj = game.drawPlayer(player)
      }
      else {
        game.refreshPlayer(playerObj, player)
      }
      
      player.object = playerObj
    })

    socket.on("motivations:refresh", (motivations) => {
      refreshMotivations(motivations)
    })
  }, 1000)
  
}


function refreshMotivations(motivations) {
  const elements = Array.from(document.body.getElementsByClassName("motivation"))
  elements.forEach(e => e.remove())

  const motivationList = document.getElementById("motivation-list")

  motivations.forEach((text) => {
    const element = document.createElement("div")
    element.className = "motivation"
    element.innerText = text
    motivationList.append(element)
  })
}