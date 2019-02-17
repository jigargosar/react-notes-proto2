import { usePouchDBCollection } from './usePouchDBCollection'
import { useMemo } from 'react'
import faker from 'faker'

export function useNotes() {
  const [notes, actions] = usePouchDBCollection('notes')

  const notesActions = useMemo(() => ({
    createAndAddNew() {
      actions.addNew({ content: faker.lorem.lines() })
    },
    edit(note) {
      actions.patch({ content: faker.lorem.lines() }, note)
    },
    delete(note) {
      actions.delete(note)
    },
  }))

  return [notes, notesActions]
}
