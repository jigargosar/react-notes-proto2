import * as R from 'ramda'
import nanoid from 'nanoid'
import faker from 'faker'
import { useEffect, useMemo, useReducer, useRef } from 'react'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { Hook } from 'console-feed'
import useMousetrap from 'react-hook-mousetrap'
import { compose, overProp, pipe } from './ramda-helpers'
import PouchDB from 'pouchdb-browser'

function newNote() {
  return {
    _id: nanoid(),
    _rev: null,
    content: faker.lorem.lines(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }
}

export function getInitialNotes() {
  const notes = R.times(newNote, 10)
  return {
    byId: notes.reduce((acc, n) => {
      acc[n._id] = n
      return acc
    }, {}),
  }
}

export function initNotes(maybeNotes) {
  return maybeNotes || getInitialNotes()
}

export function notesReducer(state, action) {
  const overById = overProp('byId')
  const payload = action.payload
  switch (action.type) {
    case 'notes.addNew':
      const note = newNote()
      const mergeNewNote = overById(R.mergeLeft(R.objOf(note._id)(note)))
      return compose([R.assoc('lastAddedId', note._id), mergeNewNote])(
        state,
      )
    case 'notes.delete':
      return pipe([overById(R.omit([payload]))])(state)
    case 'notes.reset':
      return initNotes(payload)
    default:
      console.error('Invalid Action', action)
      throw new Error('Invalid Action')
  }
}

function useNotes() {
  const [notes, dispatch] = useReducer(
    notesReducer,
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
      addNew: () => dispatch({ type: 'notes.addNew' }),
      delete: id => dispatch({ type: 'notes.delete', payload: id }),
    }
  }, [])
  return [notes, actions]
}

function consoleReducer(state, action) {
  const { payload } = action
  switch (action.type) {
    case 'con.addLogs':
      const appendNewLogsAndLimit = compose([
        // R.takeLast(3),
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
