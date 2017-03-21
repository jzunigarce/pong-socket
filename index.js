'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const players = []

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.post('/login', (req, res) => {
  const playerName = req.body.playerName
  if(players.length === 2)
    res.status(200).send({code: -1})
  else{
    let exists = false
    for (var i = 0; i < players.length; i++) {
      console.log(`${players[i]} ${playerName}`)
      if(players[i] === playerName)
        exists = true
    }

    if(!exists){
      const player = {
        name: playerName,
        order: players.length
      }
      players.push(player)
      res.status(200).send({code: 0, player: player})
    }
    else
      res.status(200).send({code: -2})
  }
})

io.on('connection', (socket) => {
  console.log('Usuario conectado')
})

server.listen(port, () => {
  console.log(`Listen port ${port}`)
})
