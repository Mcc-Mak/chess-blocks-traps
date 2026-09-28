# 資料結構綱要（Schema）

本文件定義所有列舉常數、設定值與遊戲狀態形狀。

---

## 1. 列舉常數

### 1.1 `CELL`（格子類型）

定義於 `src/game/constants.js`。

| 成員 | 值 | 說明 |
|------|----|------|
| `CELL.SPACE` | `0` | 空格 |
| `CELL.CHESS` | `1` | 棋子 |
| `CELL.BOMB` | `2` | 隱形炸彈（棋盤上不可見） |
| `CELL.BLOCK` | `3` | 方塊（可見障礙物） |
| `CELL.EXPLOSION` | `4` | 爆炸殘骸（不可通行） |

### 1.2 `STATUS`（移動方向與狀態）

| 成員 | 值 | 說明 |
|------|----|------|
| `STATUS.DEFAULT` | `'DEFAULT'` | 預設 |
| `STATUS.CLICKED` | `'CLICKED'` | 已點擊 |
| `STATUS.UP` | `'UP'` | 向上移動 |
| `STATUS.DOWN` | `'DOWN'` | 向下移動 |
| `STATUS.LEFT` | `'LEFT'` | 向左移動 |
| `STATUS.RIGHT` | `'RIGHT'` | 向右移動 |

### 1.3 `PLAYER`（玩家識別）

| 成員 | 值 | 說明 |
|------|----|------|
| `PLAYER.NONE` | `-1` | 無玩家（空格所有者） |
| `PLAYER.ONE` | `1` | 玩家一（藍色） |
| `PLAYER.TWO` | `2` | 玩家二（紅色） |

### 1.4 `BOARD`（棋盤尺寸）

| 成員 | 值 | 說明 |
|------|----|------|
| `BOARD.ROWS` | `8` | 棋盤列數 |
| `BOARD.COLUMNS` | `8` | 棋盤行數 |

---

## 2. 遊戲設定值 `GAME`

定義於 `src/game/constants.js`。

| 成員 | 值 | 說明 |
|------|----|------|
| `WINNING_SCORE` | `5` | 獲勝所需分數 |
| `BLOCKS_PER_PLAYER` | `3` | 每位玩家每局方塊數 |
| `BOMBS_PER_PLAYER` | `3` | 每位玩家每局炸彈數 |
| `GOAL_COLUMNS` | `{ 1: 7, 2: 0 }` | 各玩家的底線欄索引（玩家一目標為 H 欄，玩家二目標為 A 欄） |

---

## 3. 圖片資源 `IMAGES`

定義於 `src/game/constants.js`，透過 ESM import 引入。

| 鍵 | 檔案 | 說明 |
|----|------|------|
| `PLAYER_1` | `PLAYER_1.PNG` | 玩家一棋子圖 |
| `PLAYER_2` | `PLAYER_2.PNG` | 玩家二棋子圖 |
| `BLOCK_1` | `BLOCK_1.PNG` | 玩家一方塊圖 |
| `BLOCK_2` | `BLOCK_2.PNG` | 玩家二方塊圖 |
| `BOMB_1` | `BOMB_1.PNG` | 玩家一炸彈圖（側邊欄顯示用） |
| `BOMB_2` | `BOMB_2.PNG` | 玩家二炸彈圖（側邊欄顯示用） |
| `UP` | `UP.PNG` | 向上箭頭 |
| `DOWN` | `DOWN.PNG` | 向下箭頭 |
| `LEFT` | `LEFT.PNG` | 向左箭頭 |
| `RIGHT` | `RIGHT.PNG` | 向右箭頭 |
| `EXPLOSION` | `EXPLOSION.PNG` | 爆炸圖示 |

### 圖片輔助函式

| 函式 | 參數 | 回傳 | 說明 |
|------|------|------|------|
| `playerChessImage(player)` | `PLAYER` | `string` | 玩家棋子圖 URL |
| `playerBlockImage(player)` | `PLAYER` | `string` | 玩家方塊圖 URL |
| `playerBombImage(player)` | `PLAYER` | `string` | 玩家炸彈圖 URL |
| `directionImage(status)` | `STATUS` | `string` | 方向箭頭圖 URL |

---

## 4. 遊戲狀態形狀

### 4.1 `Game` 實例

```
Game {
  turn:        PLAYER                        // 當前回合玩家
  winner:      PLAYER | null                 // 獲勝者（遊戲中為 null）
  board:       Cell[8][8]                    // 8×8 棋盤
  players:     { 1: Player, 2: Player }      // 雙方玩家狀態
  selection:   Selection | null              // 當前選取
}
```

### 4.2 `Cell` 實例

```
Cell {
  value:  CELL      // 格子類型
  name:   PLAYER    // 所有者（SPACE/BOMB/EXPLOSION 為 NONE）
}
```

### 4.3 `Player` 實例

```
Player {
  score:           number    // 當前分數
  blocksRemaining: number    // 剩餘方塊數
  bombsRemaining:  number    // 剩餘炸彈數
}
```

### 4.4 `Selection` 物件

```
// 選取棋子
{ type: 'chess', row: number, col: number }

// 選取方塊技能
{ type: 'block' }

// 選取炸彈技能
{ type: 'bomb' }
```

---

## 5. 初始棋盤配置

```
     A    B    C    D    E    F    G    H
  ┌────┬────┬────┬────┬────┬────┬────┬────┐
8 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
7 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
6 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
5 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
4 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
3 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
2 │ P1 │    │    │    │    │    │    │ P2 │
  ├────┼────┼────┼────┼────┼────┼────┼────┤
1 │ P1 │    │    │    │    │    │    │ P2 │
  └────┴────┴────┴────┴────┴────┴────┴────┘

P1 = 玩家一棋子（A 欄）    P2 = 玩家二棋子（H 欄）
```

- 玩家一目標：抵達 H 欄（索引 7）得 1 分。
- 玩家二目標：抵達 A 欄（索引 0）得 1 分。
- 玩家一先行。
