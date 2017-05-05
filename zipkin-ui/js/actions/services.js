import handleErrors from './error'

export const REQUEST_SERVICES = 'REQUEST_SERVICES'
function requestServices() {
  return {
    type: REQUEST_SERVICES,
  }
}

export const REQUEST_SERVICES_FAILURE = 'REQUEST_SERVICES_FAILURE'
function requestServicesFailure(message, error) {
  return {
    type: REQUEST_SERVICES_FAILURE,
    message,
    error
  }
}

export const RECEIVE_SERVICES = 'RECEIVE_SERVICES'
function receiveServices(data) {
  return {
    type: RECEIVE_SERVICES,
    names: data,
    lastUpdated: Date.now()
  }
}

export const SELECT_SERVICE = 'SELECT_SERVICE'
export function selectService(serviceName) {
  return {
    type: SELECT_SERVICE,
    serviceName
  }
}

export function fetchServices() {
  return (dispatch) => {
    dispatch(requestServices())
    return fetch('/api/v1/services')
      .then(handleErrors)
      .then(response => response.json())
      .then(json => dispatch(receiveServices(json)))
      .catch(error =>
        dispatch(requestServicesFailure('cannot load service names', error))
      )
  }
}

function shouldFetchServices(state) {
  const services = state.serviceNames
  if (!services.names) {
    return true
  } else {
    return false
  }
}

export function fetchServicesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchServices(getState())) {
      return dispatch(fetchServices())
    } else {
      return Promise.resolve()
    }
  }
}
