import {
  SHOW_REQUEST_JSON,
} from '../actions/ui'

export function uiRequestJSON(state = false, action) {
  switch (action.type) {
    case SHOW_REQUEST_JSON:
      return action.show
    default:
      return state
  }
}
