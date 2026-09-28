import { useState } from 'react';
import { useGame } from './hooks/useGame.js';
import Chessboard from './components/Chessboard.jsx';
import Sidebar from './components/Sidebar.jsx';
import Modal from './components/Modal.jsx';

export default function App() {
  const game = useGame();
  const [showRules, setShowRules] = useState(true);

  return (
    <div className="app">
      <h1 className="title">
        <u>Anonymous Chessboard</u>
      </h1>

      <main className="layout">
        <Chessboard game={game} />
        <Sidebar game={game} />
      </main>

      {showRules && (
        <Modal title="Rules" onClose={() => setShowRules(false)} closeLabel="Start">
          <ol className="rules">
            <li>Next turn whenever any chess is moved once.</li>
            <li>
              3 traps and 3 blocks are given to each player per game; 1 trap and
              1 block may be used each turn.
            </li>
            <li>1 point is obtained for reaching the opposite side.</li>
            <li>Victory goes to the player who first reaches 5 points!</li>
          </ol>
        </Modal>
      )}

      {game.state.winner && (
        <Modal
          title="Victory"
          onClose={game.reset}
          closeLabel="New Game"
        >
          <p className="victory-text">Player {game.state.winner} wins!</p>
        </Modal>
      )}
    </div>
  );
}
