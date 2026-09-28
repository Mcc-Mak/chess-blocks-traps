# 交叉參照矩陣（CRM, Cross-Reference Matrix）

本矩陣追蹤需求（PRD 使用者故事 / SRS 功能性需求）與實作元件、引擎方法、測試驗收之間的對應關係，確保需求可追溯、無遺漏。

---

## 1. 需求 → 實作對照表

### 欄位說明

| 欄位 | 說明 |
|------|------|
| **需求 ID** | PRD 使用者故事（US-x）或 SRS 功能性需求（FR-x） |
| **需求摘要** | 需求內容簡述 |
| **引擎方法** | `src/game/engine.js` 中對應的方法 |
| **Hook Action** | `src/hooks/useGame.js` 中對應的 action type |
| **元件** | 負責渲染或觸發的 React 元件 |
| **常數/設定** | `src/game/constants.js` 中相關的常數 |
| **文件參照** | 相關文件 |

---

### 對照表

| 需求 ID | 需求摘要 | 引擎方法 | Hook Action | 元件 | 常數/設定 | 文件參照 |
|---------|----------|----------|-------------|------|-----------|----------|
| **US-1** | 移動棋子（上下左右一格） | `Game.selectChess()`, `Game.movableTargets()`, `Game.moveChess()` | `SELECT_CHESS`, `CLEAR_SELECTION`, `MOVE_CHESS` | `Chessboard` | `CELL.CHESS`, `STATUS.UP/DOWN/LEFT/RIGHT` | PRD §US-1, SRS §FR-2, §FR-3, API §1.3, ER §4 |
| **US-2** | 放置方塊（空格或炸彈上） | `Game.selectBlock()`, `Game.placeBlock()` | `SELECT_BLOCK`, `PLACE_BLOCK` | `Sidebar`, `Chessboard` | `CELL.BLOCK`, `CELL.SPACE`, `CELL.BOMB`, `GAME.BLOCKS_PER_PLAYER` | PRD §US-2, SRS §FR-4, API §1.2, §1.3 |
| **US-3** | 放置隱形炸彈（僅空格） | `Game.selectBomb()`, `Game.placeBomb()` | `SELECT_BOMB`, `PLACE_BOMB` | `Sidebar`, `Chessboard` | `CELL.BOMB`, `CELL.SPACE`, `GAME.BOMBS_PER_PLAYER` | PRD §US-3, SRS §FR-5, API §1.2, §1.3 |
| **US-4** | 計分與勝利（抵達底線 +5 分勝） | `Game.moveChess()`（得分邏輯） | `MOVE_CHESS` | `Chessboard`, `App`（勝利彈窗） | `GAME.WINNING_SCORE`, `GAME.GOAL_COLUMNS` | PRD §US-4, SRS §FR-6, Schema §2, ER §4 |
| **US-5** | 回合切換提示（色彩切換） | `Game.turn`（getter）, `Game.opponent` | —（由 state 驅動） | `Sidebar` | `PLAYER.ONE`, `PLAYER.TWO` | PRD §US-5, SRS §FR-7, ADR §ADR-008 |
| **US-6** | 規則說明彈窗 | —（UI 層 `useState`） | — | `App`, `Modal` | — | PRD §US-6, SRS §FR-10, API §3.1, §3.4 |
| **FR-1** | 遊戲初始化 | `Game.initial()` | `RESET` | `App`（透過 `useGame` 初始化） | `BOARD.ROWS/COLUMNS`, `GAME.*`, `PLAYER.*` | SRS §FR-1, API §1.3, Schema §5 |
| **FR-2** | 棋子選擇與取消 | `Game.selectChess()`, `Game.clearSelection()` | `SELECT_CHESS`, `CLEAR_SELECTION` | `Chessboard` | `CELL.CHESS` | SRS §FR-2, API §1.3 |
| **FR-3** | 棋子移動規則（含炸彈引爆） | `Game.moveChess()`, `Game.movableTargets()` | `MOVE_CHESS` | `Chessboard` | `CELL.SPACE`, `CELL.BOMB`, `CELL.EXPLOSION` | SRS §FR-3, ER §4, ADR §ADR-004 |
| **FR-4** | 方塊放置規則 | `Game.selectBlock()`, `Game.placeBlock()`, `Player.canBlock`, `Player.useBlock()` | `SELECT_BLOCK`, `PLACE_BLOCK` | `Sidebar`, `Chessboard` | `CELL.BLOCK`, `GAME.BLOCKS_PER_PLAYER` | SRS §FR-4, API §1.2, §1.3 |
| **FR-5** | 炸彈放置規則 | `Game.selectBomb()`, `Game.placeBomb()`, `Player.canBomb`, `Player.useBomb()` | `SELECT_BOMB`, `PLACE_BOMB` | `Sidebar`, `Chessboard` | `CELL.BOMB`, `GAME.BOMBS_PER_PLAYER` | SRS §FR-5, API §1.2, §1.3 |
| **FR-6** | 計分與勝利判定 | `Game.moveChess()`（scoreUp + winner）, `Player.scoreUp()` | `MOVE_CHESS` | `Chessboard`, `App` | `GAME.WINNING_SCORE`, `GAME.GOAL_COLUMNS` | SRS §FR-6, Schema §2, ER §4 |
| **FR-7** | 回合面板色彩切換 | `Game.turn` | —（state 驅動） | `Sidebar` | `PLAYER.ONE`, `PLAYER.TWO` | SRS §FR-7, ADR §ADR-008 |
| **FR-8** | 計分進度條 | `Player.score` | —（state 驅動） | `Sidebar` | `GAME.WINNING_SCORE` | SRS §FR-8 |
| **FR-9** | 技能格剩餘數顯示 | `Player.blocksRemaining`, `Player.bombsRemaining` | —（state 驅動） | `Sidebar`（`SkillRow`） | `GAME.BLOCKS_PER_PLAYER` | SRS §FR-9, API §3.5 |
| **FR-10** | 規則彈窗 | — | — | `App`, `Modal` | — | SRS §FR-10, API §3.4 |
| **FR-11** | 遊戲重置 | `Game.initial()` | `RESET` | `App` | — | SRS §FR-11, API §1.3 |

---

## 2. 引擎方法 → 需求對照表

確保每個引擎方法都有對應的需求，無孤立程式碼。

| 引擎方法 | 對應需求 | 使用者場景 |
|----------|----------|------------|
| `Game.initial()` | FR-1, FR-11 | 遊戲開始／重置 |
| `Game.clone()` | （內部基礎設施） | 所有動作方法的基礎 |
| `Game.selectChess()` | US-1, FR-2 | 玩家點擊己方棋子 |
| `Game.clearSelection()` | US-1, FR-2 | 玩家再次點擊已選棋子 |
| `Game.selectBlock()` | US-2, FR-4 | 玩家點擊方塊技能格 |
| `Game.selectBomb()` | US-3, FR-5 | 玩家點擊炸彈技能格 |
| `Game.moveChess()` | US-1, US-4, FR-3, FR-6 | 玩家移動棋子（含引爆、計分、勝利） |
| `Game.placeBlock()` | US-2, FR-4 | 玩家放置方塊 |
| `Game.placeBomb()` | US-3, FR-5 | 玩家放置炸彈 |
| `Game.movableTargets()` | US-1, FR-3 | 棋盤顯示可移動方向箭頭 |
| `Player.useBlock()` | US-2, FR-4 | 方塊剩餘數 -1 |
| `Player.useBomb()` | US-3, FR-5 | 炸彈剩餘數 -1 |
| `Player.scoreUp()` | US-4, FR-6 | 分數 +1 |
| `Cell.*`（工廠方法） | FR-1, FR-3, FR-4, FR-5 | 格子狀態轉換 |

---

## 3. 常數 → 使用位置對照表

確保每個常數都被使用，無死常數。

| 常數 | 定義位置 | 使用於（引擎方法） | 使用於（元件） |
|------|----------|-------------------|----------------|
| `CELL.SPACE` | constants.js | `Game.initial()`, `Game.moveChess()`, `Game.placeBlock()`, `Game.placeBomb()`, `Game.movableTargets()` | `Chessboard.renderCell()` |
| `CELL.CHESS` | constants.js | `Game.initial()`, `Game.selectChess()`, `Game.moveChess()`, `Game.movableTargets()` | `Chessboard.onCellClick()`, `Chessboard.renderCell()` |
| `CELL.BOMB` | constants.js | `Game.placeBomb()`, `Game.placeBlock()`, `Game.moveChess()`, `Game.movableTargets()` | `Chessboard.renderCell()` |
| `CELL.BLOCK` | constants.js | `Game.placeBlock()` | `Chessboard.renderCell()` |
| `CELL.EXPLOSION` | constants.js | `Game.moveChess()` | `Chessboard.renderCell()` |
| `STATUS.UP/DOWN/LEFT/RIGHT` | constants.js | `Game.movableTargets()` | `Chessboard.renderCell()`（透過 `directionImage()`） |
| `PLAYER.NONE` | constants.js | `Cell` 建構子預設值 | — |
| `PLAYER.ONE` | constants.js | `Game.initial()`, `Game.opponent` | `Sidebar` |
| `PLAYER.TWO` | constants.js | `Game.opponent` | `Sidebar` |
| `BOARD.ROWS` | constants.js | `Game.initial()` | `Chessboard`（棋盤渲染） |
| `BOARD.COLUMNS` | constants.js | `Game.initial()`, `Game.movableTargets()` | `Chessboard` |
| `GAME.WINNING_SCORE` | constants.js | `Game.moveChess()` | `Sidebar`（進度條） |
| `GAME.BLOCKS_PER_PLAYER` | constants.js | `Player` 建構子預設值 | `Sidebar`（技能格數） |
| `GAME.BOMBS_PER_PLAYER` | constants.js | `Player` 建構子預設值 | — |
| `GAME.GOAL_COLUMNS` | constants.js | `Game.moveChess()` | — |

---

## 4. 元件 → 職責對照表

| 元件 | 檔案 | 職責 | 對應需求 |
|------|------|------|----------|
| `App` | `src/App.jsx` | 頂層版面、規則彈窗、勝利彈窗 | FR-1, FR-6, FR-10, FR-11 |
| `Chessboard` | `src/components/Chessboard.jsx` | 棋盤渲染、格子點擊、可移動箭頭 | US-1, US-2, US-3, FR-2, FR-3, FR-4, FR-5 |
| `Sidebar` | `src/components/Sidebar.jsx` | 回合面板、計分條、技能格 | US-5, FR-7, FR-8, FR-9 |
| `SkillRow` | `src/components/Sidebar.jsx`（內部） | 單列技能格顯示 | FR-9 |
| `Modal` | `src/components/Modal.jsx` | 通用彈窗 | FR-10, FR-6 |

---

## 5. ADR → 影響範圍對照表

| ADR | 決策 | 影響的程式碼 | 影響的文件 |
|-----|------|-------------|------------|
| ADR-001 | React + Vite | 全專案 | Architecture §6, QuickStart |
| ADR-002 | 不可變 OOP 引擎 | `src/game/engine.js` | Architecture §2, §7, API §1, ER |
| ADR-003 | useReducer 橋接 | `src/hooks/useGame.js` | Architecture §2, §3, API §2 |
| ADR-004 | 每回合一動作 | `src/game/engine.js`（`Game`/`Player`） | PRD §US-1~3, SRS §FR-3~5 |
| ADR-005 | 移除 i18n | 全元件 `TEXT` 常數 | SRS §NFR-3, AGENTS.md |
| ADR-006 | trap→bomb 更名 | `constants.js`, `engine.js` | Schema §1.1, API §1 |
| ADR-007 | 單一 Actions 管線 | `.github/workflows/auto-merge.yml` | Architecture §4, QuickStart §5 |
| ADR-008 | 回合面板色彩 | `Sidebar.jsx`, `styles.css` | PRD §US-5, SRS §FR-7 |
