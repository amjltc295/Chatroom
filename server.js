var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var complier = webpack(config)
var onlineUsers = 0

app.use(require('webpack-dev-middleware')(complier, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

app.use(require('webpack-hot-middleware')(complier))

app.get('/messenger', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/', function (req, res) {
  res.send('<h1>Hello world</h1>')
})

io.on('connection', function (socket) {
  onlineUsers++
  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers })

  socket.on('disconnect', function () {
    onlineUsers--
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers })
    console.log('A user disconnected')
    console.log(io.engine.clientsCount / 2)
  })
  console.log('A user connected')
  console.log(io.engine.clientsCount / 2)
  console.log(socket.eventNames())
})

http.listen(3000, 'localhost', (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:3000')
})
