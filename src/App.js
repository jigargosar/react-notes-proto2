/* disableInspection ES6UnusedImports */
import React, { Component } from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import MoreIcon from '@material-ui/icons/MoreVert'
import {
  AppBar,
  Fab,
  IconButton,
  Toolbar,
  withStyles,
} from '@material-ui/core'

// import {withStyles} from '@material-ui/core/styles'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import IconButton from '@material-ui/core/IconButton'
// import Fab from '@material-ui/core/Fab'

// import {
//   Add as AddIcon,
//   MenuSharp as MenuIcon,
//   MoreVert as MoreIcon,
//   Search as SearchIcon,
// } from '@material-ui/icons'

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
