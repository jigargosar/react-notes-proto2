import React, { Fragment, useEffect, useReducer, useState } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { initNotes, notesReducer, toDisplayNote } from './Store'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { Console, Hook } from 'console-feed'
import * as R from 'ramda'
import faker from 'faker'
import nanoid from 'nanoid'

function createFakeItem() {
  return {
    id: nanoid(),
    fName: faker.name.firstName(),
    lName: faker.name.lastName(),
  }
}

function createFakeItemArray() {
  return R.times(createFakeItem, 10)
}

const App = function() {
  const [notes, dispatch] = useReducer(
    notesReducer,
    getCached('notes'),
    initNotes,
  )

  useCacheEffect('notes', notes)

  const displayNotes = notes.map(toDisplayNote)

  const [logs, setLogs] = useState(() => getCached('logs') || [])
  useCacheEffect('logs', logs)

  useEffect(() => {
    let disposed = false
    Hook(window.console, newLogs => {
      if (disposed) return
      setLogs(
        R.compose(
          R.takeLast(3),
          R.concat(R.__, newLogs),
        ),
      )
    })
    return () => void (disposed = true)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      console.table(createFakeItemArray())
    }, 1000)
  }, [])

  return (
    <Fragment>
      <CssBaseline />
      <div id="console-container" style={{ backgroundColor: '#242424' }}>
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
