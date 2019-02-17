import { compose, overProp, toggleProp } from './ramda-helpers'
import * as R from 'ramda'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { useEffect, useMemo, useState } from 'react'
import { Hook } from 'console-feed'

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
