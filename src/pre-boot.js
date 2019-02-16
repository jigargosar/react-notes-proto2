import { Decode, Hook } from 'console-feed'

window.__logs = []

Hook(window.console, log => {
  window.__logs.push(Decode(log))
})

require('@material-ui/styles').install()
