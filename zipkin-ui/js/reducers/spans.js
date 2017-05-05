import {
  RECEIVE_SPANS,
  REQUEST_SPANS,
  REQUEST_SPANS_FAILURE,
} from '../actions/spans'

export function spansByService(state = {}, action) {
  switch (action.type) {
    case RECEIVE_SPANS:
      return Object.assign({}, state, {
        [action.serviceName]: {
          spans: action.spans,
          lastUpdated: action.lastUpdated,
          isUpdating: false
        }
      })
    default:
      return state
  }
}

