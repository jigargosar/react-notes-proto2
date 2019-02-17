import { createContext, useContext, useMemo } from 'react'
import useMousetrap from 'react-hook-mousetrap'
import { useConsole } from './useConsoleCapture'
import { useNotes } from './useNotes'

export function useStore() {
  const [notes, notesA] = useNotes()

  const [con, conA] = useConsole()

  const actions = useMemo(
    () => ({
      con: conA,
      notes: notesA,
    }),
    [],
  )

  useMousetrap('`', conA.toggle)

  return [con, notes, actions]
}

export const ActionsContext = createContext(null)
export const NotesContext = createContext(null)
export const ConsoleContext = createContext(null)

export const useActions = () => useContext(ActionsContext)
