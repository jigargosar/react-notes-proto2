import React, { Component, Fragment } from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import MoreIcon from '@material-ui/icons/MoreVert'
// import {
//   AppBar,
//   Fab,
//   IconButton,
//   Toolbar,
//   withStyles,
// } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Fab from '@material-ui/core/Fab'
import CssBaseline from '@material-ui/core/CssBaseline'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
// import {
//   Add as AddIcon,
//   MenuSharp as MenuIcon,
//   MoreVert as MoreIcon,
//   Search as SearchIcon,
// } from '@material-ui/icons'
import nanoid from 'nanoid'
import faker from 'faker'
import * as R from 'ramda'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import amber from '@material-ui/core/colors/amber'
import cyan from '@material-ui/core/colors/cyan'
import green from '@material-ui/core/colors/green'

function styles(theme) {
  return {
    text: {
      paddingTop: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing.unit * 2,
    },
    subHeader: {
      backgroundColor: theme.palette.background.paper,
    },
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
    avatar1: {
      color: '#fff',
      backgroundColor: deepOrange[500],
    },
    avatar2: {
      color: '#fff',
      backgroundColor: deepPurple[500],
    },
    avatar3: {
      color: '#fff',
      backgroundColor: cyan[500],
    },
    avatar4: {
      color: '#000',
      backgroundColor: amber[500],
    },
    avatar5: {
      color: '#fff',
      backgroundColor: green[500],
    },
  }
}

function newNote() {
  return {
    _id: nanoid(),
    _rev: null,
    content: faker.lorem.lines(),
  }
}

function newDisplayNote() {
  const note = newNote()
  let firstName = faker.name.firstName()

  const lastName = faker.name.lastName()

  const person = R.compose(
    R.join(''),
    R.map(R.head),
  )([firstName, lastName])

  return {
    id: note._id,
    primary: `${firstName} ${lastName}`,
    secondary: note.content,
    person,
  }
}

function getNotes() {
  return R.times(newDisplayNote, 10)
}

class App extends Component {
  render() {
    const { classes } = this.props
    return (
      <>
        <CssBaseline />
        <Paper square className={classes.paper}>
          <Typography className={classes.text} variant="h5" gutterBottom>
            Notes
          </Typography>
          <List className={classes.list}>
            {getNotes().map(({ id, primary, secondary, person }, idx) => {
              idx += 1
              return (
                <Fragment key={id}>
                  {idx === 1 && (
                    <ListSubheader className={classes.subHeader}>
                      Today
                    </ListSubheader>
                  )}
                  {idx === 3 && (
                    <ListSubheader className={classes.subHeader}>
                      Yesterday
                    </ListSubheader>
                  )}
                  <ListItem button>
                    <Avatar
                      className={classes[`avatar${(idx % 5) + 1}`]}
                      alt="Profile Picture"
                    >
                      {person}
                    </Avatar>
                    <ListItemText
                      primary={primary}
                      secondary={secondary}
                    />
                  </ListItem>
                </Fragment>
              )
            })}
          </List>
        </Paper>

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
