import { CELL, STATUS, BOARD, GAME, PLAYER } from './constants.js';

const DIRECTIONS = [
  { dr: -1, dc: 0, status: STATUS.UP },
  { dr: 1, dc: 0, status: STATUS.DOWN },
  { dr: 0, dc: -1, status: STATUS.LEFT },
  { dr: 0, dc: 1, status: STATUS.RIGHT },
];

export class Cell {
  constructor(value, name = PLAYER.NONE) {
    this.value = value;
    this.name = name;
  }

  static space() { return new Cell(CELL.SPACE); }
  static chess(player) { return new Cell(CELL.CHESS, player); }
  static bomb() { return new Cell(CELL.BOMB); }
  static block(player) { return new Cell(CELL.BLOCK, player); }
  static explosion() { return new Cell(CELL.EXPLOSION); }

  clone() { return new Cell(this.value, this.name); }
}

export class Player {
  constructor({
    score = 0,
    blocksRemaining = GAME.BLOCKS_PER_PLAYER,
    bombsRemaining = GAME.BOMBS_PER_PLAYER,
  } = {}) {
    this.score = score;
    this.blocksRemaining = blocksRemaining;
    this.bombsRemaining = bombsRemaining;
  }

  clone() { return new Player(this); }

  get canBlock() { return this.blocksRemaining > 0; }
  get canBomb() { return this.bombsRemaining > 0; }

  useBlock() { const next = this.clone(); next.blocksRemaining -= 1; return next; }
  useBomb() { const next = this.clone(); next.bombsRemaining -= 1; return next; }
  scoreUp() { const next = this.clone(); next.score += 1; return next; }
}

export class Game {
  constructor({
    turn = PLAYER.ONE,
    winner = null,
    board,
    players,
    selection = null,
  } = {}) {
    this.turn = turn;
    this.winner = winner;
    this.board = board;
    this.players = players;
    this.selection = selection;
  }

  static initial() {
    const board = [];
    for (let r = 0; r < BOARD.ROWS; r++) {
      const row = [];
      for (let c = 0; c < BOARD.COLUMNS; c++) {
        if (c === 0) row.push(Cell.chess(PLAYER.ONE));
        else if (c === BOARD.COLUMNS - 1) row.push(Cell.chess(PLAYER.TWO));
        else row.push(Cell.space());
      }
      board.push(row);
    }
    return new Game({
      board,
      players: { [PLAYER.ONE]: new Player(), [PLAYER.TWO]: new Player() },
    });
  }

  clone() {
    return new Game({
      turn: this.turn,
      winner: this.winner,
      board: this.board.map((row) => row.map((cell) => cell.clone())),
      players: {
        [PLAYER.ONE]: this.players[PLAYER.ONE].clone(),
        [PLAYER.TWO]: this.players[PLAYER.TWO].clone(),
      },
      selection: this.selection ? { ...this.selection } : null,
    });
  }

  get currentPlayer() { return this.players[this.turn]; }
  get opponent() { return this.turn === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE; }

  movableTargets(row, col) {
    const targets = [];
    for (const d of DIRECTIONS) {
      const nr = row + d.dr;
      const nc = col + d.dc;
      if (nr < 0 || nr >= BOARD.ROWS || nc < 0 || nc >= BOARD.COLUMNS) continue;
      const cell = this.board[nr][nc];
      if (cell.value === CELL.SPACE || cell.value === CELL.BOMB) {
        targets.push({ row: nr, col: nc, status: d.status });
      }
    }
    return targets;
  }

  selectChess(row, col) {
    if (this.winner) return this;
    const cell = this.board[row][col];
    if (cell.value !== CELL.CHESS || cell.name !== this.turn) return this;
    const next = this.clone();
    next.selection = { type: 'chess', row, col };
    return next;
  }

  clearSelection() {
    if (!this.selection) return this;
    const next = this.clone();
    next.selection = null;
    return next;
  }

  selectBlock() {
    if (this.winner || !this.currentPlayer.canBlock) return this;
    const next = this.clone();
    next.selection = { type: 'block' };
    return next;
  }

  selectBomb() {
    if (this.winner || !this.currentPlayer.canBomb) return this;
    const next = this.clone();
    next.selection = { type: 'bomb' };
    return next;
  }

  moveChess(toRow, toCol) {
    if (this.winner) return this;
    if (!this.selection || this.selection.type !== 'chess') return this;

    const { row, col } = this.selection;
    const target = this.movableTargets(row, col).find(
      (t) => t.row === toRow && t.col === toCol
    );
    if (!target) return this;

    const next = this.clone();
    let player = next.currentPlayer;

    next.board[row][col] = Cell.space();

    const targetCell = next.board[toRow][toCol];
    if (targetCell.value === CELL.BOMB) {
      next.board[toRow][toCol] = Cell.explosion();
    } else {
      next.board[toRow][toCol] = Cell.chess(next.turn);
      if (toCol === GAME.GOAL_COLUMNS[next.turn]) {
        player = player.scoreUp();
        next.board[toRow][toCol] = Cell.space();
      }
    }
    next.players[next.turn] = player;
    next.selection = null;

    if (player.score >= GAME.WINNING_SCORE) {
      next.winner = next.turn;
    } else {
      next.turn = next.opponent;
    }
    return next;
  }

  placeBlock(row, col) {
    if (this.winner) return this;
    if (!this.selection || this.selection.type !== 'block') return this;
    if (!this.currentPlayer.canBlock) return this;
    const cell = this.board[row][col];
    if (cell.value !== CELL.SPACE && cell.value !== CELL.BOMB) return this;

    const next = this.clone();
    next.players[next.turn] = next.currentPlayer.useBlock();
    next.board[row][col] = Cell.block(next.turn);
    next.selection = null;
    next.turn = next.opponent;
    return next;
  }

  placeBomb(row, col) {
    if (this.winner) return this;
    if (!this.selection || this.selection.type !== 'bomb') return this;
    if (!this.currentPlayer.canBomb) return this;
    if (this.board[row][col].value !== CELL.SPACE) return this;

    const next = this.clone();
    next.players[next.turn] = next.currentPlayer.useBomb();
    next.board[row][col] = Cell.bomb();
    next.selection = null;
    next.turn = next.opponent;
    return next;
  }
}
