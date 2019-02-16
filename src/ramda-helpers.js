import validate from 'aproba'
import * as R from 'ramda'

export const C = R.always
export const I = R.identity

export function overProp(propName) {
  validate('S', arguments)
  return R.over(R.lensProp(propName))
}

function assert(bool, msg) {
  validate('BS', arguments)
  if (!bool) {
    throw new Error(msg)
  }
}

export function compose(fns) {
  validate('A', arguments)
  fns.forEach((fn, i) => {
    const argType = typeof fn
    assert(
      argType === 'function',
      `[compose] expected typeof fns[${i}] to be function but found ${argType} , ${fn}`,
    )
  })
  return R.compose(...fns)
}

export function pipe(fns) {
  validate('A', arguments)
  return compose(R.reverse(fns))
}
