import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { getNotes } from './Store'

const App = function() {
  const [notes] = useState(getNotes)
  return (
    <Fragment>
      <CssBaseline />
      <NoteList notes={notes} />
      <BottomAppBar />
    </Fragment>
  )
}

App.displayName = 'App'

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}
