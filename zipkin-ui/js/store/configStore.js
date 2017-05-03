import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/root'
import { fetchServices } from '../actions/services'

export default function configStore() {
  const store = createStore(
    rootReducer,
    {},
    compose(
      applyMiddleware(thunkMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  )

  store.dispatch(fetchServices())

  return store
}
