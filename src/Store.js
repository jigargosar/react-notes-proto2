import * as R from 'ramda'
import nanoid from 'nanoid'
import faker from 'faker'

function newNote() {
  return {
    _id: nanoid(),
    _rev: null,
    content: faker.lorem.lines(),
  }
}

export function toDisplayNote(note) {
  const [primary, ...rest] = note.content.trim().split('\n')

  return {
    id: note._id,
    primary,
    secondary: rest.join('\n'),
    person: R.compose(
      R.toUpper,
      R.take(2),
    )(primary),
  }
}

export function getInitialNotes() {
  return R.times(newNote, 10)
}
