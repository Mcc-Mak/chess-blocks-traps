import {
  PLAYER,
  GAME,
  playerChessImage,
  playerBlockImage,
  playerTrapImage,
} from '../game/constants.js';
import { useI18n } from '../i18n/LanguageContext.jsx';

export default function Sidebar({ game }) {
  const { t } = useI18n();
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
      <section className="panel panel-turn">
        <h2 className="panel-title">{t.playerTurn}</h2>
        <div className="turn-display">
          <img className="turn-img" src={playerChessImage(state.turn)} alt={t.player} />
          <span className="turn-name">{t.player} {state.turn}</span>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">{t.score}</h2>
        <div className="score-row">
          <span className="score-label">
            <img className="score-chip" src={playerChessImage(PLAYER.ONE)} alt="" />
            {t.player} 1
          </span>
          <strong className="score-value">{state.players[PLAYER.ONE].score}</strong>
        </div>
        <div className="score-bar">
          <div
            className="score-bar-fill p1"
            style={{ width: `${(state.players[PLAYER.ONE].score / GAME.END_SCORE) * 100}%` }}
          />
        </div>
        <div className="score-row">
          <span className="score-label">
            <img className="score-chip" src={playerChessImage(PLAYER.TWO)} alt="" />
            {t.player} 2
          </span>
          <strong className="score-value">{state.players[PLAYER.TWO].score}</strong>
        </div>
        <div className="score-bar">
          <div
            className="score-bar-fill p2"
            style={{ width: `${(state.players[PLAYER.TWO].score / GAME.END_SCORE) * 100}%` }}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">{t.skill}</h2>
        {[PLAYER.ONE, PLAYER.TWO].map((p) => (
          <div key={p} className="skill-player">
            <div className="skill-label">{t.player} {p}</div>
            <div className="skill-group">
              <SkillRow
                kind="block"
                label={t.block}
                player={p}
                count={state.players[p].blockPerGame}
                active={p === state.turn}
                selected={sel && sel.type === 'block'}
                onClick={() => onBlockClick(p)}
              />
              <SkillRow
                kind="trap"
                label={t.trap}
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

const GAME_END = 5;

function SkillRow({ kind, label, player, count, active, selected, onClick }) {
  const image = kind === 'block' ? playerBlockImage(player) : playerTrapImage(player);
  const slots = Array.from({ length: 3 });
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
