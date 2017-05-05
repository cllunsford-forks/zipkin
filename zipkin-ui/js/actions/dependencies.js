import handleErrors from './error'

export const REQUEST_DEPENDENCIES = 'REQUEST_DEPENDENCIES'
function requestDependencies() {
  return {
    type: REQUEST_DEPENDENCIES,
  }
}

export const REQUEST_DEPENDENCIES_FAILURE = 'REQUEST_DEPENDENCIES_FAILURE'
function requestDependenciesFailure(message, error) {
  return {
    type: REQUEST_DEPENDENCIES_FAILURE,
    message,
    error
  }
}

export const RECEIVE_DEPENDENCIES = 'RECEIVE_DEPENDENCIES'
function receiveDependencies(data) {
  return {
    type: RECEIVE_DEPENDENCIES,
    data
  }
}

export function fetchDependencies(endTs, lookback) {
  return (dispatch) => {
    let url = `/api/v1/dependencies?endTs=${endTs}`;
    if (lookback) {
      url += `&lookback=${lookback}`;
    }
    dispatch(requestDependencies())
    return fetch(url)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => dispatch(receiveDependencies(json)))
      .catch(error => {
        console.log(error);
        dispatch(requestDependenciesFailure('Could not get dependency data from backend', error))
      }
      )
  }
}
