/* disableInspection ES6UnusedImports */
import React, { Component } from 'react'

import { MenuSharp } from '@material-ui/icons'

class App extends Component {
  render() {
    return (
      <div className="">
        <div className="pa2 f4 bg-dark white flex items-center">
          <MenuSharp />
          <div className="lh-solid">APP HEADER</div>
        </div>
      </div>
    )
  }
}

export default App
