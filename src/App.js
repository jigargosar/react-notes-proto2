import React, { Fragment, useReducer } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { initNotes, notesReducer, toDisplayNote } from './Store'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'

const App = function() {
  const [notes, dispatch] = useReducer(
    notesReducer,
    getCached('notes'),
    initNotes,
  )

  useCacheEffect('notes', notes)

  const displayNotes = notes.map(toDisplayNote)

  return (
    <Fragment>
      <CssBaseline />
      <NoteList notes={displayNotes} dispatch={dispatch} />
      <BottomAppBar />
    </Fragment>
  )
}

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}

console.log('foo')
