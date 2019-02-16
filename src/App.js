import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NoteList } from './NoteList'
import { useStore } from './Store'
import BottomAppBar from './BottomAppBar'
import TopConsole from './TopConsole'

function App() {
  const [con, displayNotes, actions] = useStore()

  return (
    <Fragment>
      <CssBaseline />
      <TopConsole con={con} />
      <NoteList notes={displayNotes} />
      <BottomAppBar con={con} actions={actions} />
    </Fragment>
  )
}

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}
