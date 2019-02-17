import faker from 'faker'
import { useEffect, useMemo, useReducer, useRef } from 'react'
import * as R from 'ramda'
import {
  C,
  compose,
  mapKeys,
  objFromList,
  overProp,
  pipe,
} from './ramda-helpers'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import PouchDB from 'pouchdb-browser'
import nanoid from 'nanoid'
import validate from 'aproba'
import assert from 'assert'

function newEmptyDoc() {
  return {
    _id: `m_${nanoid()}`,
    _rev: null,
    content: faker.lorem.lines(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }
}

function pouchDocsToIdLookup(docs) {
  validate('A', arguments)
  return objFromList(R.prop('_id'))(docs)
}

function generateDefaultState() {
  const docs = R.times(newEmptyDoc, 10)
  return {
    byId: pouchDocsToIdLookup(docs),
  }
}

function initState(maybeState) {
  return maybeState || generateDefaultState()
}

function createActions(dbRef, _dispatch, ns) {
  validate('OFS', arguments)

  return useMemo(() => {
    function dispatch(action) {
      validate('O', arguments)
      const prependNS = overProp('type')(R.concat(`${ns}.`))
      return _dispatch(prependNS(action))
    }

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
        await dbPut(newEmptyDoc())
      },
      delete: async note => {
        await patchNote({ _deleted: true }, note)
      },
      edit: async note => {
        await patchNote({ content: faker.lorem.lines() }, note)
      },

      initFromAllDocsResult: allDocsRes =>
        dispatch({
          type: 'initFromAllDocsResult',
          payload: allDocsRes,
        }),

      handlePouchChange: change => {
        if (change.deleted) {
          dispatch({ type: 'delete', payload: change.id })
        } else {
          dispatch({ type: 'add', payload: change.doc })
        }
      },
    }
  }, [])
}

function applyActionMap(ns, actionMap, state, action) {
  validate('SOOO', arguments)
  const actionType = action.type

  function defaultAction() {
    console.error('Invalid Action', action)
    throw new Error(`Invalid Action Type ${actionType}`)
  }

  return pipe([
    mapKeys(R.concat(`${ns}.`)),
    R.propOr(defaultAction, actionType),
    R.call,
    R.when(R.is(Function))(R.applyTo(state)),
  ])(actionMap)
}

function createReducer(ns) {
  validate('S', arguments)
  return useMemo(() => {
    const overById = overProp('byId')
    const removeLastAddedId = R.dissoc('lastAddedId')
    const setLastAddedId = R.assoc('lastAddedId')
    return function reducer(state, action) {
      validate('OO', arguments)
      assert(action.type.startsWith(`${ns}..`))

      const payload = action.payload
      const actionMap = {
        add() {
          const note = payload
          const mergeNewNote = overById(
            R.mergeLeft(R.objOf(note._id)(note)),
          )
          const addNote = compose([setLastAddedId(note._id), mergeNewNote])
          return addNote(state)
        },
        delete() {
          const omit = R.omit
          return pipe([overById(omit([payload])), removeLastAddedId])(
            state,
          )
        },
        initFromAllDocsResult() {
          const notes = payload.rows.map(R.prop('doc'))
          const newById = pouchDocsToIdLookup(notes)
          return pipe([overById(C(newById)), removeLastAddedId])(state)
        },
      }

      return applyActionMap(ns, actionMap, state, action)
    }
  }, [])
}

export function usePouchDBCollection(ns) {
  const stateCacheKey = `pdb-collection-state-${ns}`
  const localDbName = `collection-ns-${ns}`

  const [state, dispatch] = useReducer(
    createReducer(ns),
    getCached(stateCacheKey),
    initState,
  )

  useCacheEffect(stateCacheKey, state)

  const dbRef = useRef()

  const actions = createActions(dbRef, dispatch, ns)

  useEffect(() => {
    const db = new PouchDB(localDbName)
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

  return [state, actions]
}
