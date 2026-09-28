# 棋塊陷阱

一款雙人對戰的棋盤變體遊戲，玩家在 8×8 棋盤上放置**方塊**與隱形**炸彈**。以 **React + Vite** 打造，部署於 **GitHub Pages**。

**線上版本：** <https://mcc-mak.github.io/chess-blocks-traps/>

> 完整文件索引見 [TOCTREE.md](TOCTREE.md)。

## 示範影片

<video src="demo.mp4" controls autoplay loop muted width="100%"></video>

[下載示範影片](demo.mp4)

## 規則

- **每回合僅能執行一項動作**：移動棋子、放置方塊或放置炸彈，三選一。
- **炸彈**：隱形於棋盤上，當棋子踩到時引爆，棋子被消滅，該格變為爆炸殘骸（不可通行）。
- **方塊**：可見的障礙物，阻擋移動（可覆蓋放置於隱形炸彈上）。
- **移動**：棋子可向上、下、左、右移動一格。
- **計分**：棋子抵達對方底線即得 1 分。
- **勝利**：先達 5 分者勝。
- 每局雙方各獲 **3 個方塊** 與 **3 個炸彈**。

## 本機開發

```bash
npm install
npm run dev        # 啟動 Vite 開發伺服器
npm run build      # 生產環境建置，輸出至 ./dist
npm run preview    # 本機預覽建置結果
```

## 部署至 GitHub Pages

`dist/` 建置成果為純靜態檔案，並使用**相對資源路徑**（`vite.config.js` 中 `base: './'`），因此可部署至任何 GitHub Pages 子路徑，例如 `https://<user>.github.io/<repo>/`。

推送至 `dev-001` 分支會觸發 `auto-merge.yml` 工作流程，自動將 `dev-001 → dev → main` 依序合併、建置並部署至 GitHub Pages。

## 專案結構

```
.
├── index.html               # Vite 入口 HTML
├── vite.config.js           # Vite 設定（base: './' 以支援 Pages 子路徑）
├── package.json
└── src/
    ├── main.jsx             # React 啟動
    ├── App.jsx              # 頂層版面與彈窗
    ├── styles.css           # 全域樣式
    ├── assets/img/          # 遊戲圖示（PNG）
    ├── game/
    │   ├── constants.js     # 格子／狀態列舉、圖片、設定值
    │   └── engine.js        # 純粹 OOP 遊戲引擎（Game / Player / Cell）
    ├── hooks/
    │   └── useGame.js       # useReducer 橋接引擎
    └── components/
        ├── Chessboard.jsx
        ├── Sidebar.jsx
        └── Modal.jsx
```

## 程式碼規範

本專案遵循一致的程式碼風格，由慣例約束各層。以下分類說明各層差異。

### 1. 一般原則

- **語言**：JavaScript（React 使用 JSX），不使用 TypeScript。
- **模組系統**：ESM（`"type": "module"`），僅使用 `import` / `export`，不使用 CommonJS。
- **格式化**：2 空格縮排；單引號字串；必須加分號。
- **禁止死碼**：移除未使用的 import、變數與註解掉的程式區塊。
- **禁止註解**，除非用於解釋某個非顯而易見決策的*原因*。

### 2. 命名

| 元素            | 慣例              | 範例               |
|----------------|-------------------|--------------------|
| 檔案（JS/JSX） | `camelCase.jsx`   | `useGame.js`       |
| 元件           | `PascalCase`      | `Chessboard`       |
| 函式           | `camelCase`       | `movableTargets`   |
| 類別           | `PascalCase`      | `Game`, `Player`   |
| 常數列舉       | `UPPER_SNAKE`     | `CELL`, `STATUS`   |
| 列舉成員       | `UPPER_SNAKE`     | `CELL.CHESS`       |
| CSS 類別       | `kebab-case`      | `cell-chess`       |

### 3. React 元件（`src/components`）

- 每個檔案一個元件；檔名與元件名稱一致。
- 元件為函式式並使用 hooks，不使用 class 元件。
- Props 在函式簽名中解構。
- 元件不持有遊戲狀態——接收 `game`（來自 `useGame`）或純 props，透過 handler 派發動作。
- 無副作用渲染：在 render 中從 state 推導顯示資料（如可移動目標），絕不變更 props。

### 4. 遊戲邏輯（`src/game`）

- **不可變 OOP**：引擎由三個類別組成——`Game`、`Player`、`Cell`，皆位於 `engine.js`。每個動作方法（`moveChess`、`placeBlock`、`placeBomb`）回傳**新**實例；接收者永不變更。
- 每個類別提供 `clone()` 輔助方法；`Game` 在套用變更前會複製棋盤（每格建立新 `Cell`）與玩家。
- `Cell` 與 `Player` 提供工廠輔助方法（`Cell.chess(player)`、`Player.useBlock()` 等），回傳新實例，使狀態轉換的配置顯式化。
- **每回合一動作**：放置方塊、放置炸彈或移動棋子皆立即結束回合，沒有每回合動作計數器。
- 無 DOM 存取、無 React import、無副作用——引擎與 UI 無關，可獨立測試。
- 常數（列舉、設定、圖片對照表）位於 `constants.js`；邏輯位於 `engine.js`。

### 5. 狀態管理（`src/hooks`）

- `useGame` 是 React 與引擎之間唯一的橋接。
- 內部以 `useReducer` 將 action 派發至 `Game` 實例方法（各回傳新 `Game`）。
- 所有 dispatcher 以 `useCallback` 記憶化。
- 僅 UI 用的旗標（如「規則彈窗開啟」）以元件內 `useState` 管理，不放入遊戲 reducer。

### 6. 樣式（`src/styles.css`）

- 單一共用樣式表，不使用 CSS-in-JS，無各元件獨立 CSS 檔。
- `kebab-case` 類別名稱；以 flexbox / grid 排版。
- 主題色彩以 CSS 自訂屬性宣告於 `:root`，各處引用。
- 響應式設計使用 media query，不使用行內 pixel hack。

### 7. 資源（`src/assets`）

- 所有圖片置於 `src/assets/img/` 下，以 ESM import，由 Vite 雜湊打包。
- 檔名為 `UPPER_SNAKE`（如 `PLAYER_1.PNG`、`BOMB_1.PNG`）。
- 絕不以絕對路徑引用圖片，一律透過 `constants.js` 的 `IMAGES` 對照表與輔助函式。
