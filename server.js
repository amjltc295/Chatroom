var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var complier = webpack(config)
var onlineUsers = 0
var appearedUserNum = 0

var initialState = {
  users: {},
  onlineUsers: 0
}
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

  socket.on('user:init', function (data) {
    initialState.users[socket.id] = socket
    initialState.onlineUsers = Object.keys(initialState.onlineUsers).length
    socket.emit('user:join', socket.id)
    console.log(socket.id + ' connected')
    console.log(initialState)
  })
  socket.on('onlineUsers', function (data) {
    socket.emit('onlineUsers', data)
    console.log(data)
  })

  socket.on('disconnect', function () {
    socket.emit('user:left', socket.id)
    initialState.onlineUsers--
    delete initialState.users[socket.id]
    console.log(socket.id + ' disconnected')
  })
})

http.listen(3000, 'localhost', (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:3000')
})
