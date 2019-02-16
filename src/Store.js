import * as R from 'ramda'
import nanoid from 'nanoid'
import faker from 'faker'
import { useEffect, useMemo, useReducer, useRef } from 'react'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { Hook } from 'console-feed'
import useMousetrap from 'react-hook-mousetrap'
import { C, compose, overProp, pipe } from './ramda-helpers'
import PouchDB from 'pouchdb-browser'

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

export function getInitialNotes() {
  const notes = R.times(newNote, 10)
  return {
    byId: notesListToById(notes),
  }
}

export function initNotes(maybeNotes) {
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
    case 'notes.replaceAll': {
      // noinspection UnnecessaryLocalVariableJS
      const notes = payload
      const newById = notesListToById(notes)
      return pipe([overById(C(newById)), R.dissoc('lastAddedId')])(state)
    }
    default:
      console.error('Invalid Action', action)
      throw new Error('Invalid Action')
  }
}

async function fetchAllDocs(db) {
  const res = await db.allDocs({ include_docs: true })
  return res.rows.map(R.prop('doc'))
}

const enhancedNotesReducer = compose([
  R.tap(notes => {
    const tabularData = pipe([
      R.prop('byId'),
      R.map(R.pick(['_rev', 'content'])),
    ])(notes)

    console.table(tabularData)
  }),
  notesReducer,
])

function useNotes() {
  const [notes, dispatch] = useReducer(
    enhancedNotesReducer,
    getCached('notes'),
    initNotes,
  )
  useCacheEffect('notes', notes)

  const dbRef = useRef()

  useEffect(() => {
    const db = new PouchDB('notes')
    dbRef.current = db
    return () => {
      db.close()
    }
  }, [])

  const actions = useMemo(() => {
    return {
      addNew: async () => {
        const db = dbRef.current
        const note = newNote()
        await db.put(note)
      },
      delete: async id => {
        const db = dbRef.current
        const persistedNote = await db.get(id)

        await db.put({ ...persistedNote, _deleted: true })
      },
      edit: async id => {
        const db = dbRef.current
        const persistedNote = await db.get(id)

        await db.put({ ...persistedNote, content: newNoteContent() })
      },
      replaceAll: docs =>
        dispatch({ type: 'notes.replaceAll', payload: docs }),
      handlePouchChange: change => {
        if (change.deleted) {
          dispatch({ type: 'notes.delete', payload: change.id })
        } else {
          dispatch({ type: 'notes.add', payload: change.doc })
        }
      },
    }
  }, [])

  useEffect(() => {
    const db = dbRef.current
    if (!db) return

    fetchAllDocs(db)
      .then(actions.replaceAll)
      .catch(console.error)

    const changes = db
      .changes({ live: true, include_docs: true, since: 'now' })
      .on('change', actions.handlePouchChange)
      .on('error', console.error)
    return () => changes.cancel()
  }, [dbRef.current])

  return [notes, actions]
}

function consoleReducer(state, action) {
  const { payload } = action
  switch (action.type) {
    case 'con.addLogs':
      const appendNewLogsAndLimit = compose([
        R.takeLast(10),
        R.concat(R.__, payload),
      ])
      return overProp('logs')(appendNewLogsAndLimit)(state)
    case 'con.toggle':
      return overProp('hidden')(R.not)(state)
    default:
      throw new Error('[consoleReducer] Invalid Action')
  }
}

function initConsole({ hidden } = {}) {
  return { logs: [], hidden: hidden || false }
}

function useConsole() {
  const [con, dispatch] = useReducer(
    consoleReducer,
    getCached('console'),
    initConsole,
  )

  useCacheEffect('console', con)

  useEffect(() => {
    let disposed = false
    Hook(window.console, newLogs => {
      if (disposed) return
      dispatch({ type: 'con.addLogs', payload: newLogs })
    })
    return () => void (disposed = true)
  }, [])

  const actions = useMemo(() => {
    return {
      toggle: () => dispatch({ type: 'con.toggle' }),
    }
  }, [])

  return [con, actions]
}

export function useStore() {
  const [notes, notesA] = useNotes()

  const [con, conA] = useConsole()

  useMousetrap('`', conA.toggle)

  const actions = useMemo(
    () => ({
      con: conA,
      notes: notesA,
    }),
    [],
  )

  return [con, notes, actions]
}
