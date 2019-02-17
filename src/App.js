import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NoteList } from './NoteList'
import { ActionsContext, useStore } from './Store'
import BottomAppBar from './BottomAppBar'
import TopConsole from './TopConsole'

function App() {
  const [con, notes, actions] = useStore()

  return (
    <Fragment>
      <CssBaseline />
      <ActionsContext.Provider value={actions}>
        <TopConsole con={con} />
        <NoteList notes={notes} />
        <BottomAppBar />
      </ActionsContext.Provider>
    </Fragment>
  )
}

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}
