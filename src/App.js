import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NoteList } from './NoteList'
import {
  ActionsContext,
  ConsoleContext,
  NotesContext,
  useStore,
} from './Store'

import BottomAppBar from './BottomAppBar'
import TopConsole from './TopConsole'

function App() {
  const [con, notes, actions] = useStore()

  return (
    <Fragment>
      <CssBaseline />
      <ConsoleContext.Provider value={con}>
        <NotesContext.Provider notes={notes}>
          <ActionsContext.Provider value={actions}>
            <TopConsole />
            <NoteList notes={notes} />
            <BottomAppBar />
          </ActionsContext.Provider>
        </NotesContext.Provider>
      </ConsoleContext.Provider>
    </Fragment>
  )
}

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}
