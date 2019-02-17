import { compose, overProp, toggleProp } from './ramda-helpers'
import * as R from 'ramda'
import { getCached } from './dom-helpers'
import { useCacheEffect } from './hooks'
import { useEffect, useMemo, useState } from 'react'
import { Hook } from 'console-feed'

export function useConsole() {
  const [con, setState] = useState(() => {
    const { hidden } = getCached('console') || {}
    return { logs: [], hidden: hidden || false }
  })

  useCacheEffect('console', con)

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

  return [con, actions]
}
