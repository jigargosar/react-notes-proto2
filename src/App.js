import React, { Fragment, useEffect, useReducer, useState } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { getNotes } from './Store'
import { getCached, setCache } from './dom-helpers'

function initNotes(maybeState) {
  return maybeState || getNotes()
}

function notesReducer(state, action) {
  switch (action.type) {
    case 'addNew':
      return state
    case 'delete':
      return state
    case 'reset':
      return initNotes(action.payload)
    default:
      throw new Error('Invalid Action')
  }
}

const App = function() {
  const [notes] = useState(() => getCached('notes') || getNotes())

  useEffect(() => {
    setCache('notes', notes)
  }, [notes])

  useReducer(notesReducer, getCached('notes'), initNotes)

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
