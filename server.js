var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')
const translate = require('google-translate-api');

var app = express()
const port = process.env.PORT || 5000;
var http = require('http').Server(app)
var io = require('socket.io')(http)
var complier = webpack(config)

var initialState = {
  publicMessages: [
          { fromMe: false,
            userName: 'Manager - Allen',
            text: 'Hello, I am Ya-Liang Chang (Allen).',
            time: '00:00:00' },
          { fromMe: false,
            userName: 'Manager - Allen',
            text: 'Welcome to NTUEE ESLab HW1 Demo!! Test',
            time: '00:00:00' }
  ],
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
    initialState.users[socket.id] = socket.id.slice(0, 5)
    initialState.onlineUserNum = Object.keys(initialState.users).length
    socket.emit('user:init', initialState.publicMessages)
    io.emit('user:join',
            {userID: socket.id,
             userName: socket.id.slice(0, 5),
             onlineUserNum: initialState.onlineUserNum})
    console.log(socket.id + ' connected')
    const message = {fromMe: false,
                     userName: 'Manager - Allen',
                     text: socket.id + ' joined this room',
                     time: new Date().toTimeString().slice(0, 8)}
    io.emit('onlineUsers', {message: message})
    initialState.publicMessages.push(message)
    console.log(initialState)
  })
  socket.on('google', function (data) {
    const languages = ['en', 'zh-tw', 'ja', 'ko', 'ru', 'es', 'fr']
    const min = 0
    const max = languages.length - 1
    const language = languages[Math.floor(Math.random() * languages.length)]
    console.log(language)
		translate(data.message.text, {to: language}).then(res => {
      const translated_message = {fromMe: false,
                                  userName: 'Miss Google',
                                  text: res.text,
                                  time: data.message.time}
      socket.emit('google', {message: translated_message})
    }).catch(err => {
      socket.emit('google', err)
    });
  })
  socket.on('debug', function (data) {
    console.log(data)
  })
  socket.on('onlineUsers', function (data) {
    var msg = data.message
    msg.fromMe = false
    initialState.publicMessages.push(msg)
    socket.broadcast.emit('onlineUsers', data)
    console.log(data)
  })
  socket.on('private_message', function (data) {
    socket.broadcast.to(data.target).emit('private_message', data)
    console.log(data)
  })

  socket.on('disconnect', function () {
    socket.emit('user:left', socket.id)
    if (socket.id in initialState.users) {
      delete initialState.users[socket.id]
      const message = {fromMe: false,
                       userName: 'Manager - Allen',
                       text: socket.id + ' left this room',
                       time: new Date().toTimeString().slice(0, 8)}
      io.emit('onlineUsers', {message: message})
      initialState.publicMessages.push(message)
      console.log(socket.id + ' disconnected')
    }
  })
})

http.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at ' + port)
})
