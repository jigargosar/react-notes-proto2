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
import Slide from '@material-ui/core/Slide'

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
      <Slide
        direction="down"
        in={!con.hidden && con.logs.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <div
          id="console-container"
          style={{ maxHeight: '100vh' }}
          className="fixed max-vh-100 z-9999 overflow-container"
        >
          {<Console logs={con.logs} variant="dark" />}
        </div>
      </Slide>
      {/*<div*/}
      {/*  id="console-container"*/}
      {/*  style={{ maxHeight: '100vh' }}*/}
      {/*  className="fixed max-vh-100 z-9999 overflow-container"*/}
      {/*>*/}
      {/*  {con.hidden || <Console logs={con.logs} variant="dark" />}*/}
      {/*</div>*/}
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
