import React from 'react'

function Input(props) {
  return <input {...props} />
}
export default {
  component: Input,
  props: {
    value: 'Lorem ipsum',
    disabled: false,
    onChange: value => console.log(`Select: ${value}`),
  },
}
