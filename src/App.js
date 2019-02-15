import React, { Fragment, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { getNotes } from './Store'
import { getCached, setCache } from './dom-helpers'

const App = function() {
  const [notes] = useState(() => getCached('notes') || getNotes())

  useEffect(() => {
    setCache('notes', notes)
  }, [notes])

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
