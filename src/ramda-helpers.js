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

export function sleep(timeout) {
  validate('N', arguments)
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export function invariant(cond, message) {
  if (message === void 0) {
    message = 'Illegal state'
  }
  if (!cond) throw new Error('[invariant] ' + message)
}

export function hexColorFromStr(str) {
  validate('S', arguments)
  const hash = R.reduce((acc, char) => {
    const unicode = char.charCodeAt(0)
    return unicode + ((acc << 5) - acc)
  })(0)(str)

  const color = Math.floor(
    Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216),
  ).toString(16)

  return '#' + Array(6 - color.length + 1).join('0') + color
}
