import React, { Component, PropTypes } from 'react';

export default class MessageItem extends Component {
  static propTypes = {
    fromMe: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string
  }

  render() {
    const { fromMe, userName, text, icon} = this.props;
    return (
      <div className={`message-item ${fromMe ? 'message-from-me' : 'message-from-other'}`}>
        {!fromMe &&
        <div className="message-icon">
          {icon ? <img className="message-icon" src={icon} /> : 'icon'}
        </div>
        }
        <div className="message-right">
          {!fromMe &&
          <div className="message-name">
            {userName}
          </div>
          }
          <span>{text}</span>
        </div>
      </div>
    );
  }
}
