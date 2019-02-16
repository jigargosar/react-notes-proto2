import { withStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import React, { Fragment, useEffect } from 'react'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import cyan from '@material-ui/core/colors/cyan'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import { getDisplayNotes } from './Store'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'

function styles(theme) {
  const spc2 = theme.spacing.unit * 2
  return {
    paper: {
      paddingBottom: spc2,
      maxWidth: theme.contentMaxWidth,
      margin: '0 auto 50px',
    },
    text: {
      paddingTop: spc2,
      paddingLeft: spc2,
      paddingRight: spc2,
    },
    list: {
      marginBottom: spc2,
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

function getAvatarClassName(classes) {
  return idx => {
    const avatarClasses = [
      classes.avatar1,
      classes.avatar2,
      classes.avatar3,
      classes.avatar4,
      classes.avatar5,
    ]
    return avatarClasses[idx % avatarClasses.length]
  }
}

function noteIdToItemDomId(lastAddedId) {
  return `nli--${lastAddedId}`
}

export const NoteList = withStyles(styles)(function NoteList({
  notes,
  actions,
  classes,
}) {
  const lastAddedId = notes.lastAddedId
  useEffect(() => {
    if (lastAddedId) {
      const el = document.getElementById(noteIdToItemDomId(lastAddedId))

      if (el) {
        el.focus()
      } else {
        console.debug('unable to focus last added note')
      }
    }
  }, lastAddedId)
  return (
    <Paper square className={classes.paper}>
      <Typography className={classes.text} variant="h5" gutterBottom>
        Notes
      </Typography>
      <List className={classes.list}>
        {getDisplayNotes(notes).map(
          ({ id, primary, secondary, person }, idx) => {
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
                <ListItem id={noteIdToItemDomId(id)} button>
                  <Avatar
                    className={getAvatarClassName(classes)(idx)}
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
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => actions.notes.delete(id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Fragment>
            )
          },
        )}
      </List>
    </Paper>
  )
})
