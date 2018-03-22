import React, { Component } from 'react'
import MessageList from './MessageList'
import Messager from './Messager'
import UserInput from './UserInput'
import Navbar from './Navbar'
var socket = io.connect()

const initialState = {
  newMessage: '',
  threads: [
    {
      target: {
        name: 'Public Room',
        profilePic: 'https://scontent.ftpe7-4.fna.fbcdn.net/v/t1.0-9/22688095_1679926095374089_5126135710824419760_n.jpg?_nc_fx=ftpe7-2&_nc_eui2=v1%3AAeEUHpybF0Art51sdIiUHGVIGYu_8F7gpRVHTW-7L6SHCYnqdG1ClzVyzjW9NphQxPmR3P9DfGGIz2L8JIx7EsMWh-Vnfrun8k1m8tWY43kXig&oh=c85d05f8bf4016b267ab03d3a09b4a3e&oe=5B021CE9'
      },
        messages: [
          { fromMe: false,
            text: 'Hello, I am Ya-Liang Chang.',
            time: '00:00am' },
          { fromMe: false,
            text: 'Welcome to NTUEE ESLab HW1 Demo!! TEttttttttttttttttttttttttttttttttttttttttttttaaaaaaaaaaaaaaaat',
            time: '00:00am' }
        ]
    },
    {
      target: {
        name: 'Marshall',
        profilePic: 'http://lorempixel.com/50/50/people/7'
      },
      messages: [
        { fromMe: false, text: '好呦～', time: '12:27am' }
      ]
    },
    {
      target: {
        name: 'Elsa',
        profilePic: 'http://lorempixel.com/50/50/people/1'
      },
      messages: [
        { fromMe: false, text: '蛤？', time: '12:27am' },
        { fromMe: false, text: '來來來～', time: '12:27am' },
        { fromMe: false, text: '靠左邊嗎？', time: '12:27am' },
        { fromMe: true, text: '換我了！', time: '12:27am' },
        { fromMe: true, text: '有看到嗎？', time: '12:27am' }
      ]
    },
    {
      target: {
        name: 'Katharine',
        profilePic: 'http://lorempixel.com/50/50/people/9'
      },
      messages: [
        { fromMe: false, text: '對啊！', time: '12:27am' }
      ]
    }
  ],
  userID: socket.id,
  currentIndex: 0,
  onlineUsers: {}
}

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = initialState
		this._publicMessageRecieve = this._publicMessageRecieve.bind(this)
		this._userJoined = this._userJoined.bind(this)
    this._initialize = this._initialize.bind(this)
  }

  handleUserNumChange () {
    const onlineUsers = this.state.onlineUsers
  }

  handleMessageChange (event) {
    this.setState({ newMessage: event.target.value })
  }

  handleMessagerChange (event) {
    this.setState({ currentIndex: event })
  }

  handleKeyDown (event) {
    const message = event.target.value
    const time = new Date().toTimeString()
    const addMessage = {fromMe: true, text: message, time: time}

    if (event.keyCode === 13 && message !== '') {
      const {threads, currentIndex} = this.state
      threads[currentIndex].messages.push(addMessage)

      this.setState({
        newMessage: '',
        threads: threads
      })
      const userID = this.state.userID
      socket.emit('onlineUsers', {userID: userID,
                                  message: addMessage})
   }
  }

  componentDidMount () {
    this._initialize()
    socket.on('onlineUsers', this._publicMessageRecieve)
		socket.on('send:message', this._publicMessageRecieve);
		socket.on('user:join', this._userJoined);
		socket.on('user:left', this._userLeft);
		socket.on('change:name', this._userChangedName);
	}

	_initialize() {
    this.setState({userID: socket.id})
    socket.emit('user:init', socket.id)
	}

	_publicMessageRecieve(data) {
    if (data.message !== undefined) {
      const {threads, userID, currentIndex, onlineUsers} = this.state
      const time = new Date().toTimeString()
      const addMessage = {fromMe: false,
                          userID: data.userID,
                          text: data.message.text,
                          time: data.message.time}
      threads[0].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}

	_userJoined(data) {
    if (this.state.userID == null) {
      this.setState({userID: data})
    }
    const {threads, userID, currentIndex, onlineUsers} = this.state
    onlineUsers[socket.id] = socket
    this.setState({onlineUsers: onlineUsers})
	}

	_userLeft(data) {
    delete initialState.users[socket.id]
    if (data !== undefined) {
      const {threads, userID, currentIndex, onlineUsers} = this.state
      const time = new Date().toTimeString()
      const addMessage = {fromMe: false,
                          userID: data,
                          text: data + " left",
                          time: time}
      threads[0].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}

	_userChangedName(data) {
		var {oldName, newName} = data;
		var {users, messages} = this.state;
		var index = users.indexOf(oldName);
		users.splice(index, 1, newName);
		messages.push({
			user: 'APPLICATION BOT',
			text : 'Change Name : ' + oldName + ' ==> '+ newName
		});
		this.setState({users, messages});
	}

  render () {
    const { threads, currentIndex, onlineUsers } = this.state
    return (
      <div className='chat-app clarfix'>
        <Navbar
          onlineUsers={onlineUsers}
          handleUserNumChange={this.handleUserNumChange.bind(this)}
        />

        <div className='chat-app_left'>
          <div className='heading'>
            <h3 className='messenger-title'>Messagers</h3>
          </div>
          <div className='thread-list'>
            {threads.map((thread, id) => {
              const { target, messages } = thread
              const lastMessage = messages[messages.length - 1]
              return (
                <Messager
                  key={id}
                  src={target.profilePic}
                  name={target.name}
                  content={lastMessage.text}
                  time={lastMessage.time}
                  handleMessagerChange={this.handleMessagerChange.bind(this, id)}
                />
              )
            })}
          </div>
        </div>
        <div className='chat-app_right'>
          <div className='heading'>
            <div className='current-target'>{threads[currentIndex].target.name}</div>
          </div>
          <div className='message-list'>
            <MessageList threads={threads} index={currentIndex} />
          </div>
          <div className='footer'>
            <UserInput newMessage={this.state.newMessage}
              messageChange={this.handleMessageChange.bind(this)}
              handleKeyDown={this.handleKeyDown.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
