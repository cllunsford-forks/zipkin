import handleErrors from './error'
import queryString from 'query-string';

// Single Trace
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

// Multiple Traces
export const RECEIVE_TRACES = 'RECEIVE_TRACES'
function receiveTraces(data) {
  return {
    type: RECEIVE_TRACES,
    data
  }
}

export const REQUEST_TRACES = 'REQUEST_TRACES'
function requestTraces() {
  return {
    type: REQUEST_TRACES,
  }
}

export const REQUEST_TRACES_FAILURE = 'REQUEST_TRACES_FAILURE'
function requestTracesFailure(message, error) {
  return {
    type: REQUEST_TRACES_FAILURE,
    message,
    error
  }
}
export function fetchTraces(query) {
  return (dispatch) => {
    dispatch(requestTraces())
    return fetch(`/api/v1/traces?${queryString.stringify(query)}`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveTraces(json))
      })
      .catch(error => dispatch(requestTracesFailure('Error loading traces', error)))
  }
}
