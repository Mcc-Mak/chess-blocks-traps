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
  static trap() { return new Cell(CELL.TRAP); }
  static block(player) { return new Cell(CELL.BLOCK, player); }
  static explosion() { return new Cell(CELL.EXPLOSION); }
  clone() { return new Cell(this.value, this.name); }
}

export class Player {
  constructor({
    score = 0,
    blockPerGame = GAME.BLOCKS_PER_GAME,
    trapPerGame = GAME.TRAPS_PER_GAME,
    movePerRound = 1,
    blockPerRound = 1,
    trapPerRound = 1,
  } = {}) {
    this.score = score;
    this.blockPerGame = blockPerGame;
    this.trapPerGame = trapPerGame;
    this.movePerRound = movePerRound;
    this.blockPerRound = blockPerRound;
    this.trapPerRound = trapPerRound;
  }
  clone() { return new Player(this); }
  get canMove() { return this.movePerRound > 0; }
  get canBlock() { return this.blockPerRound > 0 && this.blockPerGame > 0; }
  get canTrap() { return this.trapPerRound > 0 && this.trapPerGame > 0; }
  useMove() { const n = this.clone(); n.movePerRound -= 1; return n; }
  useBlock() { const n = this.clone(); n.blockPerGame -= 1; n.blockPerRound -= 1; return n; }
  useTrap() { const n = this.clone(); n.trapPerGame -= 1; n.trapPerRound -= 1; return n; }
  scoreUp() { const n = this.clone(); n.score += 1; return n; }
  resetRound() {
    const n = this.clone();
    n.movePerRound = 1;
    n.blockPerRound = 1;
    n.trapPerRound = 1;
    return n;
  }
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

  currentPlayer() { return this.players[this.turn]; }
  otherPlayer() { return this.turn === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE; }

  movableTargets(row, col) {
    const targets = [];
    for (const d of DIRECTIONS) {
      const nr = row + d.dr;
      const nc = col + d.dc;
      if (nr < 0 || nr >= BOARD.ROWS || nc < 0 || nc >= BOARD.COLUMNS) continue;
      const cell = this.board[nr][nc];
      if (cell.value === CELL.SPACE || cell.value === CELL.TRAP) {
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
    if (this.winner || !this.currentPlayer().canBlock) return this;
    const next = this.clone();
    next.selection = { type: 'block' };
    return next;
  }

  selectTrap() {
    if (this.winner || !this.currentPlayer().canTrap) return this;
    const next = this.clone();
    next.selection = { type: 'trap' };
    return next;
  }

  moveChess(toRow, toCol) {
    if (this.winner) return this;
    if (!this.selection || this.selection.type !== 'chess') return this;
    if (!this.currentPlayer().canMove) return this;

    const { row, col } = this.selection;
    const target = this.movableTargets(row, col).find(
      (t) => t.row === toRow && t.col === toCol
    );
    if (!target) return this;

    const next = this.clone();
    let player = next.currentPlayer().useMove();
    next.board[row][col] = Cell.space();

    const targetCell = next.board[toRow][toCol];
    if (targetCell.value === CELL.TRAP) {
      next.board[toRow][toCol] = Cell.explosion();
    } else {
      next.board[toRow][toCol] = Cell.chess(next.turn);
      if (toCol === GAME.END_COLUMNS[next.turn]) {
        player = player.scoreUp();
        next.board[toRow][toCol] = Cell.space();
      }
    }
    next.players[next.turn] = player;
    next.selection = null;

    if (player.score >= GAME.END_SCORE) {
      next.winner = next.turn;
    } else {
      const other = next.otherPlayer();
      next.turn = other;
      next.players[other] = next.players[other].resetRound();
    }
    return next;
  }

  placeBlock(row, col) {
    if (this.winner) return this;
    if (!this.selection || this.selection.type !== 'block') return this;
    if (!this.currentPlayer().canBlock) return this;
    const cell = this.board[row][col];
    if (cell.value !== CELL.SPACE && cell.value !== CELL.TRAP) return this;

    const next = this.clone();
    next.players[next.turn] = next.currentPlayer().useBlock();
    next.board[row][col] = Cell.block(next.turn);
    next.selection = null;
    return next;
  }

  placeTrap(row, col) {
    if (this.winner) return this;
    if (!this.selection || this.selection.type !== 'trap') return this;
    if (!this.currentPlayer().canTrap) return this;
    if (this.board[row][col].value !== CELL.SPACE) return this;

    const next = this.clone();
    next.players[next.turn] = next.currentPlayer().useTrap();
    next.board[row][col] = Cell.trap();
    next.selection = null;
    return next;
  }
}
