import React, { Fragment, useEffect } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BottomAppBar } from './BottomAppBar'
import { NoteList } from './NoteList'
import { useStore } from './Store'
import { Console } from 'console-feed'
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
  const [con, displayNotes, actions] = useStore()

  useEffect(() => {
    setTimeout(() => {
      console.table(createFakeItemArray())
    }, 1000)
  }, [])

  return (
    <Fragment>
      <CssBaseline />
      <div id="console-container" style={{ backgroundColor: '#242424' }}>
        {con.hidden || <Console logs={con.logs} variant="dark" />}
      </div>
      <NoteList notes={displayNotes} />
      <BottomAppBar con={con} actions={actions} />
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
