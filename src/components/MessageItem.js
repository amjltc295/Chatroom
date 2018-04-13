import React, { Component, PropTypes } from 'react';

export default class MessageItem extends Component {
  static propTypes = {
    fromMe: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    icon: PropTypes.string,
    handleMessagerAdd: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.handleMessagerClick = this.handleMessagerClick.bind(this)
  }
  handleMessagerClick() {
    this.props.handleMessagerAdd(this.props.userName)
  }

  render() {
    this.handleMessagerClick.bind(this, this.props.userName)
    const { fromMe, userName, text, time, icon, handleMessagerAdd} = this.props;
    return (
      <div className={`message-item ${fromMe ? 'message-from-me' : 'message-from-other'}`} onClick={this.handleMessagerClick}>
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
          <div className="message-wrapper">
            <span>{text}</span>
            {!fromMe &&
            <div className="message-time">
              {time}
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
