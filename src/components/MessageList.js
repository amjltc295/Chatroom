import React, { Component, PropTypes } from 'react';
import MessageItem from './MessageItem';

export default class MessageList extends Component {
  static propTypes = {
    threads: PropTypes.object.isRequired,
    id_: PropTypes.string.isRequired,
    handleMessagerAdd: PropTypes.func.isRequired
  }

  render() {
    const { threads, id_, handleMessagerAdd} = this.props;
    const messages = threads[id_].messages;
    const target = threads[id_];
    return (
      <div>
        {messages.map((message, id) => {
          return (
            <MessageItem key={id}
                         userName={message.userName}
                         fromMe={message.fromMe}
                         text={message.text}
                         icon={target.profilePic}
                         handleMessagerAdd={handleMessagerAdd}/>

          );
        })}
      </div>
    );
  }
}
