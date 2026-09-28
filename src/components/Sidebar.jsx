import {
  PLAYER,
  playerChessImage,
  playerBlockImage,
  playerTrapImage,
} from '../game/constants.js';

export default function Sidebar({ game }) {
  const { state } = game;
  const sel = state.selection;

  function onBlockClick(player) {
    if (state.winner || player !== state.turn) return;
    if (!sel) game.selectBlock();
    else if (sel.type === 'block') game.clearSelection();
  }

  function onTrapClick(player) {
    if (state.winner || player !== state.turn) return;
    if (!sel) game.selectTrap();
    else if (sel.type === 'trap') game.clearSelection();
  }

  return (
    <aside className="sidebar">
      <section className="panel">
        <h2>Player Turn</h2>
        <img className="turn-img" src={playerChessImage(state.turn)} alt="Player" />
        <p>Player {state.turn}</p>
      </section>

      <section className="panel">
        <h2>Score</h2>
        <div className="score-row">
          <span>Player 1</span>
          <strong>{state.players[PLAYER.ONE].score}</strong>
        </div>
        <div className="score-row">
          <span>Player 2</span>
          <strong>{state.players[PLAYER.TWO].score}</strong>
        </div>
      </section>

      <section className="panel">
        <h2>Skill</h2>

        {[PLAYER.ONE, PLAYER.TWO].map((p) => (
          <div key={p} className="skill-player">
            <div className="skill-label">Player {p}</div>
            <div className="skill-group">
              <SkillRow
                kind="block"
                player={p}
                count={state.players[p].blockPerGame}
                active={p === state.turn}
                selected={sel && sel.type === 'block'}
                onClick={() => onBlockClick(p)}
              />
              <SkillRow
                kind="trap"
                player={p}
                count={state.players[p].trapPerGame}
                active={p === state.turn}
                selected={sel && sel.type === 'trap'}
                onClick={() => onTrapClick(p)}
              />
            </div>
          </div>
        ))}
      </section>
    </aside>
  );
}

function SkillRow({ kind, player, count, active, selected, onClick }) {
  const image = kind === 'block' ? playerBlockImage(player) : playerTrapImage(player);
  const slots = Array.from({ length: 3 });
  return (
    <div
      className={`skill-row${active ? ' active' : ''}${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {slots.map((_, i) => (
        <img
          key={i}
          className={`skill-icon${i < count ? '' : ' used'}`}
          src={image}
          alt={`${kind}-${player}`}
        />
      ))}
    </div>
  );
}
