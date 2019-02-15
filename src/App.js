import React, { Fragment, useEffect, useReducer } from 'react'
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
  const [notes, dispatch] = useReducer(
    notesReducer,
    getCached('notes'),
    initNotes,
  )

  useEffect(() => {
    setCache('notes', notes)
  }, [notes])

  return (
    <Fragment>
      <CssBaseline />
      <NoteList notes={notes} dispatch={dispatch} />
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
