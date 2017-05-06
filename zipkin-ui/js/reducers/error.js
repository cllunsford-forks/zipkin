import {REQUEST_SERVICES_FAILURE} from '../actions/services';
import {REQUEST_SPANS_FAILURE} from '../actions/spans';
import {REQUEST_TRACE_FAILURE, REQUEST_TRACES_FAILURE} from '../actions/traces';

export function error(state = {}, action) {
  switch (action.type) {
    case REQUEST_SPANS_FAILURE:
    case REQUEST_SERVICES_FAILURE:
    case REQUEST_TRACE_FAILURE:
    case REQUEST_TRACES_FAILURE:
      return {message: action.message, error: action.error};
    default:
      return state;
  }
}
