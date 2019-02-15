import React, { Fragment } from 'react'
// import {
//   AppBar,
//   Fab,
//   IconButton,
//   Toolbar,
//   withStyles,
// } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
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
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import amber from '@material-ui/core/colors/amber'
import cyan from '@material-ui/core/colors/cyan'
import green from '@material-ui/core/colors/green'
import { getNotes } from './Store'
import { BottomAppBar } from './BottomAppBar'

function styles(theme) {
  return {
    text: {
      paddingTop: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    paper: {
      paddingBottom: 100,
      maxWidth: theme.contentMaxWidth,
      margin: 'auto',
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
      width: '100%',
      maxWidth: theme.toolbarMaxWidth,
      [theme.breakpoints.up('sm')]: {
        padding: 0,
      },
      margin: 'auto',
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

const App = withStyles(styles)(function(props) {
  const { classes } = props
  const avatarClasses = [
    classes.avatar1,
    classes.avatar2,
    classes.avatar3,
    classes.avatar4,
    classes.avatar5,
  ]

  function getAvatarClassName(idx) {
    return avatarClasses[idx % avatarClasses.length]
  }

  return (
    <Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Notes
        </Typography>
        <List className={classes.list}>
          {getNotes().map(({ id, primary, secondary, person }, idx) => {
            return (
              <Fragment key={id}>
                {idx === 0 && (
                  <ListSubheader className={classes.subHeader}>
                    Today
                  </ListSubheader>
                )}
                {idx === 2 && (
                  <ListSubheader className={classes.subHeader}>
                    Yesterday
                  </ListSubheader>
                )}
                <ListItem button>
                  <Avatar
                    className={getAvatarClassName(idx)}
                    alt="Profile Picture"
                  >
                    {person}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" noWrap>
                        {primary}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant={'body1'}
                        color="textSecondary"
                        noWrap
                      >
                        {secondary}
                      </Typography>
                    }
                  />
                </ListItem>
              </Fragment>
            )
          })}
        </List>
      </Paper>

      <BottomAppBar />
    </Fragment>
  )
})

App.displayName = 'App'

export default App
