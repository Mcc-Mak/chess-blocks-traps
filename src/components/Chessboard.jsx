import {
  CELL,
  playerChessImage,
  playerBlockImage,
  directionImage,
  IMAGES,
} from '../game/constants.js';
import { getMovableTargets } from '../game/engine.js';

export default function Chessboard({ game }) {
  const { state } = game;
  const sel = state.selection;
  const targets =
    sel && sel.type === 'chess'
      ? getMovableTargets(state, sel.row, sel.col)
      : [];
  const targetOf = (r, c) => targets.find((t) => t.row === r && t.col === c);

  function onCellClick(r, c) {
    if (state.winner) return;
    const cell = state.board[r][c];

    if (!sel) {
      if (cell.value === CELL.CHESS && cell.name === state.turn) {
        game.selectChess(r, c);
      }
      return;
    }

    if (sel.type === 'chess') {
      if (sel.row === r && sel.col === c) game.clearSelection();
      else game.moveChess(r, c);
      return;
    }
    if (sel.type === 'block') {
      game.placeBlock(r, c);
      return;
    }
    if (sel.type === 'trap') {
      game.placeTrap(r, c);
      return;
    }
  }

  return (
    <div className={`board-wrap${state.winner ? ' exited' : ''}`}>
      <table className="chessboard">
        <tbody>
          {state.board.map((row, r) => (
            <tr key={r} className="chessboard">
              {row.map((cell, c) => {
                const target = targetOf(r, c);
                const isSelected =
                  sel && sel.type === 'chess' && sel.row === r && sel.col === c;
                const { image, className } = renderCell(
                  cell,
                  state.turn,
                  isSelected,
                  target
                );
                return (
                  <td
                    key={c}
                    className={`chess-cell ${className}`}
                    style={image ? { backgroundImage: `url("${image}")` } : undefined}
                    onClick={() => onCellClick(r, c)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(cell, turn, isSelected, target) {
  switch (cell.value) {
    case CELL.SPACE:
    case CELL.TRAP: {
      // Traps stay hidden until triggered; both look like empty space.
      if (target) {
        return {
          image: directionImage(target.status),
          className: 'cell-move',
        };
      }
      return { image: null, className: 'cell-space' };
    }
    case CELL.CHESS: {
      if (cell.name === turn) {
        return {
          image: playerChessImage(cell.name),
          className: isSelected ? 'cell-chess cell-chess-clicked' : 'cell-chess',
        };
      }
      return {
        image: playerChessImage(cell.name),
        className: 'cell-chess cell-chess-inactive',
      };
    }
    case CELL.BLOCK:
      return { image: playerBlockImage(cell.name), className: 'cell-block' };
    case CELL.EXPLOSION:
      return { image: IMAGES.EXPLOSION, className: 'cell-explosion' };
    default:
      return { image: null, className: 'cell-space' };
  }
}
