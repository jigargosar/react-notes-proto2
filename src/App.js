import React, { Fragment, useEffect, useReducer, useState } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { initNotes, notesReducer, toDisplayNote } from './Store'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { Console, Decode, Hook } from 'console-feed'

const App = function() {
  const [notes, dispatch] = useReducer(
    notesReducer,
    getCached('notes'),
    initNotes,
  )

  useCacheEffect('notes', notes)

  const displayNotes = notes.map(toDisplayNote)

  const [logs, setLogs] = useState([])

  setTimeout(() => {
    throw new Error('foo')
  }, 1000)

  useEffect(() => {
    let disposed = false
    Hook(window.console, log => {
      if (disposed) return
      setLogs(logs => [...logs, Decode(log)])
    })
    return () => {
      disposed = true
    }
  }, [])

  return (
    <Fragment>
      <CssBaseline />
      <div style={{ backgroundColor: '#242424' }}>
        <Console logs={logs} variant="dark" />
      </div>
      <NoteList notes={displayNotes} dispatch={dispatch} />
      <BottomAppBar />
    </Fragment>
  )
}

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.log('HMR: enter dispose App')
    console.clear()
    console.log('HMR: exit dispose App')
  })
}
