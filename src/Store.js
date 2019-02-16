import * as R from 'ramda'
import nanoid from 'nanoid'
import faker from 'faker'
import { useEffect, useMemo, useReducer } from 'react'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { Hook } from 'console-feed'
import validate from 'aproba'

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
      throw new Error('[notesReducer] Invalid Action')
  }
}

function consoleReducer(state, action) {
  const { payload } = action
  switch (action.type) {
    case 'con.addLogs':
      const appendNewLogsAndLimit = compose([
        R.takeLast(3),
        R.concat(R.__, payload),
      ])
      return overProp('logs')(appendNewLogsAndLimit)(state)
    case 'con.toggle':
      return overProp('hidden')(R.not)(state)
    default:
      throw new Error('[consoleReducer] Invalid Action')
  }
}

function initConsole({ logs, hidden } = {}) {
  return { logs: [], hidden: hidden || false }
}

export function useStore() {
  const [notes] = useReducer(notesReducer, getCached('notes'), initNotes)

  const [con, conDispatch] = useReducer(
    consoleReducer,
    getCached('console'),
    initConsole,
  )

  useCacheEffect('notes', notes)
  useCacheEffect('console', con)

  useEffect(() => {
    let disposed = false
    Hook(window.console, newLogs => {
      if (disposed) return
      conDispatch({ type: 'con.addLogs', payload: newLogs })
    })
    return () => void (disposed = true)
  }, [])

  const actions = useMemo(() => {
    const conActions = {
      toggle: () => conDispatch({ type: 'con.toggle' }),
    }

    return { con: conActions }
  }, [])

  return [con, notes.map(toDisplayNote), actions]
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
