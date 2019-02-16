import { useMemo } from 'react'
import useMousetrap from 'react-hook-mousetrap'
import { useNotes } from './useNotes'
import { useConsole } from './useConsoleCapture'

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
