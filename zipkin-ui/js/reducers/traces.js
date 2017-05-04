import {
  RECEIVE_TRACE,
  RECEIVE_TRACES,
} from '../actions/traces'

export function trace(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TRACE:
      return action.data[0]
    default:
      return state
  }
}

export function traces(state = [], action) {
  switch (action.type) {
    case RECEIVE_TRACES:
      return action.data
    default:
      return state
  }
}
