import {
  RECEIVE_SERVICES,
  REQUEST_SERVICES,
  REQUEST_SERVICES_FAILURE,
  SELECT_SERVICE
} from '../actions/services'

export function selectedService(state = '', action) {
  switch (action.type) {
    case SELECT_SERVICE:
      return action.serviceName || state
    default:
      return state
  }
}

export function serviceNames(state = {
  names: [],
  isUpdating: false
}, action) {
  switch (action.type) {
    case REQUEST_SERVICES:
      return Object.assign({}, state, {
        isUpdating: true,
      })
    case RECEIVE_SERVICES:
      return Object.assign({}, state, {
        isUpdating: false,
        names: action.names,
        lastUpdated: action.lastUpdated,
      })
    default:
      return state
  }
}

