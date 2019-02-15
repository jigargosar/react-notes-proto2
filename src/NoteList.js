import { withStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import { getNotes } from './Store'
import React, { Fragment } from 'react'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import cyan from '@material-ui/core/colors/cyan'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'

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

export const NoteList = withStyles(styles)(function NoteList({ classes }) {
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
  )
})
