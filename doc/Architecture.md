# 系統架構（Architecture）

## 1. 架構總覽

```
┌─────────────────────────────────────────────────────┐
│                    瀏覽器（Client）                    │
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │              React 應用（SPA）                   │  │
│  │                                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │
│  │  │   App    │  │ Sidebar  │  │Chessboard│    │  │
│  │  │  (jsx)   │  │  (jsx)   │  │  (jsx)   │    │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘    │  │
│  │       │              │              │          │  │
│  │       ▼              ▼              ▼          │  │
│  │  ┌─────────────────────────────────────┐      │  │
│  │  │          useGame (hook)              │      │  │
│  │  │  ┌─────────────────────────────┐    │      │  │
│  │  │  │      useReducer              │    │      │  │
│  │  │  │  (state=Game, dispatch)      │    │      │  │
│  │  │  └──────────┬──────────────────┘    │      │  │
│  │  └─────────────┼───────────────────────┘      │  │
│  │                │                              │  │
│  │                ▼                              │  │
│  │  ┌─────────────────────────────────────┐      │  │
│  │  │        Game Engine（純邏輯）          │      │  │
│  │  │  ┌───────┐ ┌────────┐ ┌───────┐     │      │  │
│  │  │  │ Game  │ │ Player │ │ Cell  │     │      │  │
│  │  │  └───────┘ └────────┘ └───────┘     │      │  │
│  │  │       constants.js (列舉/設定)       │      │  │
│  │  └─────────────────────────────────────┘      │  │
│  └───────────────────────────────────────────────┘  │
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │              Vite 建置產物                       │  │
│  │  index.html + assets/*.js + assets/*.css       │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ GitHub Pages（純靜態託管）
                        │
┌─────────────────────────────────────────────────────┐
│                 GitHub Actions 管線                   │
│                                                       │
│  push to dev-001                                      │
│       │                                               │
│       ▼                                               │
│  auto-merge.yml                                       │
│       │                                               │
│       ├─ merge dev-001 → dev                          │
│       ├─ merge dev → main                             │
│       ├─ npm ci + npm run build                       │
│       └─ deploy dist/ → GitHub Pages                  │
└─────────────────────────────────────────────────────┘
```

## 2. 分層架構

本系統採嚴格的分層架構，依賴方向**單向向下**：

```
┌─────────────────────────────────────────────┐
│  第 3 層：UI 元件（src/components/）          │
│  App / Chessboard / Sidebar / Modal         │
│  職責：渲染、使用者互動、派發 action           │
│  規則：無狀態、不變更 props、透過 game.* 派發  │
└──────────────────┬──────────────────────────┘
                   │ 使用 useGame()
┌──────────────────▼──────────────────────────┐
│  第 2 層：狀態橋接（src/hooks/）              │
│  useGame                                    │
│  職責：useReducer 包裝引擎、提供 dispatcher  │
│  規則：唯一 React↔引擎橋接點、useCallback    │
└──────────────────┬──────────────────────────┘
                   │ 呼叫 Game 實例方法
┌──────────────────▼──────────────────────────┐
│  第 1 層：遊戲引擎（src/game/）               │
│  engine.js（Game / Player / Cell）          │
│  constants.js（列舉 / 設定 / 圖片）          │
│  職責：遊戲規則、狀態轉換                     │
│  規則：不可變 OOP、無 DOM、無 React import   │
└─────────────────────────────────────────────┘
```

### 分層規則

| 規則 | 說明 |
|------|------|
| 依賴方向 | 第 3 層 → 第 2 層 → 第 1 層，不可反向 |
| 引擎隔離 | `src/game/` 不可 import React、不可存取 DOM |
| 單一橋接 | `useGame` 是唯一連接 React 與引擎的程式碼 |
| 元件無狀態 | 元件不持有遊戲狀態，僅接收 `game` 並派發 |
| UI 狀態隔離 | 彈窗顯示等 UI 旗標以元件內 `useState` 管理，不放入 reducer |

## 3. 資料流

### 3.1 使用者操作資料流

```
使用者點擊
    │
    ▼
Chessboard.onCellClick(r, c)          ← 元件層判斷點擊語意
    │
    ▼
game.selectChess(r, c)                ← 呼叫 useGame 提供的 dispatcher
    │
    ▼
dispatch({ type: 'SELECT_CHESS', row, col })  ← useReducer dispatch
    │
    ▼
reducer → state.selectChess(row, col) ← 呼叫引擎方法
    │
    ▼
Game.clone() + 設定 selection         ← 引擎回傳新 Game 實例
    │
    ▼
React 觸發重渲染                       ← 新 state 注入元件
    │
    ▼
Chessboard 顯示選取高亮與可移動箭頭
```

### 3.2 動作完整生命週期（以移動棋子為例）

```
1. 玩家點擊己方棋子
   → game.selectChess(r, c)
   → Game.selectChess() 回傳新 Game（selection = { type:'chess', row, col }）

2. 玩家點擊可移動格
   → game.moveChess(toR, toC)
   → Game.moveChess():
     a. clone() 目前遊戲
     b. 原格設為 Cell.space()
     c. 若目標為 BOMB → 設為 Cell.explosion()
        若目標為 SPACE 且抵達底線 → player.scoreUp()，格子設為 space()
        若目標為 SPACE → 設為 Cell.chess(turn)
     d. 更新 players[turn]
     e. selection = null
     f. 若 score ≥ WINNING_SCORE → winner = turn
        否則 → turn = opponent
     g. 回傳新 Game

3. React 重渲染
   → Sidebar 更新分數條、技能格、回合面板顏色
   → Chessboard 更新棋盤格圖示
   → 若有 winner → App 顯示勝利彈窗
```

## 4. 部署架構

```
開發者本機                      GitHub                    使用者
┌──────────┐    git push    ┌──────────────┐    HTTPS   ┌──────┐
│ dev-001  │ ─────────────→ │ GitHub Repo  │ ─────────→ │ 瀏覽器 │
│ 分支      │                │              │            └──────┘
└──────────┘                │  dev-001     │               ▲
                            │  dev         │               │
                            │  main        │               │
                            └──────┬───────┘               │
                                   │                       │
                            ┌──────▼───────┐         ┌──────┴───────┐
                            │ GitHub Actions│         │ GitHub Pages │
                            │ auto-merge.yml│         │ (靜態託管)    │
                            └──────┬───────┘         └──────────────┘
                                   │                       ▲
                                   │ 1. merge cascade      │
                                   │ 2. npm ci             │
                                   │ 3. npm run build      │
                                   │ 4. upload dist/       │
                                   └───────────────────────┘
```

### 分支策略

| 分支 | 用途 | 保護狀態 | 推送者 |
|------|------|----------|--------|
| `dev-001` | 開發分支，唯一手動推送目標 | 無限制 | 開發者 |
| `dev` | 中繼分支 | **未受保護** | 僅管線（`GITHUB_TOKEN`） |
| `main` | 發布分支，部署來源 | **未受保護** | 僅管線（`GITHUB_TOKEN`） |

> `dev` 與 `main` 必須保持未受保護，`GITHUB_TOKEN` 才能推送。若新增保護規則，合併步驟會以 403 失敗。

## 5. 建置架構

### Vite 設定

| 設定 | 值 | 理由 |
|------|-----|------|
| `base` | `'./'` | 輸出相對資源 URL，支援 GitHub Pages 子路徑 |
| `assetsInclude` | `['**/*.PNG']` | 原始圖檔為大寫副檔名，Vite 預設不視為資源 |
| `plugins` | `[@vitejs/plugin-react()]` | JSX 編譯與 Fast Refresh |

### 建置產物

```
dist/
├── index.html              # HTML 入口（引用 hashed JS/CSS）
└── assets/
    ├── index-[hash].js     # 打包後 JS（含 React + 引擎 + 元件）
    └── index-[hash].css    # 打包後 CSS
```

### 圖片處理流程

```
src/assets/img/*.PNG（大寫副檔名）
    │
    ▼ ESM import
src/game/constants.js（IMAGES 對照表）
    │
    ▼ Vite 建置
dist/assets/[hash].png（雜湊命名，打包至 dist）
    │
    ▼ JS 中以 URL 字串引用
React 元件 <img src={...}> 或 style={{ backgroundImage }}
```

## 6. 技術棧

| 層 | 技術 | 版本 |
|----|------|------|
| UI 框架 | React | 18.3 |
| 建置工具 | Vite | 5.4 |
| 語言 | JavaScript（JSX） | ES2020+ |
| 模組系統 | ESM | — |
| CI/CD | GitHub Actions | — |
| 部署 | GitHub Pages | — |
| 版本控制 | Git | — |

### 無外部依賴（遊戲邏輯）

遊戲引擎（`src/game/`）不依賴任何 npm 套件，僅依賴 React 開發工具鏈。引擎可獨立於 React 使用。

## 7. 關鍵架構屬性

| 屬性 | 實現方式 |
|------|----------|
| **不可變性** | 引擎每個動作方法回傳新實例，`clone()` 深度複製 |
| **關注點分離** | 引擎／橋接／UI 三層嚴格隔離 |
| **單向資料流** | useReducer dispatch → engine method → new Game → re-render |
| **無副作用引擎** | 引擎無 DOM、無 React、無 I/O |
| **純靜態部署** | 無後端、無資料庫、無 API 呼叫 |
| **自動化管線** | 推送即觸發合併→建置→部署，無手動步驟 |
