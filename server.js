var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')

var app = express()
const port = process.env.PORT || 5000;
var http = require('http').Server(app)
var io = require('socket.io')(http)
var complier = webpack(config)

var initialState = {
  users: {},
  onlineUserNum: 0
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
    initialState.onlineUserNum = Object.keys(initialState.users).length
    socket.emit('user:join',
                          {userID: socket.id,
                           onlineUserNum: initialState.onlineUserNum})
    socket.broadcast.emit('user:join',
                          {userID: socket.id,
                           onlineUserNum: initialState.onlineUserNum})
    console.log(socket.id + ' connected')
    console.log(initialState)
  })
  socket.on('onlineUsers', function (data) {
    socket.broadcast.emit('onlineUsers', data)
    console.log(data)
  })

  socket.on('disconnect', function () {
    socket.emit('user:left', socket.id)
    delete initialState.users[socket.id]
    console.log(socket.id + ' disconnected')
  })
})

http.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at ' + port)
})
