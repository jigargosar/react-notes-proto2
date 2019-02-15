import './pre-boot'
import React from 'react'
import ReactDOM from 'react-dom'
import 'tachyons'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

function render() {
  ReactDOM.render(
    <ThemeProvider
      theme={createMuiTheme({
        typography: {
          suppressWarning: true,
        },
      })}
    >
      <App />
    </ThemeProvider>,
    document.getElementById('root'),
  )
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

if (module.hot) {
  module.hot.accept(render)
}
