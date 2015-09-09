var _state;

export default function (reducer) {
  const runWithState = (state, action) => _state = reducer(state, action);

  return {
    run    : (action) => runWithState(_state, action),
    runWithState : runWithState,
    resetState   : runWithState.bind(null, undefined, {}),
    getState     : () => _state
  };
}
