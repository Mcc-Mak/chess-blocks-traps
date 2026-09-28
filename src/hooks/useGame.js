import { useReducer, useCallback } from 'react';
import { Game } from '../game/engine.js';

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return Game.initial();
    case 'SELECT_CHESS':
      return state.selectChess(action.row, action.col);
    case 'CLEAR_SELECTION':
      return state.clearSelection();
    case 'SELECT_BLOCK':
      return state.selectBlock();
    case 'SELECT_TRAP':
      return state.selectTrap();
    case 'MOVE_CHESS':
      return state.moveChess(action.row, action.col);
    case 'PLACE_BLOCK':
      return state.placeBlock(action.row, action.col);
    case 'PLACE_TRAP':
      return state.placeTrap(action.row, action.col);
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => Game.initial());

  const handlers = {
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
    selectChess: useCallback(
      (row, col) => dispatch({ type: 'SELECT_CHESS', row, col }),
      []
    ),
    clearSelection: useCallback(() => dispatch({ type: 'CLEAR_SELECTION' }), []),
    selectBlock: useCallback(() => dispatch({ type: 'SELECT_BLOCK' }), []),
    selectTrap: useCallback(() => dispatch({ type: 'SELECT_TRAP' }), []),
    moveChess: useCallback(
      (row, col) => dispatch({ type: 'MOVE_CHESS', row, col }),
      []
    ),
    placeBlock: useCallback(
      (row, col) => dispatch({ type: 'PLACE_BLOCK', row, col }),
      []
    ),
    placeTrap: useCallback(
      (row, col) => dispatch({ type: 'PLACE_TRAP', row, col }),
      []
    ),
  };

  return { state, ...handlers };
}
