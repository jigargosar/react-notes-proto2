import { useMemo } from 'react'
import useMousetrap from 'react-hook-mousetrap'
import { useConsole } from './useConsoleCapture'
import { usePouchDBCollection } from './usePouchDBCollection'

export function useStore() {
  const [notes, notesA] = usePouchDBCollection('notes')

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
