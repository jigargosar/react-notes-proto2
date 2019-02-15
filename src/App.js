import React, { Component } from 'react'

function MenuIcon() {
  return (
    <div className="dib pa1 lh-solid" tabIndex={0}>
      |||
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="">
        <div className="pa3 f4 bg-dark white">
          <MenuIcon />
          APP HEADER
        </div>
      </div>
    )
  }
}

export default App
