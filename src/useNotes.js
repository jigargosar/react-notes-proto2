import { usePouchDBCollection } from './usePouchDBCollection'
import { useMemo } from 'react'
import faker from 'faker'

export function useNotes() {
  const [notes, actions] = usePouchDBCollection('notes')

  const notesActions = useMemo(() => ({
    ...actions,
    createAndAddNew() {
      actions.addNew({ content: faker.lorem.lines() })
    },
  }))

  return [notes, notesActions]
}
