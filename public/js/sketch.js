'use strict'

const login = document.getElementById('login')
let socket
let w = 0
let h = 0
let status = 0
let textX = 0
let order
let player1
let player2

var setup = function () {
  const canvas = createCanvas(w, h)
  canvas.parent('game')
}

var draw = function () {
  background('#ccc')
  game()
}

login.addEventListener('submit', (e) => {
  e.preventDefault()
  const playerName = document.getElementById('playerName')
  if (playerName.value.length > 0) {
    socket = io.connect('http://localhost:3000')
    socket.on('connect', (data) => {
      socket.emit('join', playerName.value)
    })
    socket.on('join', (data) => {
      if (data.code === 0) {
        resizeCanvas(data.w, data.h)
        const game = document.getElementById('game')
        const login = document.getElementById('login-section')
        game.classList.remove('hidden')
        login.classList.add('hidden')
        status = 1
        order = data.order

        if (order === 1)
          socket.emit('ready')
      }
    })
    socket.on('game', (data) => {
      if(order === 0){
        player1 = data.players[0]
        player2 = data.players[1]
      }else {
        player1 = data.players[1]
        player2 = data.players[0]
      }
      status = 2
    })

    socket.on('move', (data) => {
      player2.y = data
    })
  }
})

const game = function () {
  switch (status) {
    case 1:
      textSize(32)
      textAlign(LEFT, CENTER)
      fill(0, 102, 154)
      text('Waiting for opponent', textX++, floor(height / 2))
      if(textX === width)
        textX = 0
      break
    case 2:
      drawPaddle(player1)
      drawPaddle(player2)
      if (keyIsDown(UP_ARROW) && player1.y >= 0) {
        player1.y--
        socket.emit('move', player1.y)
      }else if (keyIsDown(DOWN_ARROW) && player1.y <= height - player1.h) {
        player1.y++
        socket.emit('move', player1.y)
      }
      break
  }
}

const drawPaddle = function (player) {
  fill(player.c)
  rect(player.x, player.y, player.w, player.h)
}
