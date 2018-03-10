import React, { Component, PropTypes } from 'react';

export default class Navbar extends Component {
  static propTypes = {
    onlineUsers: PropTypes.number.isRequired,
    handleUserNumChange: PropTypes.func.isRequired
  }

  componentWillUnmount () {
  }

  render () {
    // There is a double conunting issus,
    // so the onlineUsers is devided by two
    const {onlineUsers, handleUserNumChange} = this.props;
    return (
      <nav className='nav-bar'>
        <div className='nav-padding'>
          <div className='nav-title'>
            <span> NTUEE ESLab HW1 </span>
          </div>
        </div>
        <div className='nav-users' onClick={handleUserNumChange}>
          <span > Online users: {onlineUsers / 2} </span>
          <div id='num'> </div>
        </div>
      </nav>
    )
  }
}
