import handleErrors from './error'

export const RECEIVE_TRACE = 'RECEIVE_TRACE'
function receiveTrace(data) {
  return {
    type: RECEIVE_TRACE,
    data
  }
}

export const REQUEST_TRACE = 'REQUEST_TRACE'
function requestTrace(traceId) {
  return {
    type: REQUEST_TRACE,
    traceId
  }
}

export const REQUEST_TRACE_FAILURE = 'REQUEST_TRACE_FAILURE'
function requestTraceFailure(message, error) {
  return {
    type: REQUEST_TRACE_FAILURE,
    message,
    error
  }
}

export function fetchTrace(traceId) {
  return (dispatch) => {
    dispatch(requestTrace(traceId))
    return fetch(`/api/v1/trace/${traceId}`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveTrace(json))
      })
      .catch(error => dispatch(requestTraceFailure(`Cannot load trace ${traceId}`, error)))
  }
}
