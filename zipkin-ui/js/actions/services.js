export const REQUEST_SERVICES = 'REQUEST_SERVICES'
function requestServices() {
  return {
    type: REQUEST_SERVICES,
  }
}

export const RECEIVE_SERVICES = 'RECEIVE_SERVICES'
function receiveServices(data) {
  return {
    type: RECEIVE_SERVICES,
    names: data,
  }
}

export function fetchServices() {
  return (dispatch) => {
    dispatch(requestServices())
    return fetch('/api/v1/services')
      .then(response => response.json())
      .then(json =>
        dispatch(receiveServices(json))
      )
  }
}
