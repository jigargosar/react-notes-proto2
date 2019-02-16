import * as R from 'ramda'
import nanoid from 'nanoid'
import faker from 'faker'
import { useEffect, useMemo, useReducer } from 'react'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { Hook } from 'console-feed'
import validate from 'aproba'
import useMousetrap from 'react-hook-mousetrap'

function newNote() {
  return {
    _id: nanoid(),
    _rev: null,
    content: faker.lorem.lines(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }
}

export function toDisplayNote(note) {
  validate('O', arguments)

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

export const getDisplayNotes = pipe([
  R.prop('byId'),
  R.values,
  R.sortWith([R.descend(R.propOr(0, 'modifiedAt'))]),
  R.map(toDisplayNote),
])

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
  switch (action.type) {
    case 'notes.addNew':
      const note = newNote()
      const mergeNewNote = overProp('byId')(
        R.mergeLeft(R.objOf(note._id)(note)),
      )
      return compose([R.assoc('lastAddedId', note._id), mergeNewNote])(
        state,
      )
    case 'notes.delete':
      return state
    case 'notes.reset':
      return initNotes(action.payload)
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

  const actions = useMemo(() => {
    return {
      addNew: () => dispatch({ type: 'notes.addNew' }),
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

//*** HELPERS ***

function overProp(propName) {
  validate('S', arguments)
  return R.over(R.lensProp(propName))
}

function assert(bool, msg) {
  validate('BS', arguments)
  if (!bool) {
    throw new Error(msg)
  }
}

function compose(fns) {
  validate('A', arguments)
  fns.forEach((fn, i) => {
    const argType = typeof fn
    assert(
      argType === 'function',
      `[compose] expected typeof fns[${i}] to be function but found ${argType} , ${fn}`,
    )
  })
  return R.compose(...fns)
}

function pipe(fns) {
  validate('A', arguments)
  return compose(R.reverse(fns))
}
