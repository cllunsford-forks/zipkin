import { combineReducers } from 'redux'
import { error } from './error'
import { selectedService, serviceNames } from './services'
import { spansByService } from './spans'
import { trace, traces } from './traces'
import { uiRequestJSON } from './ui'

const rootReducer = combineReducers({
  error,
  selectedService,
  serviceNames,
  spansByService,
  trace,
  traces,
  uiRequestJSON,
})

export default rootReducer
