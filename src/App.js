/* disableInspection ES6UnusedImports */
import React, { Component } from 'react'

import {
  Add as AddIcon,
  MenuSharp as MenuIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
} from '@material-ui/icons'
import {
  AppBar,
  Fab,
  IconButton,
  Toolbar,
  withStyles,
} from '@material-ui/core'

function styles() {
  return {
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    toolbar: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
  }
}

class App extends Component {
  render() {
    const { classes } = this.props
    return (
      <>
        <AppBar
          position="fixed"
          color="primary"
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Fab
              color="secondary"
              aria-label="Add"
              className={classes.fabButton}
            >
              <AddIcon />
            </Fab>
            <div>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </>
    )
  }
}

export default withStyles(styles)(App)
