import React, { Fragment, useEffect } from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NoteList } from './NoteList'
import { useStore } from './Store'
import * as R from 'ramda'
import faker from 'faker'
import nanoid from 'nanoid'
import BottomAppBar from './BottomAppBar'
import TopConsole from './TopConsole'

function createFakeItem() {
  return {
    id: nanoid(),
    fName: faker.name.firstName(),
    lName: faker.name.lastName(),
  }
}

function createFakeItemArray() {
  return R.times(createFakeItem, 3)
}

function App() {
  const [con, displayNotes, actions] = useStore()

  useEffect(() => {
    setTimeout(() => {
      console.table(createFakeItemArray())
    }, 1000)
  }, [])

  return (
    <Fragment>
      <CssBaseline />
      <TopConsole con={con} />
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
