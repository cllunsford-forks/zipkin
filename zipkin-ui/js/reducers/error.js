import { REQUEST_SERVICES_FAILURE } from '../actions/services'
import { REQUEST_SPANS_FAILURE } from '../actions/spans'

export function error(state = {}, action) {
  switch (action.type) {
    case REQUEST_SPANS_FAILURE:
      return { message: action.message, error: action.error }
    case REQUEST_SERVICES_FAILURE:
      return { message: action.message, error: action.error }
    default:
      return state
  }
}
