import {
  RECEIVE_DEPENDENCIES,
} from '../actions/dependencies';

export function dependencyLinks(state = [], action) {
  switch (action.type) {
    case RECEIVE_DEPENDENCIES:
      return action.data;
    default:
      return state;
  }
}
