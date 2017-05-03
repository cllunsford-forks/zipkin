import {
  RECEIVE_TRACE,
} from '../actions/trace'

export function trace(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TRACE:
      return action.data[0]
    default:
      return state
  }
}
