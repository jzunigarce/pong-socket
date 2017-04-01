'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port  = process.env.PORT || 3000
const players = []
const tableW = 820
const tableH = 576

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('A user connection')
  socket.on('join', (data) => {
    const isValid = isValidPlayer(data)
    if (isValid.code === 0) {
      const player = {
        name: data,
        order: players.length,
        point: 0
      }
      players.push(player)
      isValid.order = player.order
      isValid.w = tableW
      isValid.h = tableH

      if(players.length === 2){
        const paddleW = 30
        const paddleH = 80
        for(let i = 0; i < 2; i++){
          players[i].x = i === 0 ? 0 : tableW - paddleW
          players[i].y = Math.floor(tableH / 2) - Math.floor(paddleH / 2)
          players[i].w = paddleW
          players[i].h = paddleH
          players[i].c = i === 0 ? '#f00' : '#00f'
        }
      }
    }
    socket.emit('join', isValid)
    socket.on('ready', () => {
      io.emit('game', {players: players})
    })

    socket.on('move', (data) => {
      console.log('move')
      socket.broadcast.emit('move', data)
    })
  })
})

const isValidPlayer = function (playerName) {
  if (players.length < 2){
    let exists = false;
    for (let i = 0; i < players.length; i++)
      if (players[i].name === playerName)
        exists = true
    if (!exists) return {code: 0}
    else return {code: -1}
  } else
    return {code: -2}
}

server.listen(port, () => {
  console.log(`Estoy conectado al puerto ${port}`)
})
