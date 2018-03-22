import React, { Component, PropTypes } from 'react';

export default class Navbar extends Component {
  static propTypes = {
    onlineUserNum: PropTypes.number.isRequired,
    handleUserNumChange: PropTypes.func.isRequired
  }

  componentWillUnmount () {
  }

  render () {
    const {onlineUserNum, handleUserNumChange} = this.props;
    return (
      <nav className='nav-bar'>
        <div className='nav-padding'>
          <div className='nav-title'>
            <span> NTUEE ESLab HW1 </span>
          </div>
        </div>
        <div className='nav-users' onClick={handleUserNumChange}>
          <span > Online users: {onlineUserNum} </span>
          <div id='num'> </div>
        </div>
      </nav>
    )
  }
}
