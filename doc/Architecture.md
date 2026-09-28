# 系統架構（Architecture）

## 1. 架構總覽

```mermaid
flowchart TB
    subgraph Client["瀏覽器 Client"]
        subgraph ReactApp["React 應用 SPA"]
            App["App.jsx"]
            Sidebar["Sidebar.jsx"]
            Chessboard["Chessboard.jsx"]
            Modal["Modal.jsx"]

            subgraph Bridge["狀態橋接層"]
                useGame["useGame hook"]
                Reducer["useReducer\nstate=Game, dispatch"]
                useGame --> Reducer
            end

            subgraph Engine["遊戲引擎 純邏輯"]
                Game["Game"]
                Player["Player"]
                Cell["Cell"]
                Constants["constants.js\n列舉/設定/圖片"]
                Game --> Player
                Game --> Cell
                Game --> Constants
            end

            App --> useGame
            App --> Sidebar
            App --> Chessboard
            App --> Modal
            Sidebar --> useGame
            Chessboard --> useGame
            Reducer --> Game
        end

        Build["Vite 建置產物\nindex.html + assets/*.js + *.css"]
    end

    Pages["GitHub Pages\n靜態託管"]
    Pipeline["GitHub Actions\nauto-merge.yml"]

    Build --> Pages
    Pipeline -->|"1. merge dev-001 → dev → main"| Pipeline
    Pipeline -->|"2. npm ci + npm run build"| Build
    Pipeline -->|"3. deploy dist/"| Pages
```

## 2. 分層架構

本系統採嚴格的分層架構，依賴方向**單向向下**：

```mermaid
flowchart TB
    subgraph L3["第 3 層：UI 元件 src/components/"]
        L3Desc["App / Chessboard / Sidebar / Modal
        職責：渲染、使用者互動、派發 action
        規則：無狀態、不變更 props、透過 game.* 派發"]
    end

    subgraph L2["第 2 層：狀態橋接 src/hooks/"]
        L2Desc["useGame
        職責：useReducer 包裝引擎、提供 dispatcher
        規則：唯一 React↔引擎橋接點、useCallback"]
    end

    subgraph L1["第 1 層：遊戲引擎 src/game/"]
        L1Desc["engine.js Game / Player / Cell
        constants.js 列舉 / 設定 / 圖片
        職責：遊戲規則、狀態轉換
        規則：不可變 OOP、無 DOM、無 React import"]
    end

    L3 -->|"使用 useGame"| L2
    L2 -->|"呼叫 Game 實例方法"| L1
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

```mermaid
sequenceDiagram
    participant User as 使用者
    participant UI as Chessboard
    participant Hook as useGame
    participant Engine as Game Engine
    participant React as React

    User->>UI: 點擊格子
    UI->>Hook: game.selectChess(r, c)
    Hook->>Engine: dispatch SELECT_CHESS
    Engine->>Engine: reducer → state.selectChess(row, col)
    Engine->>Engine: Game.clone() + 設定 selection
    Engine-->>Hook: 回傳新 Game 實例
    Hook-->>React: 觸發重渲染
    React-->>UI: 注入新 state
    UI-->>User: 顯示選取高亮與可移動箭頭
```

### 3.2 動作完整生命週期（以移動棋子為例）

```mermaid
sequenceDiagram
    participant User as 使用者
    participant UI as Chessboard
    participant Hook as useGame
    participant Game as Game
    participant Player as Player

    User->>UI: 1. 點擊己方棋子
    UI->>Hook: game.selectChess(r, c)
    Hook->>Game: selectChess()
    Game-->>Hook: 新 Game selection={chess, row, col}

    User->>UI: 2. 點擊可移動格
    UI->>Hook: game.moveChess(toR, toC)
    Hook->>Game: moveChess()

    Game->>Game: a. clone() 目前遊戲
    Game->>Game: b. 原格設為 Cell.space()

    alt 目標為 BOMB
        Game->>Game: c. 設為 Cell.explosion()
    else 目標為 SPACE 且抵達底線
        Game->>Player: scoreUp()
        Player->>Player: score + 1
        Game->>Game: 格子設為 space()
    else 目標為 SPACE
        Game->>Game: 設為 Cell.chess(turn)
    end

    Game->>Game: d. 更新 players[turn]
    Game->>Game: e. selection = null

    alt score ≥ WINNING_SCORE
        Game->>Game: f. winner = turn
    else
        Game->>Game: f. turn = opponent
    end

    Game-->>Hook: 回傳新 Game
    Hook-->>UI: 觸發重渲染
    UI-->>User: 棋盤更新、側邊欄更新
```

## 4. 部署架構

```mermaid
flowchart LR
    subgraph Local["開發者本機"]
        Dev001["dev-001 分支"]
    end

    subgraph GitHub["GitHub"]
        Repo["GitHub Repo"]
        subgraph Branches["分支"]
            B001["dev-001"]
            BDev["dev"]
            BMain["main"]
        end
        subgraph Actions["GitHub Actions"]
            Workflow["auto-merge.yml"]
        end
        subgraph Pages["GitHub Pages"]
            Static["靜態託管"]
        end
    end

    subgraph UserBrowser["使用者"]
        Browser["瀏覽器"]
    end

    Dev001 -->|"git push"| B001
    B001 --> Workflow
    Workflow -->|"1. merge"| BDev
    BDev -->|"2. merge"| BMain
    BMain -->|"3. npm ci + build"| Workflow
    Workflow -->|"4. upload dist/"| Static
    Static -->|"HTTPS"| Browser
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

```mermaid
flowchart LR
    Src["src/assets/img/*.PNG\n大寫副檔名"]
    Const["src/game/constants.js\nIMAGES 對照表"]
    Build["Vite 建置"]
    Dist["dist/assets/[hash].png\n雜湊命名"]
    Render["React 元件\nimg src 或 backgroundImage"]

    Src -->|"ESM import"| Const
    Const --> Build
    Build --> Dist
    Dist -->|"JS 中以 URL 字串引用"| Render
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
