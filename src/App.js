import React, { Component } from 'react'

function MenuIcon() {
  return (
    <div className="dib lh-solid " tabIndex={0}>
      |||
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="">
        <div className="pa3 f4 bg-dark white flex">
          <MenuIcon />
          <div className="lh-solid">APP HEADER</div>
        </div>
      </div>
    )
  }
}

export default App
