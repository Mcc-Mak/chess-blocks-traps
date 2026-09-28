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
    case 'SELECT_BOMB':
      return state.selectBomb();
    case 'MOVE_CHESS':
      return state.moveChess(action.row, action.col);
    case 'PLACE_BLOCK':
      return state.placeBlock(action.row, action.col);
    case 'PLACE_BOMB':
      return state.placeBomb(action.row, action.col);
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => Game.initial());

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const selectChess = useCallback(
    (row, col) => dispatch({ type: 'SELECT_CHESS', row, col }),
    []
  );
  const clearSelection = useCallback(() => dispatch({ type: 'CLEAR_SELECTION' }), []);
  const selectBlock = useCallback(() => dispatch({ type: 'SELECT_BLOCK' }), []);
  const selectBomb = useCallback(() => dispatch({ type: 'SELECT_BOMB' }), []);
  const moveChess = useCallback(
    (row, col) => dispatch({ type: 'MOVE_CHESS', row, col }),
    []
  );
  const placeBlock = useCallback(
    (row, col) => dispatch({ type: 'PLACE_BLOCK', row, col }),
    []
  );
  const placeBomb = useCallback(
    (row, col) => dispatch({ type: 'PLACE_BOMB', row, col }),
    []
  );

  return {
    state,
    reset,
    selectChess,
    clearSelection,
    selectBlock,
    selectBomb,
    moveChess,
    placeBlock,
    placeBomb,
  };
}
