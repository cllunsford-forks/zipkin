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

export function serviceNames(state = [], action) {
  switch (action.type) {
    case RECEIVE_SERVICES:
      return action.names
    default:
      return state
  }
}

export function serviceError(state = '', action) {
  switch (action.type) {
    case REQUEST_SERVICES_FAILURE:
      return action.error
    default:
      return state
  }
}
