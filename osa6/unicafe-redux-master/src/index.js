import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const dispatch = (type) => {
  return () => store.dispatch({ type })
}

const App = () => {

  return (
    <div>
      <button onClick={dispatch('GOOD')}>hyvä</button>
      <button onClick={dispatch('OK')}>neutraali</button>
      <button onClick={dispatch('BAD')}>huono</button>
      <button onClick={dispatch('ZERO')}>nollaa tilastot</button>
      <div>hyvä {store.getState().good}</div>
      <div>neutraali {store.getState().ok}</div>
      <div>huono {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)