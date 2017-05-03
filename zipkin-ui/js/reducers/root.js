import { combineReducers } from 'redux'
import { error } from './error'
import { selectedService, serviceNames } from './services'
import { spansByService } from './spans'

const rootReducer = combineReducers({
  selectedService,
  serviceNames,
  error,
  spansByService,
})

export default rootReducer
