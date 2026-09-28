import { useState } from 'react';
import { useGame } from './hooks/useGame.js';
import Chessboard from './components/Chessboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import Modal from './components/Modal.jsx';

const TEXT = {
  title: '棋塊陷阱',
  rules: '遊戲規則',
  start: '開始遊戲',
  victory: '勝利',
  newGame: '再來一局',
  wins: '獲勝！',
  player: '玩家',
  rulesList: [
    '每回合僅能執行一項動作：移動棋子、放置方塊或放置炸彈。',
    '每局雙方各獲 3 個方塊與 3 個炸彈。',
    '棋子抵達對方底線即得 1 分。',
    '先達 5 分者勝！',
  ],
};

export default function App() {
  const game = useGame();
  const [showRules, setShowRules] = useState(true);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">{TEXT.title}</h1>
      </header>

      <main className="layout">
        <Sidebar game={game} />
        <Chessboard game={game} />
      </main>

      {showRules && (
        <Modal title={TEXT.rules} onClose={() => setShowRules(false)} closeLabel={TEXT.start}>
          <ol className="rules">
            {TEXT.rulesList.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </Modal>
      )}

      {game.state.winner && (
        <Modal title={TEXT.victory} onClose={game.reset} closeLabel={TEXT.newGame}>
          <p className="victory-text">
            {TEXT.player} {game.state.winner} {TEXT.wins}
          </p>
        </Modal>
      )}
    </div>
  );
}
