import { useReducer, useCallback } from 'react';
import {
  createInitialState,
  selectChess,
  clearSelection,
  selectBlock,
  selectTrap,
  moveChess,
  placeBlock,
  placeTrap,
} from '../game/engine.js';

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return createInitialState();
    case 'SELECT_CHESS':
      return selectChess(state, action.row, action.col);
    case 'CLEAR_SELECTION':
      return clearSelection(state);
    case 'SELECT_BLOCK':
      return selectBlock(state);
    case 'SELECT_TRAP':
      return selectTrap(state);
    case 'MOVE_CHESS':
      return moveChess(state, action.row, action.col);
    case 'PLACE_BLOCK':
      return placeBlock(state, action.row, action.col);
    case 'PLACE_TRAP':
      return placeTrap(state, action.row, action.col);
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

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
