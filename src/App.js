import React, { Component } from 'react'

class MenuIcon extends Component {
  render() {
    return (
      <div
        className="dib lh-solid w2 h2 flex items-center justify-center"
        tabIndex={0}
      >
        |||
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="">
        <div className="pa2 f4 bg-dark white flex items-center">
          <MenuIcon />
          <div className="lh-solid">APP HEADER</div>
        </div>
      </div>
    )
  }
}

export default App
