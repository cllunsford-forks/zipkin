import {
  RECEIVE_SERVICES,
  REQUEST_SERVICES
} from '../actions/services'

const serviceNames = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SERVICES:
      return action.names
    default:
      return state
  }
}

export default serviceNames
