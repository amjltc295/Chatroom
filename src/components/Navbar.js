import React, { Component, PropTypes } from 'react';

export default class Navbar extends Component {
  static propTypes = {
    onlineUserNum: PropTypes.number.isRequired,
    handleUserNumChange: PropTypes.func.isRequired,
    userID: PropTypes.string,
    userName: PropTypes.string
  }

  componentWillUnmount () {
  }

  render () {
    const {onlineUserNum, handleUserNumChange, userID, userName} = this.props;
    return (
      <nav className='nav-bar'>
        <div className='nav-padding'>
          <div className='nav-title'>
            <span> NTUEE ESLab HW1 </span>
          </div>
        </div>
        <div className='nav-user'>
          Name: {!userName ? userID : userName}
        </div>
        <div className='nav-usernum' onClick={handleUserNumChange}>
          <span > Online users: {onlineUserNum} </span>
          <div id='num'> </div>
        </div>
      </nav>
    )
  }
}
