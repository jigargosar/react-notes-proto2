import { useEffect, useMemo, useRef, useState } from 'react'
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

function createActions(dbRef, setState) {
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
    const overById = overProp('byId')
    const removeLastAddedId = R.dissoc('lastAddedId')
    const setLastAddedId = R.assoc('lastAddedId')

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

      initFromAllDocsResult: allDocsRes => {
        const notes = allDocsRes.rows.map(R.prop('doc'))
        const newById = pouchDocsToIdLookup(notes)
        return setState(pipe([overById(C(newById)), removeLastAddedId]))
      },

      handlePouchChange: change => {
        if (change.deleted) {
          return setState(
            pipe([overById(R.omit([change.id])), removeLastAddedId]),
          )
        } else {
          const note = change.doc
          const mergeNewNote = overById(
            R.mergeLeft(R.objOf(note._id)(note)),
          )
          const addNote = compose([setLastAddedId(note._id), mergeNewNote])
          setState(addNote)
        }
      },
    }
  }, [])
}

export function usePouchDBCollection(name) {
  const stateCacheKey = `pdb-collection-state-${name}`
  const localDbName = `collection-ns-${name}`

  const [state, setState] = useState(
    () => getCached(stateCacheKey) || generateDefaultState(),
  )

  useCacheEffect(stateCacheKey, state)

  const dbRef = useRef()

  const actions = createActions(dbRef, setState)

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
