import PLAYER_1 from '../assets/img/PLAYER_1.PNG';
import PLAYER_2 from '../assets/img/PLAYER_2.PNG';
import BLOCK_1 from '../assets/img/BLOCK_1.PNG';
import BLOCK_2 from '../assets/img/BLOCK_2.PNG';
import BOMB_1 from '../assets/img/BOMB_1.PNG';
import BOMB_2 from '../assets/img/BOMB_2.PNG';
import UP from '../assets/img/UP.PNG';
import DOWN from '../assets/img/DOWN.PNG';
import LEFT from '../assets/img/LEFT.PNG';
import RIGHT from '../assets/img/RIGHT.PNG';
import EXPLOSION from '../assets/img/EXPLOSION.PNG';

export const CELL = {
  SPACE: 0,
  CHESS: 1,
  BOMB: 2,
  BLOCK: 3,
  EXPLOSION: 4,
};

export const STATUS = {
  DEFAULT: 'DEFAULT',
  CLICKED: 'CLICKED',
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

export const PLAYER = { NONE: -1, ONE: 1, TWO: 2 };

export const BOARD = { ROWS: 8, COLUMNS: 8 };

export const GAME = {
  WINNING_SCORE: 5,
  BLOCKS_PER_PLAYER: 3,
  BOMBS_PER_PLAYER: 3,
  GOAL_COLUMNS: { [PLAYER.ONE]: BOARD.COLUMNS - 1, [PLAYER.TWO]: 0 },
};

export const IMAGES = {
  PLAYER_1,
  PLAYER_2,
  BLOCK_1,
  BLOCK_2,
  BOMB_1,
  BOMB_2,
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

export const playerBombImage = (player) =>
  player === PLAYER.ONE ? IMAGES.BOMB_1 : IMAGES.BOMB_2;

export const directionImage = (status) => IMAGES[status];
