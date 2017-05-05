import {
  RECEIVE_DEPENDENCIES,
  REQUEST_DEPENDENCIES,
  REQUEST_DEPENDENCIES_FAILURE,
} from '../actions/dependencies'

export function dependencyLinks(state = [], action) {
  switch (action.type) {
    case RECEIVE_DEPENDENCIES:
      return action.data
    default:
      return state
  }
}
