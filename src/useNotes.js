import { usePouchDBCollection } from './usePouchDBCollection'
import { useMemo } from 'react'
import faker from 'faker'

export function useNotes() {
  const [notes, actions] = usePouchDBCollection('notes')

  const notesActions = useMemo(
    () => ({
      onAddClicked() {
        actions.addNew({ content: faker.lorem.lines() })
      },
      onEditClicked(note) {
        actions.patch({ content: faker.lorem.lines() }, note)
      },
      onDeleteClicked(note) {
        actions.delete(note)
      },
    }),
    [],
  )

  return [notes, notesActions]
}
