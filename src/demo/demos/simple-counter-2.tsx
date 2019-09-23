import React from 'react'

import { component, prepareActions } from '../../main'

const { useCallback, useEffect, useState } = React

type CounterProps = {
  initialValue?: number,
  label?: string
}

type CounterState = {
  count: number
}

const useCounterActions = prepareActions<CounterState>()({
  displayName: 'CounterActions',

  initState(initialValue: number) {
    return { count: initialValue }
  },

  initActions(state, setState) {
    return {
      incrementCount() {
        setState({ count: state.count + 1 })
      },

      decrementCount() {
        setState({ count: state.count - 1 })
      }
    }
  }
})

const Counter = component<CounterProps>('Counter', ({
  initialValue = 0,
  label = 'Counter'
}) => {
  const
    [actions, state] = useCounterActions(initialValue),
    onIncrement = useCallback(() => actions.incrementCount(), null),
    onDecrement = useCallback(() => actions.decrementCount(), null)

  useEffect(() => {
    console.log('Component has been mounted - state:', state)
  }, [])

  useEffect(() => {
    console.log('Component has been rendered - state: ', state)
  })

  return (
    <div>
      <label>{label}: </label>
      <button onClick={onDecrement}>-</button>
      <span> {state.count} </span>
      <button onClick={onIncrement}>+</button>
    </div>
  )
})

export default <Counter/>