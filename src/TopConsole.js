import Slide from '@material-ui/core/Slide'
import { Console } from 'console-feed'
import React from 'react'

function TopConsole({ con: { hidden, logs } }) {
  const logsEmpty = logs.length === 0
  return (
    <Slide direction="down" in={!hidden} mountOnEnter unmountOnExit>
      <div
        id="console-container"
        className="fixed max-vh-100 z-9999 overflow-container w-100"
      >
        {logsEmpty ? (
          <div className="ph3 white">{`<no logs>`}</div>
        ) : (
          <Console logs={logs} variant="dark" />
        )}
      </div>
    </Slide>
  )
}

export default TopConsole

// setInterval(() => {
//   console.log('just log')
//   console.warn('warn')
// }, 10000)
