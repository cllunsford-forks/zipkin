import handleErrors from './error'

export const RECEIVE_SPANS = 'RECEIVE_SPANS'
function receiveSpans(serviceName, data) {
  return {
    type: RECEIVE_SPANS,
    serviceName,
    spans: data,
    lastUpdated: Date.now(),
  }
}

export const REQUEST_SPANS = 'REQUEST_SPANS'
function requestSpansByService(serviceName) {
  return {
    type: REQUEST_SPANS,
    serviceName
  }
}

export const REQUEST_SPANS_FAILURE = 'REQUEST_SPANS_FAILURE'
function requestSpansFailure(message, error) {
  return {
    type: REQUEST_SPANS_FAILURE,
    message,
    error
  }
}

export function fetchSpansByService(serviceName) {
  return (dispatch) => {
    dispatch(requestSpansByService(serviceName))
    return fetch(`/api/v1/spans?serviceName=${serviceName}`)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => dispatch(receiveSpans(serviceName, json)))
      .catch(error => dispatch(requestSpansFailure('cannot load span names', error)))
  }
}


function shouldFetchSpans(state, serviceName) {
  if (!state.spansByService.hasOwnProperty(serviceName)) {
    return true
  }
  const spans = state.spansByService[serviceName]
  return false
}

export function fetchSpansIfNeeded(serviceName) {
  return (dispatch, getState) => {
    if (shouldFetchSpans(getState(), serviceName)) {
      dispatch(fetchSpansByService(serviceName))
    } else {
      return Promise.resolve()
    }
  }
}
