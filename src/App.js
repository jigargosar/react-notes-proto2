import React, { Fragment, useReducer } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { getInitialNotes, toDisplayNote } from './Store'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'

function initNotes(maybeNotes) {
  return maybeNotes || getInitialNotes()
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

App.displayName = 'App'

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}
