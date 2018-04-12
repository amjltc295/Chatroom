import React, { Component, PropTypes } from 'react';
import MessageItem from './MessageItem';

export default class MessageList extends Component {
  static propTypes = {
    threads: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
  }

  render() {
    const { threads, index } = this.props;
    const messages = threads[index].messages;
    const target = threads[index].target;
    return (
      <div>
        {messages.map((message, id) => {
          return (
            <MessageItem key={id}
                         userName={message.userName}
                         fromMe={message.fromMe}
                         text={message.text}
                         icon={target.profilePic} />

          );
        })}
      </div>
    );
  }
}
