import { withStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import React, { useEffect } from 'react'
import ListItem from '@material-ui/core/ListItem'
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
      margin: '0 auto 48px',
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

function noteIdToItemDomId(lastAddedId) {
  return `nli--${lastAddedId}`
}

function NoteItem({ note, actions }) {
  return (
    <ListItem id={noteIdToItemDomId(note.id)} button>
      <ListItemText
        primary={
          <Typography variant="subtitle1" noWrap>
            {note.primary}
          </Typography>
        }
        secondary={
          <Typography variant={'body1'} color="textSecondary" noWrap>
            {note.secondary}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          aria-label="Delete"
          onClick={() => actions.notes.delete(note.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
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
        {getDisplayNotes(notes).map(note => {
          return <NoteItem key={note.id} actions={actions} note={note} />
        })}
      </List>
    </Paper>
  )
})
