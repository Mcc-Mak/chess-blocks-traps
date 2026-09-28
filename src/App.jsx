import { useState } from 'react';
import { useGame } from './hooks/useGame.js';
import { useI18n } from './i18n/LanguageContext.jsx';
import Chessboard from './components/Chessboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import Modal from './components/Modal.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';

export default function App() {
  const game = useGame();
  const { t } = useI18n();
  const [showRules, setShowRules] = useState(true);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">
          <span className="title-main">{t.appTitle}</span>
          <span className="title-sub">{t.appSubtitle}</span>
        </h1>
        <LanguageToggle />
      </header>

      <main className="layout">
        <Chessboard game={game} />
        <Sidebar game={game} />
      </main>

      {showRules && (
        <Modal title={t.rules} onClose={() => setShowRules(false)} closeLabel={t.start}>
          <ol className="rules">
            {t.rulesList.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </Modal>
      )}

      {game.state.winner && (
        <Modal title={t.victory} onClose={game.reset} closeLabel={t.newGame}>
          <p className="victory-text">
            {t.player} {game.state.winner} {t.wins}
          </p>
        </Modal>
      )}
    </div>
  );
}
