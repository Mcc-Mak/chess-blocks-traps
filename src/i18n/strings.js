export const LANG = {
  TC: 'tc',
  EN: 'en',
};

export const DEFAULT_LANG = LANG.TC;

export const STRINGS = {
  tc: {
    appTitle: '棋塊陷阱',
    appSubtitle: 'Chess Blocks & Traps',
    playerTurn: '玩家回合',
    player: '玩家',
    score: '分數',
    skill: '技能',
    block: '方塊',
    trap: '陷阱',
    rules: '遊戲規則',
    victory: '勝利',
    newGame: '再來一局',
    start: '開始遊戲',
    close: '關閉',
    wins: '獲勝！',
    langName: '繁體中文',
    switchTo: 'English',
    switchLabel: '切換語言',
    rulesList: [
      '每移動一枚棋子一次，即換下一玩家回合。',
      '每局雙方各獲 3 個方塊與 3 個陷阱；每回合最多各使用 1 個。',
      '棋子抵達對方底線即得 1 分。',
      '先達 5 分者勝！',
    ],
  },
  en: {
    appTitle: 'Chess Blocks & Traps',
    appSubtitle: '棋塊陷阱',
    playerTurn: 'Player Turn',
    player: 'Player',
    score: 'Score',
    skill: 'Skill',
    block: 'Block',
    trap: 'Trap',
    rules: 'Rules',
    victory: 'Victory',
    newGame: 'New Game',
    start: 'Start',
    close: 'Close',
    wins: 'wins!',
    langName: 'English',
    switchTo: '繁體中文',
    switchLabel: 'Switch language',
    rulesList: [
      'Next turn whenever any chess is moved once.',
      'Each player gets 3 blocks and 3 traps per game; at most 1 of each may be used each turn.',
      '1 point is earned when a chess reaches the opposite side.',
      'The first player to reach 5 points wins!',
    ],
  },
};
