import { combineReducers } from 'redux'
import { selectedService, serviceNames, serviceError } from './services'

const rootReducer = combineReducers({
  selectedService,
  serviceNames,
  serviceError,
})

export default rootReducer
