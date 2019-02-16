import Slide from '@material-ui/core/Slide'
import { Console } from 'console-feed'
import React from 'react'

export function TopConsole({ con: { hidden, logs } }) {
  return (
    <Slide
      direction="down"
      in={!hidden && logs.length > 0}
      mountOnEnter
      unmountOnExit
    >
      <div
        id="console-container"
        className="fixed max-vh-100 z-9999 overflow-container"
      >
        {<Console logs={logs} variant="dark" />}
      </div>
    </Slide>
  )
}
