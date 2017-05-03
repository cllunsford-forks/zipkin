import { combineReducers } from 'redux'
import { error } from './error'
import { selectedService, serviceNames } from './services'
import { spansByService } from './spans'
import { trace } from './trace'

const rootReducer = combineReducers({
  error,
  selectedService,
  serviceNames,
  spansByService,
  trace,
})

export default rootReducer
