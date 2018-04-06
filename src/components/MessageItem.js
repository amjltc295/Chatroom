import React, { Component, PropTypes } from 'react';

export default class MessageItem extends Component {
  static propTypes = {
    fromMe: PropTypes.bool.isRequired,
    userID: PropTypes.string,
    text: PropTypes.string.isRequired,
    userName: PropTypes.string
  }

  render() {
    const { fromMe, userID, text} = this.props;
    return (
      <div className={`message-item ${fromMe ? 'message-from-me' : 'message-from-other'}`}>
        <div className="message-name">
          {userID}
        </div>
        <span>{text}</span>
      </div>
    );
  }
}
