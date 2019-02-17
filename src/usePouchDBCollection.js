import faker from 'faker'
import { useEffect, useMemo, useReducer, useRef } from 'react'
import * as R from 'ramda'
import { C, compose, objFromList, overProp, pipe } from './ramda-helpers'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import PouchDB from 'pouchdb-browser'
import nanoid from 'nanoid'
import validate from 'aproba'

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

function useActions(dbRef, dispatch) {
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

function stripNSPrefix(ns, str) {
  validate('SS', arguments)
  return R.replace(new RegExp(`^${ns}.`))('')(str)
}

function createReducer(ns) {
  validate('S', arguments)
  return useMemo(
    () =>
      function reducer(state, action) {
        const overById = overProp('byId')
        const payload = action.payload
        const atWithoutNS = stripNSPrefix(ns, action.type)
        switch (atWithoutNS) {
          case 'add': {
            const note = payload
            const mergeNewNote = overById(
              R.mergeLeft(R.objOf(note._id)(note)),
            )
            const addNote = compose([
              R.assoc('lastAddedId', note._id),
              mergeNewNote,
            ])
            return addNote(state)
          }
          case 'delete':
            const omit = R.omit
            return pipe([
              overById(omit([payload])),
              R.dissoc('lastAddedId'),
            ])(state)
          case 'initFromAllDocsResult': {
            const notes = payload.rows.map(R.prop('doc'))
            const newById = pouchDocsToIdLookup(notes)
            return pipe([overById(C(newById)), R.dissoc('lastAddedId')])(
              state,
            )
          }
          default:
            console.error('Invalid Action', action)
            throw new Error(`Invalid Action Type ${atWithoutNS}`)
        }
      },
    [],
  )
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

  const actions = useActions(dbRef, dispatch)

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
