# js-react-utils
A bundle of utility functions to simplify component development with React

## Usage example

```jsx
import React, { useState, useContext } from 'react'
import { render } from 'react-dom'
import { component, context } from 'js-react-utils'
import { Spec } from 'js-spec/dev-only' // 3rd-party validation library

const consoleLogger = {
  debug: console.debug,
  info: console.info,
  error: console.error
}

const LoggerCtx = context({
  displayName: 'LoggerCtx',

  validate: Spec.shape({
    debug: Spec.function,
    info: Spec.function,
    error: Spec.function
  })

  defaultValue: consoleLogger
})

const Counter = component({
  displayName: 'Counter',
  memoize: true,

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  render: CounterView
})

function CounterView({ initialValue = 0, label = 'Counter' }) {
  const
    [counterValue, setCounterValue] = useState(initialValue),
    logger = useContext(LoggerCtx)

  function increaseCounter(delta) {
    logger.info(`Increasing counter by ${delta}`)

    setCounterValue(counterValue + delta)
  }

  return (
    <div className="counter">
      <button
        className="counter-decrement"
        onClick={() => increaseCounter(-1)}>
        -
      </button>
      <div className="counter-value">
        {counterValue}
      </div>
      <button
        className="counter-increment"
        onClick={() => increaseCounter(1)}>
        +
      </button>
    </div>
  )
}

// In case you prefer a shorter syntax use:
// context(displayName, render)
const Demo = component('Demo', () =>
  <div>
    <h3>Demo</h3>
    <div><Counter/></div>
  </div>
)

render(<Demo/>, document.getElementById('main-content'))
```

## Benefits

- Support for framework agnostic props validation.
  No need to use 'prop-types' library: As component properties and context values
  can be validated in a more general way, js-react-utils is not depending on a
  React or js-react-utils specific prop validation library.
  Instead a general validation library like for example
  [js-spec](https://github.com/js-works/js-spec) can be used.

- Forces to define an explicite display name (which will also be available
  in production)

- Some additional useful helper functions

## Project status

This project is in alpha state.
