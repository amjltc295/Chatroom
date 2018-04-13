import React, { Component } from 'react'
import MessageList from './MessageList'
import Messager from './Messager'
import UserInput from './UserInput'
import Navbar from './Navbar'
var socket = io.connect()

const initialState = {
  newMessage: '',
  threads: {
    'Public Room': {
        name: 'Public Room',
        profilePic: 'https://scontent.ftpe7-4.fna.fbcdn.net/v/t1.0-9/22688095_1679926095374089_5126135710824419760_n.jpg?_nc_fx=ftpe7-2&_nc_eui2=v1%3AAeEUHpybF0Art51sdIiUHGVIGYu_8F7gpRVHTW-7L6SHCYnqdG1ClzVyzjW9NphQxPmR3P9DfGGIz2L8JIx7EsMWh-Vnfrun8k1m8tWY43kXig&oh=c85d05f8bf4016b267ab03d3a09b4a3e&oe=5B021CE9',
        messages: [
          { fromMe: false,
            userName: 'Manager - Allen',
            text: 'Hello, I am Ya-Liang Chang (Allen).',
            time: '00:00am' },
          { fromMe: false,
            userName: 'Manager - Allen',
            text: 'Welcome to NTUEE ESLab HW1 Demo!! Testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
            time: '00:00am' }
        ]
    },
    'Miss Google': {
      name: 'Miss Google',
      profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsx836kGDPfzvZ6B8NZhk7zP4dNFBdPnku0AbOR6xM4bicIJX1',
      messages: [
        { fromMe: false,
          userName: 'Miss Google',
          text: 'Welcome, dear User!, I\'m Miss Google.', time: '00:00am' },
        { fromMe: false,
          userName: 'Miss Google',
          text: 'Leave a message and I\'ll translate it for you in a random language!', time: '00:00am' },
      ]
    },
  },
  userID: null,
  userName: null,
  currentTargetID: 'Public Room',
  onlineUsers: {},
  onlineUserNum: 0
}

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = initialState
		this._publicMessageRecieve = this._publicMessageRecieve.bind(this)
		this._googleMessageRecieve = this._googleMessageRecieve.bind(this)
		this._userJoined = this._userJoined.bind(this)
    this._initialize = this._initialize.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  handleUserNumChange () {
    const onlineUserNum = this.state.onlineUserNum
  }

  handleMessageChange (event) {
    this.setState({ newMessage: event.target.value })
  }

  handleMessagerChange (event) {
    this.setState({ currentTargetID: event })
  }

  handleKeyDown (event) {
    const message = event.target.value
    const time = new Date().toTimeString()
    const {threads, userID, userName, currentTargetID, onlineUsers, onlineUserNum} = this.state
    const addMessage = {fromMe: true,
                        userName: (userName ? userName : userID),
                        text: message, time: time}

    if (event.keyCode === 13 && message !== '') {
      threads[currentTargetID].messages.push(addMessage)

      this.setState({
        newMessage: '',
        threads: threads
      })
      if (currentTargetID == 'Public Room') {
        socket.emit('onlineUsers', {userName: (!userName ? userID : userName),
                                    message: addMessage})
      }
      else if (currentTargetID == 'Miss Google') {
        socket.emit('google',
                    {userName: (!userName ? userID : userName),
                     message: addMessage})
      }
      else {
        socket.emit('onlineUsers', {userName: (!userName ? userID : userName),
                                    message: addMessage})
      }
   }
  }

  componentDidUpdate(prevProp, prevState) {
    const {newMessage, threads, userID, userName, currentTargetID, onlineUsers, onlineUserNum} = this.state
    if (this.state.newMessage == '') {
      this.scrollToBottom()
    }
  }

  componentDidMount () {
    this._initialize()
    socket.on('onlineUsers', this._publicMessageRecieve)
    socket.on('google', this._googleMessageRecieve)
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
      const {threads, userID, userName, currentTargetID, onlineUsers, onlineUserNum} = this.state
      const time = new Date().toTimeString()
      const addMessage = {fromMe: false,
                          userName: data.message.userName,
                          text: data.message.text,
                          time: data.message.time}
      threads['Public Room'].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}
	_googleMessageRecieve(data) {
    if (data.message !== undefined) {
      const {threads, userID, userName, currentTargetID, onlineUsers, onlineUserNum} = this.state
      const time = new Date().toTimeString()
      const addMessage = {fromMe: false,
                          userName: data.message.userName,
                          text: data.message.text,
                          time: data.message.time}
      threads['Miss Google'].messages.push(addMessage)
      this.setState({threads: threads})
    }
	}

	_userJoined(data) {
    if (this.state.userID == null) {
      this.setState({userID: data.userID})
    }
    const {threads, userID, userName, currentTargetID, onlineUsers, onlineUserNum} = this.state
    onlineUsers[data.userID] = ""
    this.setState({onlineUsers: onlineUsers,
                   onlineUserNum: data.onlineUserNum})
	}

	_userLeft(data) {
    delete initialState.users[socket.id]
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

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'auto' });
  }
  render () {
    const {threads, userID, userName, currentTargetID,
           onlineUsers, onlineUserNum} = this.state
    return (
      <div className='chat-app clarfix'>
        <Navbar
          onlineUserNum={onlineUserNum}
          handleUserNumChange={this.handleUserNumChange.bind(this)}
          userID={userID}
          userName={userName}
        />

        <div className='chat-app_left'>
          <div className='heading'>
            <h3 className='messenger-title'>Messagers</h3>
          </div>
          <div className='thread-list'>
            {Object.keys(threads).map((id_, index) => {
              const thread = threads[id_]
              const { name, profilePic, messages } = thread
              const lastMessage = messages[messages.length - 1]
              return (
                <Messager
                  key={id_}
                  src={profilePic}
                  name={name}
                  content={lastMessage.text}
                  time={lastMessage.time}
                  handleMessagerChange={this.handleMessagerChange.bind(this, id_)}
                />
              )
            })}
          </div>
        </div>
        <div className='chat-app_right'>
          <div className='heading'>
            <div className='current-target'>{threads[currentTargetID].name}</div>
          </div>
          <div className='message-list'>
            <MessageList threads={threads} id_={currentTargetID} />
            <div ref={el => { this.el = el; }} />
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
