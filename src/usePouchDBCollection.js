import { useEffect, useMemo, useReducer, useRef } from 'react'
import * as R from 'ramda'
import { C, compose, objFromList, overProp, pipe } from './ramda-helpers'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import PouchDB from 'pouchdb-browser'
import nanoid from 'nanoid'
import validate from 'aproba'

function newDoc(attributes) {
  validate('O', arguments)

  return R.mergeLeft(
    {
      _id: `m_${nanoid()}`,
      _rev: null,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    },
    attributes,
  )
}

function pouchDocsToIdLookup(docs) {
  validate('A', arguments)
  return objFromList(R.prop('_id'))(docs)
}

function generateDefaultState() {
  const docs = R.times(() => newDoc({}), 10)
  return {
    byId: pouchDocsToIdLookup(docs),
  }
}

function initState(maybeState) {
  return maybeState || generateDefaultState()
}

function applyActionMap(actionMap, state, action) {
  validate('OOO', arguments)
  const actionType = action.type

  function defaultAction() {
    console.error('Invalid Action', action)
    throw new Error(`Invalid Action Type ${actionType}`)
  }

  return pipe([
    R.propOr(defaultAction, actionType),
    R.call,
    R.when(R.is(Function))(R.applyTo(state)),
  ])(actionMap)
}

function reducer(state, action) {
  validate('OO', arguments)
  const overById = overProp('byId')
  const removeLastAddedId = R.dissoc('lastAddedId')
  const setLastAddedId = R.assoc('lastAddedId')

  const payload = action.payload
  const actionMap = {
    add() {
      const note = payload
      const mergeNewNote = overById(R.mergeLeft(R.objOf(note._id)(note)))
      const addNote = compose([setLastAddedId(note._id), mergeNewNote])
      return addNote(state)
    },
    delete() {
      const omit = R.omit
      return pipe([overById(omit([payload])), removeLastAddedId])(state)
    },
    initFromAllDocsResult() {
      const notes = payload.rows.map(R.prop('doc'))
      const newById = pouchDocsToIdLookup(notes)
      return pipe([overById(C(newById)), removeLastAddedId])(state)
    },
  }

  return applyActionMap(actionMap, state, action)
}

function createActions(dbRef, dispatch) {
  validate('OF', arguments)

  return useMemo(() => {
    const dbPut = doc => dbRef.current.put(doc)
    const dbGet = id => dbRef.current.get(id)
    const dbPatch = async patch => {
      const doc = await dbGet(patch._id)
      return dbPut(R.mergeLeft(patch)(doc))
    }

    async function patchDoc(patch, note) {
      const { _id, _rev } = note
      await dbPatch({ _id, _rev, ...patch })
    }

    return {
      async addNew(attributes) {
        validate('O', arguments)
        await dbPut(newDoc(attributes))
      },
      delete: async function(doc) {
        validate('O', arguments)
        await patchDoc({ _deleted: true }, doc)
      },
      patch: async function(patch, doc) {
        validate('OO', arguments)
        await patchDoc(patch, doc)
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

export function usePouchDBCollection(name) {
  const stateCacheKey = `pdb-collection-state-${name}`
  const localDbName = `collection-ns-${name}`

  const [state, dispatch] = useReducer(
    reducer,
    getCached(stateCacheKey),
    initState,
  )

  useCacheEffect(stateCacheKey, state)

  const dbRef = useRef()

  const actions = createActions(dbRef, dispatch)

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
