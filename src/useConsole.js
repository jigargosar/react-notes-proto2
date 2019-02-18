import { compose, overProp, toggleProp } from './ramda-helpers'
import * as R from 'ramda'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Hook } from 'console-feed'

const StateContext = createContext(null)
const ActionsContext = createContext(null)
const ActionProvider = ActionsContext.Provider
const StateProvider = StateContext.Provider

export function useConsole() {
  const cacheKey = 'con-state'
  const [state, setState] = useState(() => {
    const { hidden } = getCached(cacheKey) || {}
    return { logs: [], hidden: hidden || false }
  })

  useCacheEffect(cacheKey, state)

  const actions = useMemo(() => {
    return {
      toggle: () => setState(toggleProp('hidden')),
      addLogs: newLogs => {
        const appendNewLogsAndLimit = compose([
          R.takeLast(10),
          R.concat(R.__, newLogs),
        ])
        return setState(overProp('logs')(appendNewLogsAndLimit))
      },
    }
  }, [])

  useEffect(() => {
    let disposed = false
    Hook(window.console, newLogs => {
      if (disposed) return
      actions.addLogs(newLogs)
    })
    return () => void (disposed = true)
  }, [])

  return [state, actions]
}

export function ConsoleProvider(props) {
  const [state, actions] = useConsole()
  return (
    <ActionProvider value={actions}>
      <StateProvider value={state}>{props.children}</StateProvider>
    </ActionProvider>
  )
}

export function useConsoleActions() {
  return useContext(ActionsContext)
}

export function useConsoleState() {
  return useContext(StateContext)
}
