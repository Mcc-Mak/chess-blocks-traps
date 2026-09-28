import {
  PLAYER,
  GAME,
  playerChessImage,
  playerBlockImage,
  playerBombImage,
} from '../game/constants.js';

const TEXT = {
  playerTurn: '玩家回合',
  player: '玩家',
  score: '分數',
  skill: '技能',
  block: '方塊',
  bomb: '炸彈',
};

export default function Sidebar({ game }) {
  const { state } = game;
  const sel = state.selection;

  function onBlockClick(player) {
    if (state.winner || player !== state.turn) return;
    if (!sel) game.selectBlock();
    else if (sel.type === 'block') game.clearSelection();
  }

  function onBombClick(player) {
    if (state.winner || player !== state.turn) return;
    if (!sel) game.selectBomb();
    else if (sel.type === 'bomb') game.clearSelection();
  }

  return (
    <aside className="sidebar">
      <section className={`panel panel-turn turn-p${state.turn}`}>
        <h2 className="panel-title">{TEXT.playerTurn}</h2>
        <div className="turn-display">
          <img className="turn-img" src={playerChessImage(state.turn)} alt={TEXT.player} />
          <span className="turn-name">{TEXT.player} {state.turn}</span>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">{TEXT.score}</h2>
        <div className="score-row">
          <span className="score-label">
            <img className="score-chip" src={playerChessImage(PLAYER.ONE)} alt="" />
            {TEXT.player} 1
          </span>
          <strong className="score-value">{state.players[PLAYER.ONE].score}</strong>
        </div>
        <div className="score-bar">
          <div
            className="score-bar-fill p1"
            style={{ width: `${(state.players[PLAYER.ONE].score / GAME.WINNING_SCORE) * 100}%` }}
          />
        </div>
        <div className="score-row">
          <span className="score-label">
            <img className="score-chip" src={playerChessImage(PLAYER.TWO)} alt="" />
            {TEXT.player} 2
          </span>
          <strong className="score-value">{state.players[PLAYER.TWO].score}</strong>
        </div>
        <div className="score-bar">
          <div
            className="score-bar-fill p2"
            style={{ width: `${(state.players[PLAYER.TWO].score / GAME.WINNING_SCORE) * 100}%` }}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">{TEXT.skill}</h2>
        {[PLAYER.ONE, PLAYER.TWO].map((p) => (
          <div key={p} className="skill-player">
            <div className="skill-label">{TEXT.player} {p}</div>
            <div className="skill-group">
              <SkillRow
                kind="block"
                label={TEXT.block}
                player={p}
                count={state.players[p].blocksRemaining}
                active={p === state.turn}
                selected={sel && sel.type === 'block'}
                onClick={() => onBlockClick(p)}
              />
              <SkillRow
                kind="bomb"
                label={TEXT.bomb}
                player={p}
                count={state.players[p].bombsRemaining}
                active={p === state.turn}
                selected={sel && sel.type === 'bomb'}
                onClick={() => onBombClick(p)}
              />
            </div>
          </div>
        ))}
      </section>
    </aside>
  );
}

function SkillRow({ kind, label, player, count, active, selected, onClick }) {
  const image = kind === 'block' ? playerBlockImage(player) : playerBombImage(player);
  const slots = Array.from({ length: GAME.BLOCKS_PER_PLAYER });
  return (
    <div
      className={`skill-row${active ? ' active' : ''}${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      <span className="skill-kind">{label}</span>
      <div className="skill-slots">
        {slots.map((_, i) => (
          <img
            key={i}
            className={`skill-icon${i < count ? '' : ' used'}`}
            src={image}
            alt={`${label}-${player}`}
          />
        ))}
      </div>
    </div>
  );
}
