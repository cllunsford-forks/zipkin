import {combineReducers} from 'redux';
import {dependencyLinks} from './dependencies';
import {error} from './error';
import {selectedService, serviceNames} from './services';
import {spansByService} from './spans';
import {trace, traces} from './traces';

const rootReducer = combineReducers({
  dependencyLinks,
  error,
  selectedService,
  serviceNames,
  spansByService,
  trace,
  traces,
});

export default rootReducer;
