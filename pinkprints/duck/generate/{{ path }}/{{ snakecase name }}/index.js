// Constants

export const ACTION = '{{ uppercase (snakecase name) }}/ACTION'

// Helpers

// Action Creators

export const addAction = (payload) => ({
  type: ACTION,
  payload
})

// Selectors

// Reducer

const initialState = {{ names args }}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION:
      return initialState
    default:
      return state
  }
}
