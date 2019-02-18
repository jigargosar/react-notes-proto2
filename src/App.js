import React from 'react'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NoteList } from './NoteList'
import {
  ActionsContext,
  ConsoleContext,
  NotesContext,
  useStore,
} from './Store'

import BottomAppBar from './BottomAppBar'
import TopConsole from './TopConsole'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

function App() {
  const [con, notes, actions] = useStore()

  return (
    <ErrorBoundary>
      <CssBaseline />
      <ConsoleContext.Provider value={con}>
        <NotesContext.Provider value={notes}>
          <ActionsContext.Provider value={actions}>
            <TopConsole />
            <NoteList />
            <BottomAppBar />
          </ActionsContext.Provider>
        </NotesContext.Provider>
      </ConsoleContext.Provider>
    </ErrorBoundary>
  )
}

export default withStyles({})(App)

if (module.hot) {
  module.hot.dispose(() => {
    console.clear()
  })
}
