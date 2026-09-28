# 實體關係圖（ER）

本文件描述遊戲引擎中各實體之間的關係。

---

## 1. 實體總覽

```
┌─────────────┐     1    N ┌─────────┐
│    Game     │────────────│  Cell   │
│             │  contains  │         │
│ turn        │  (board)   │ value   │
│ winner      │            │ name    │
│ selection   │            └─────────┘
│             │
│             │     1    2 ┌─────────┐
│             │────────────│ Player  │
│             │  has       │         │
└─────────────┘            │ score   │
                           │ blocks  │
                           │ bombs   │
                           └─────────┘
```

---

## 2. 關係說明

### Game ↔ Cell（1 : N）

- 一個 `Game` 持有一個 `board`，為 `Cell[8][8]` 二維陣列。
- 棋盤共 64 格，每格為一個 `Cell` 實例。
- `Game.clone()` 會對每一格 `Cell` 執行 `clone()`，建立全新的棋盤副本。

```
Game.board: Cell[BOARD.ROWS][BOARD.COLUMNS]
           = Cell[8][8]
           = 64 個 Cell 實例
```

### Game ↔ Player（1 : 2）

- 一個 `Game` 持有 `players` 物件，包含兩個 `Player` 實例。
- 鍵為 `PLAYER.ONE`（1）與 `PLAYER.TWO`（2）。

```
Game.players: {
  [PLAYER.ONE]:  Player   // 玩家一
  [PLAYER.TWO]:  Player   // 玩家二
}
```

- `Game.clone()` 會對兩個 `Player` 各執行 `clone()`。
- `Game.currentPlayer` getter 回傳 `players[turn]`。
- 動作方法透過 `next.players[next.turn] = next.currentPlayer.useBlock()` 更新玩家狀態。

### Cell ↔ PLAYER（N : 1，弱關聯）

- `Cell.name` 標記格子的所有者玩家。
- 僅 `CELL.CHESS` 與 `CELL.BLOCK` 的 `name` 為有效玩家（`PLAYER.ONE` 或 `PLAYER.TWO`）。
- `CELL.SPACE`、`CELL.BOMB`、`CELL.EXPLOSION` 的 `name` 為 `PLAYER.NONE`（-1）。

---

## 3. 實體生命週期

### Game

```
Game.initial()  ──→  new Game({...})
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   selectChess()     selectBlock()      selectBomb()
        │                 │                 │
        ▼                 ▼                 ▼
   moveChess()       placeBlock()       placeBomb()
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                   clone() → 新 Game
                   （回合切換或勝利）
```

### Cell

```
Cell.space()  ←─  初始空格 / 棋子離開後 / 得分後
Cell.chess(p) ←─  初始棋子 / 棋子移入
Cell.bomb()   ←─  玩家放置炸彈
Cell.block(p) ←─  玩家放置方塊
Cell.explosion() ←─ 棋子踩到炸彈
```

### Player

```
new Player()  ──→  { score: 0, blocks: 3, bombs: 3 }
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     useBlock()       useBomb()       scoreUp()
          │               │               │
          ▼               ▼               ▼
    blocks - 1        bombs - 1       score + 1
```

---

## 4. 狀態轉換矩陣

### 棋盤格子狀態轉換

| 原始狀態 | 動作 | 結果狀態 | 說明 |
|----------|------|----------|------|
| SPACE | `placeBlock` | BLOCK | 玩家放置方塊 |
| SPACE | `placeBomb` | BOMB | 玩家放置炸彈 |
| SPACE | `moveChess`（移入） | CHESS | 棋子移入空格 |
| BOMB | `placeBlock` | BLOCK | 方塊覆蓋炸彈 |
| BOMB | `moveChess`（移入） | EXPLOSION | 棋子踩到炸彈，引爆 |
| CHESS | `moveChess`（移出） | SPACE | 棋子離開原格 |
| CHESS | `moveChess`（移入底線） | SPACE | 棋子得分後消失 |
| BLOCK | — | BLOCK | 不可變（永久障礙） |
| EXPLOSION | — | EXPLOSION | 不可變（永久殘骸） |

### 回合轉換

```
PLAYER.ONE  ──動作完成──→  PLAYER.TWO
PLAYER.TWO  ──動作完成──→  PLAYER.ONE

（若任一玩家分數 ≥ WINNING_SCORE，則不切換回合，設置 winner）
```
