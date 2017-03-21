(function(){
  'use strict'
  const login = document.getElementById('login')

  login.addEventListener('submit', (e) => {
    e.preventDefault()
    const playerName = document.getElementById('playerName').value
    $.ajax({
      url: 'http://localhost:3000/login',
      type: 'POST',
      dataType: 'json',
      data: {
        playerName: playerName
      }
    }).done((data) => {
      console.log(data)
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log()
    })
  })

  /*const socket = io.connect('localhost:3000')
  socket.on('connect', () => {
    console.log('connect to socket')
  })*/

})()
