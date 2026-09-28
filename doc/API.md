# API 文件

本文件描述遊戲引擎、Hook、元件的完整介面。

---

## 1. 引擎類別（`src/game/engine.js`）

### 1.1 `Cell`

代表棋盤上一格。

#### 建構子

```js
new Cell(value, name = PLAYER.NONE)
```

| 參數 | 型別 | 說明 |
|------|------|------|
| `value` | `CELL` | 格子類型 |
| `name` | `PLAYER` | 所有者玩家（僅 `CHESS`／`BLOCK` 使用） |

#### 實例屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `value` | `CELL` | 格子類型 |
| `name` | `PLAYER` | 所有者 |

#### 靜態工廠方法

| 方法 | 回傳 | 說明 |
|------|------|------|
| `Cell.space()` | `Cell` | 建立空格 |
| `Cell.chess(player)` | `Cell` | 建立玩家棋子格 |
| `Cell.bomb()` | `Cell` | 建立隱形炸彈格 |
| `Cell.block(player)` | `Cell` | 建立方塊格 |
| `Cell.explosion()` | `Cell` | 建立爆炸殘骸格 |

#### 實例方法

| 方法 | 回傳 | 說明 |
|------|------|------|
| `clone()` | `Cell` | 建立相同值與所有者的新實例 |

---

### 1.2 `Player`

代表一名玩家的狀態。

#### 建構子

```js
new Player({ score = 0, blocksRemaining = GAME.BLOCKS_PER_PLAYER, bombsRemaining = GAME.BOMBS_PER_PLAYER })
```

#### 實例屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `score` | `number` | 當前分數 |
| `blocksRemaining` | `number` | 剩餘方塊數 |
| `bombsRemaining` | `number` | 剩餘炸彈數 |

#### Getter

| Getter | 型別 | 說明 |
|--------|------|------|
| `canBlock` | `boolean` | 是否還能放置方塊 |
| `canBomb` | `boolean` | 是否還能放置炸彈 |

#### 實例方法

| 方法 | 回傳 | 說明 |
|------|------|------|
| `clone()` | `Player` | 建立相同狀態的新實例 |
| `useBlock()` | `Player` | 回傳 `blocksRemaining - 1` 的新實例 |
| `useBomb()` | `Player` | 回傳 `bombsRemaining - 1` 的新實例 |
| `scoreUp()` | `Player` | 回傳 `score + 1` 的新實例 |

---

### 1.3 `Game`

代表整局遊戲的狀態。

#### 建構子

```js
new Game({ turn = PLAYER.ONE, winner = null, board, players, selection = null })
```

#### 實例屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `turn` | `PLAYER` | 當前回合玩家 |
| `winner` | `PLAYER \| null` | 獲勝玩家（遊戲進行中為 `null`） |
| `board` | `Cell[][]` | 8×8 棋盤二維陣列 |
| `players` | `{ [PLAYER.ONE]: Player, [PLAYER.TWO]: Player }` | 雙方玩家狀態 |
| `selection` | `Selection \| null` | 當前選取狀態 |

#### Selection 物件

```ts
type Selection =
  | { type: 'chess', row: number, col: number }
  | { type: 'block' }
  | { type: 'bomb' }
```

#### Getter

| Getter | 型別 | 說明 |
|--------|------|------|
| `currentPlayer` | `Player` | 當前回合玩家的 `Player` 實例 |
| `opponent` | `PLAYER` | 對手玩家的 `PLAYER` 列舉值 |

#### 靜態方法

| 方法 | 回傳 | 說明 |
|------|------|------|
| `Game.initial()` | `Game` | 建立初始遊戲狀態 |

#### 實例方法

| 方法 | 參數 | 回傳 | 說明 |
|------|------|------|------|
| `clone()` | — | `Game` | 深度複製遊戲狀態 |
| `movableTargets(row, col)` | `row: number, col: number` | `{ row, col, status }[]` | 回傳指定棋子的可移動目標格列表 |
| `selectChess(row, col)` | `row: number, col: number` | `Game` | 選取己方棋子 |
| `clearSelection()` | — | `Game` | 取消選取 |
| `selectBlock()` | — | `Game` | 選擇方塊技能 |
| `selectBomb()` | — | `Game` | 選擇炸彈技能 |
| `moveChess(toRow, toCol)` | `toRow: number, toCol: number` | `Game` | 移動已選棋子至目標格 |
| `placeBlock(row, col)` | `row: number, col: number` | `Game` | 在指定格放置方塊 |
| `placeBomb(row, col)` | `row: number, col: number` | `Game` | 在指定格放置炸彈 |

> **注意**：所有動作方法回傳新 `Game` 實例，接收者不變。若動作不合法（如非己方棋子、目標格不可達、資源不足），回傳原實例（`this`）。

---

## 2. React Hook（`src/hooks/useGame.js`）

### `useGame()`

React 與引擎之間的唯一橋接。

#### 回傳值

```js
{
  state,            // Game — 當前遊戲狀態
  reset,            // () => void — 重置遊戲
  selectChess,      // (row, col) => void
  clearSelection,   // () => void
  selectBlock,      // () => void
  selectBomb,       // () => void
  moveChess,        // (row, col) => void
  placeBlock,       // (row, col) => void
  placeBomb,        // (row, col) => void
}
```

所有 dispatcher 均以 `useCallback` 記憶化，參考穩定。

#### Action 類型

| Action Type | Payload | 對應引擎方法 |
|-------------|---------|-------------|
| `RESET` | — | `Game.initial()` |
| `SELECT_CHESS` | `{ row, col }` | `state.selectChess(row, col)` |
| `CLEAR_SELECTION` | — | `state.clearSelection()` |
| `SELECT_BLOCK` | — | `state.selectBlock()` |
| `SELECT_BOMB` | — | `state.selectBomb()` |
| `MOVE_CHESS` | `{ row, col }` | `state.moveChess(row, col)` |
| `PLACE_BLOCK` | `{ row, col }` | `state.placeBlock(row, col)` |
| `PLACE_BOMB` | `{ row, col }` | `state.placeBomb(row, col)` |

---

## 3. React 元件

### 3.1 `App`（`src/App.jsx`）

頂層版面元件。

| Prop | 型別 | 說明 |
|------|------|------|
| — | — | 無 props，內部使用 `useGame` |

內部管理 `showRules`（`useState`）控制規則彈窗顯示。

### 3.2 `Chessboard`（`src/components/Chessboard.jsx`）

棋盤渲染與格子點擊處理。

| Prop | 型別 | 說明 |
|------|------|------|
| `game` | `useGame()` 回傳值 | 遊戲狀態與 dispatcher |

### 3.3 `Sidebar`（`src/components/Sidebar.jsx`）

左側邊欄：回合面板、計分、技能格。

| Prop | 型別 | 說明 |
|------|------|------|
| `game` | `useGame()` 回傳值 | 遊戲狀態與 dispatcher |

### 3.4 `Modal`（`src/components/Modal.jsx`）

通用彈窗元件。

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `title` | `string \| null` | — | 彈窗標題 |
| `onClose` | `() => void` | — | 關閉回調 |
| `children` | `ReactNode` | — | 彈窗內容 |
| `closeLabel` | `string` | `'關閉'` | 關閉按鈕文字 |

### 3.5 `SkillRow`（`src/components/Sidebar.jsx` 內部元件）

技能格列。

| Prop | 型別 | 說明 |
|------|------|------|
| `kind` | `'block' \| 'bomb'` | 技能類型 |
| `label` | `string` | 顯示標籤 |
| `player` | `PLAYER` | 玩家 |
| `count` | `number` | 剩餘數 |
| `active` | `boolean` | 是否為當前回合玩家 |
| `selected` | `boolean` | 是否已選取 |
| `onClick` | `() => void` | 點擊回調 |
