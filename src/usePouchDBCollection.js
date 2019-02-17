import faker from 'faker'
import { useEffect, useMemo, useReducer, useRef } from 'react'
import * as R from 'ramda'
import { C, compose, overProp, pipe } from './ramda-helpers'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import PouchDB from 'pouchdb-browser'
import nanoid from 'nanoid'

function newNoteContent() {
  return faker.lorem.lines()
}

function newNote() {
  return {
    _id: `n_${nanoid()}`,
    _rev: null,
    content: newNoteContent(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }
}

function notesListToById(notes) {
  return notes.reduce((acc, n) => {
    acc[n._id] = n
    return acc
  }, {})
}

function getInitialNotes() {
  const notes = R.times(newNote, 10)
  return {
    byId: notesListToById(notes),
  }
}

function initNotes(maybeNotes) {
  return maybeNotes || getInitialNotes()
}

export function notesReducer(state, action) {
  const overById = overProp('byId')
  const payload = action.payload
  switch (action.type) {
    case 'notes.add': {
      const note = payload
      const mergeNewNote = overById(R.mergeLeft(R.objOf(note._id)(note)))
      const addNote = compose([
        R.assoc('lastAddedId', note._id),
        mergeNewNote,
      ])
      return addNote(state)
    }
    case 'notes.delete':
      const omit = R.omit
      return pipe([overById(omit([payload])), R.dissoc('lastAddedId')])(
        state,
      )
    case 'notes.initFromAllDocsResult': {
      const notes = payload.rows.map(R.prop('doc'))
      const newById = notesListToById(notes)
      return pipe([overById(C(newById)), R.dissoc('lastAddedId')])(state)
    }
    default:
      console.error('Invalid Action', action)
      throw new Error('Invalid Action')
  }
}

function useNotesActions(dbRef, dispatch) {
  return useMemo(() => {
    const dbPut = doc => dbRef.current.put(doc)
    const dbGet = id => dbRef.current.get(id)
    const dbPatch = async patch => {
      const doc = await dbGet(patch._id)
      return dbPut(R.mergeLeft(patch)(doc))
    }

    async function patchNote(patch, note) {
      const { _id, _rev } = note
      await dbPatch({ _id, _rev, ...patch })
    }

    return {
      addNew: async () => {
        await dbPut(newNote())
      },
      delete: async note => {
        await patchNote({ _deleted: true }, note)
      },
      edit: async note => {
        await patchNote({ content: newNoteContent() }, note)
      },

      initFromAllDocsResult: allDocsRes =>
        dispatch({
          type: 'notes.initFromAllDocsResult',
          payload: allDocsRes,
        }),

      handlePouchChange: change => {
        if (change.deleted) {
          dispatch({ type: 'notes.delete', payload: change.id })
        } else {
          dispatch({ type: 'notes.add', payload: change.doc })
        }
      },
    }
  }, [])
}

export function usePouchDBCollection() {
  const [notes, _dispatch] = useReducer(
    notesReducer,
    getCached('notes'),
    initNotes,
  )
  const dispatch = (...args) => {
    console.log(`args`, ...args)
    _dispatch(...args)
  }

  useCacheEffect('notes', notes)

  const dbRef = useRef()

  const actions = useNotesActions(dbRef, dispatch)

  useEffect(() => {
    const db = new PouchDB('notes')
    db.allDocs({ include_docs: true })
      .then(actions.initFromAllDocsResult)
      .catch(console.error)

    const changes = db
      .changes({ live: true, include_docs: true, since: 'now' })
      .on('change', actions.handlePouchChange)
      .on('error', console.error)

    dbRef.current = db
    return () => {
      changes.cancel()
      db.close()
    }
  }, [])

  return [notes, actions]
}
