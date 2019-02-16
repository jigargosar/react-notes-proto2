import * as R from 'ramda'
import nanoid from 'nanoid'
import faker from 'faker'
import { useReducer } from 'react'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'

function newNote() {
  return {
    _id: nanoid(),
    _rev: null,
    content: faker.lorem.lines(),
  }
}

export function toDisplayNote(note) {
  const [primary, ...rest] = note.content.trim().split('\n')

  return {
    id: note._id,
    primary,
    secondary: rest.join('\n'),
    person: R.compose(
      R.toUpper,
      R.take(2),
    )(primary),
  }
}

export function getInitialNotes() {
  return R.times(newNote, 10)
}

export function initNotes(maybeNotes) {
  return maybeNotes || getInitialNotes()
}

export function notesReducer(state, action) {
  switch (action.type) {
    case 'note.add':
      return state
    case 'note.delete':
      return state
    case 'note.reset':
      return initNotes(action.payload)
    default:
      throw new Error('Invalid Action')
  }
}

export function useStore() {
  const [notes] = useReducer(notesReducer, getCached('notes'), initNotes)

  useCacheEffect('notes', notes)

  return notes.map(toDisplayNote)
}
