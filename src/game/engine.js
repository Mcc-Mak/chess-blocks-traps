import { CELL, STATUS, BOARD, GAME, PLAYER } from './constants.js';

// --- Player helpers (players are plain objects, no mutation methods) ---

export function createPlayer() {
  return {
    score: 0,
    blockPerGame: GAME.BLOCKS_PER_GAME,
    trapPerGame: GAME.TRAPS_PER_GAME,
    movePerRound: 1,
    blockPerRound: 1,
    trapPerRound: 1,
  };
}

export const canMove = (p) => p.movePerRound > 0;
export const canBlock = (p) => p.blockPerRound > 0 && p.blockPerGame > 0;
export const canTrap = (p) => p.trapPerRound > 0 && p.trapPerGame > 0;

function resetRound(p) {
  p.movePerRound = 1;
  p.blockPerRound = 1;
  p.trapPerRound = 1;
}

// --- Board state (pure functions; each action returns a new state) ---

export function createInitialState() {
  const board = [];
  for (let r = 0; r < BOARD.ROWS; r++) {
    const row = [];
    for (let c = 0; c < BOARD.COLUMNS; c++) {
      if (c === 0) row.push({ value: CELL.CHESS, name: PLAYER.ONE });
      else if (c === BOARD.COLUMNS - 1) row.push({ value: CELL.CHESS, name: PLAYER.TWO });
      else row.push({ value: CELL.SPACE, name: -1 });
    }
    board.push(row);
  }
  return {
    turn: PLAYER.ONE,
    winner: null,
    board,
    players: { 1: createPlayer(), 2: createPlayer() },
    selection: null,
  };
}

function clone(state) {
  return {
    turn: state.turn,
    winner: state.winner,
    board: state.board.map((row) => row.map((cell) => ({ ...cell }))),
    players: { 1: { ...state.players[1] }, 2: { ...state.players[2] } },
    selection: state.selection ? { ...state.selection } : null,
  };
}

const DIRECTIONS = [
  { dr: -1, dc: 0, status: STATUS.UP },
  { dr: 1, dc: 0, status: STATUS.DOWN },
  { dr: 0, dc: -1, status: STATUS.LEFT },
  { dr: 0, dc: 1, status: STATUS.RIGHT },
];

// Squares the selected chess may move to (space or untriggered trap).
export function getMovableTargets(state, row, col) {
  const targets = [];
  for (const d of DIRECTIONS) {
    const nr = row + d.dr;
    const nc = col + d.dc;
    if (nr < 0 || nr >= BOARD.ROWS || nc < 0 || nc >= BOARD.COLUMNS) continue;
    const cell = state.board[nr][nc];
    if (cell.value === CELL.SPACE || cell.value === CELL.TRAP) {
      targets.push({ row: nr, col: nc, status: d.status });
    }
  }
  return targets;
}

export function selectChess(state, row, col) {
  if (state.winner) return state;
  const cell = state.board[row][col];
  if (cell.value !== CELL.CHESS || cell.name !== state.turn) return state;
  const next = clone(state);
  next.selection = { type: 'chess', row, col };
  return next;
}

export function clearSelection(state) {
  if (!state.selection) return state;
  const next = clone(state);
  next.selection = null;
  return next;
}

export function selectBlock(state) {
  if (state.winner || !canBlock(state.players[state.turn])) return state;
  const next = clone(state);
  next.selection = { type: 'block' };
  return next;
}

export function selectTrap(state) {
  if (state.winner || !canTrap(state.players[state.turn])) return state;
  const next = clone(state);
  next.selection = { type: 'trap' };
  return next;
}

export function moveChess(state, toRow, toCol) {
  if (state.winner) return state;
  if (!state.selection || state.selection.type !== 'chess') return state;
  if (!canMove(state.players[state.turn])) return state;

  const { row, col } = state.selection;
  const target = getMovableTargets(state, row, col).find(
    (t) => t.row === toRow && t.col === toCol
  );
  if (!target) return state;

  const next = clone(state);
  const np = next.players[next.turn];
  np.movePerRound -= 1;

  // Leaving square becomes empty.
  next.board[row][col] = { value: CELL.SPACE, name: -1 };

  const targetCell = next.board[toRow][toCol];
  if (targetCell.value === CELL.TRAP) {
    // Trap triggers: chess destroyed, rubble blocks the road.
    next.board[toRow][toCol] = { value: CELL.EXPLOSION, name: -1 };
  } else {
    next.board[toRow][toCol] = { value: CELL.CHESS, name: next.turn };
    if (toCol === GAME.END_COLUMNS[next.turn]) {
      np.score += 1;
      next.board[toRow][toCol] = { value: CELL.SPACE, name: -1 };
    }
  }

  next.selection = null;

  if (np.score >= GAME.END_SCORE) {
    next.winner = next.turn;
  } else {
    next.turn = next.turn === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE;
    resetRound(next.players[next.turn]);
  }
  return next;
}

export function placeBlock(state, row, col) {
  if (state.winner) return state;
  if (!state.selection || state.selection.type !== 'block') return state;
  if (!canBlock(state.players[state.turn])) return state;
  const cell = state.board[row][col];
  if (cell.value !== CELL.SPACE && cell.value !== CELL.TRAP) return state;

  const next = clone(state);
  const np = next.players[next.turn];
  np.blockPerGame -= 1;
  np.blockPerRound -= 1;
  next.board[row][col] = { value: CELL.BLOCK, name: next.turn };
  next.selection = null;
  return next;
}

export function placeTrap(state, row, col) {
  if (state.winner) return state;
  if (!state.selection || state.selection.type !== 'trap') return state;
  if (!canTrap(state.players[state.turn])) return state;
  if (state.board[row][col].value !== CELL.SPACE) return state;

  const next = clone(state);
  const np = next.players[next.turn];
  np.trapPerGame -= 1;
  np.trapPerRound -= 1;
  next.board[row][col] = { value: CELL.TRAP, name: -1 };
  next.selection = null;
  return next;
}
