import handleErrors from './error'

export const RECEIVE_SPANS = 'RECEIVE_SPANS'
function receiveSpans(serviceName, data) {
  return {
    type: RECEIVE_SPANS,
    serviceName,
    spans: data
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

// Currently we pull fresh span list on every serviceName change
//  and we keep all spans in a hash in the store.  Consider
//  only keeping current spans in store, or check to see if
//  spans are in store before fetching (or invalidate?)
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
