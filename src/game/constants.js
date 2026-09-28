import PLAYER_1 from '../assets/img/PLAYER_1.PNG';
import PLAYER_2 from '../assets/img/PLAYER_2.PNG';
import BLOCK_1 from '../assets/img/BLOCK_1.PNG';
import BLOCK_2 from '../assets/img/BLOCK_2.PNG';
import TRAP_1 from '../assets/img/TRAP_1.PNG';
import TRAP_2 from '../assets/img/TRAP_2.PNG';
import UP from '../assets/img/UP.PNG';
import DOWN from '../assets/img/DOWN.PNG';
import LEFT from '../assets/img/LEFT.PNG';
import RIGHT from '../assets/img/RIGHT.PNG';
import EXPLOSION from '../assets/img/EXPLOSION.PNG';

// Cell content types stored on each board square.
export const CELL = {
  SPACE: 0,
  CHESS: 1,
  TRAP: 2,
  BLOCK: 3,
  EXPLOSION: 4,
};

// Transient states used to render highlights and suggestions.
export const STATUS = {
  DEFAULT: 'DEFAULT',
  CLICKED: 'CLICKED',
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  EXIT: 'EXIT',
};

export const PLAYER = { ONE: 1, TWO: 2 };

export const BOARD = { ROWS: 8, COLUMNS: 8 };

export const GAME = {
  END_SCORE: 5,
  BLOCKS_PER_GAME: 3,
  TRAPS_PER_GAME: 3,
  // Column a chess must reach to score, keyed by player.
  END_COLUMNS: { 1: BOARD.COLUMNS - 1, 2: 0 },
};

export const IMAGES = {
  PLAYER_1,
  PLAYER_2,
  BLOCK_1,
  BLOCK_2,
  TRAP_1,
  TRAP_2,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  EXPLOSION,
};

export const playerChessImage = (player) =>
  player === PLAYER.ONE ? IMAGES.PLAYER_1 : IMAGES.PLAYER_2;

export const playerBlockImage = (player) =>
  player === PLAYER.ONE ? IMAGES.BLOCK_1 : IMAGES.BLOCK_2;

export const playerTrapImage = (player) =>
  player === PLAYER.ONE ? IMAGES.TRAP_1 : IMAGES.TRAP_2;

export const directionImage = (status) => IMAGES[status];
