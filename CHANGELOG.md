# 變更紀錄

本檔案記錄本專案所有重要變更。
版本遵循[語意化版本](https://semver.org/) `MAJOR.MINOR.PATCH`。

## [1.4.0] - 2026-09-28

### 新增
- `doc/UserStories.md`——使用者故事文件（6 則故事卡、Given-When-Then 驗收條件、依賴關係圖、開發順序建議）。
- `doc/RTM.md`——需求追溯矩陣（需求↔設計↔程式碼↔驗證雙向追溯、反向追溯、覆蓋率摘要）。
- `doc/Governance.md`——專案治理文件（SMART 目標、治理結構、RACI 矩陣、決策權限層級、變更管理流程、版本治理）。

### 變更
- `doc/Architecture.md`——所有 ASCII 圖表改為 Mermaid 圖（flowchart、sequenceDiagram）。
- `doc/ER.md`——所有 ASCII 圖表改為 Mermaid 圖（erDiagram、flowchart、stateDiagram-v2）。
- `TOCTREE.md` 新增 UserStories、RTM、Governance 連結；更新 Architecture、ER 說明標註 Mermaid。

## [1.3.1] - 2026-09-28

### 新增
- `doc/Architecture.md`——系統架構文件（分層架構、資料流、部署架構、建置流程、技術棧、關鍵架構屬性）。
- `doc/CRM.md`——交叉參照矩陣（需求↔引擎方法↔常數↔元件↔ADR 追溯矩陣，5 張對照表）。
- `TOCTREE.md` 新增 Architecture 與 CRM 連結。

## [1.3.0] - 2026-09-28

### 新增
- 建立完整文件體系：`TOCTREE.md`（根目錄）+ `doc/` 目錄，含：
  - `doc/ProjectCharter.md`——專案章程（願景、目標、範圍、利害關係人）
  - `doc/PRD.md`——產品需求文件（使用者故事、驗收條件、功能優先級）
  - `doc/SRS.md`——軟體需求規格書（功能性與非功能性需求）
  - `doc/ADR.md`——架構決策記錄（8 項關鍵技術決策）
  - `doc/API.md`——API 文件（Game/Player/Cell 類別、useGame Hook、元件 Props）
  - `doc/Schema.md`——資料結構綱要（列舉常數、設定值、狀態形狀、初始棋盤）
  - `doc/ER.md`——實體關係圖（Game↔Cell↔Player 關係、生命週期、狀態轉換矩陣）
  - `doc/QuickStart.md`——快速開始指南（安裝、開發、建置、部署）
- `README.md` 新增 TOCTREE.md 連結。
- `AGENTS.md` 新增文件同步規則：每次變更須更新 `doc/*.md` 與 `TOCTREE.md`。

## [1.2.3] - 2026-09-28

### 變更
- 將 `README.md`、`AGENTS.md`、`CHANGELOG.md` 全數轉換為繁體中文。
- 移除 `documentation/` 目錄（原始遊戲設計參考檔案：xlsx / pptx / PNG）。

## [1.2.2] - 2026-09-28

### 變更
- 棋盤座標還原為英數格式（欄 A–H、列 1–8）。

## [1.2.1] - 2026-09-28

### 變更
- 玩家回合面板（`.panel-turn`）現依當前玩家切換背景色、邊框與光暈
  （玩家一為藍色、玩家二為紅色），使回合切換更醒目。

## [1.2.0] - 2026-09-28

### 變更
- **每回合一動作**：放置方塊、放置炸彈或移動棋子皆立即結束回合。
  移除 `Player` 中每回合動作計數器（`movePerRound`、`blockPerRound`、
  `trapPerRound`）；該類別現在只追蹤 `score`、`blocksRemaining`、
  `bombsRemaining`。
- **「trap」全面更名為「bomb」**以提升清晰度（隱藏物品接觸時引爆）。
  `CELL.TRAP` → `CELL.BOMB`、`selectTrap` → `selectBomb`、
  `placeTrap` → `placeBomb`、`playerTrapImage` → `playerBombImage`、
  `TRAPS_PER_GAME` → `BOMBS_PER_PLAYER`。素材檔案 `TRAP_*.PNG` →
  `BOMB_*.PNG`。
- **全繁體中文介面**：移除雙語 i18n 層（`src/i18n/`、
  `LanguageToggle.jsx`）。顯示文字改為各元件內的模組層級 `TEXT` 常數，
  依原始設計。
- **側邊欄移至左側**（在 `App.jsx` 中調換渲染順序）。
- 設定常數更名以提升清晰度：`END_SCORE` → `WINNING_SCORE`、
  `END_COLUMNS` → `GOAL_COLUMNS`、`BLOCKS_PER_GAME` →
  `BLOCKS_PER_PLAYER`。
- `currentPlayer` 與 `opponent` 改為 `Game` 上的 getter。
- `README.md` 新增線上版本網址；更新規則、專案結構與程式碼規範章節。

### 移除
- `src/i18n/strings.js`、`src/i18n/LanguageContext.jsx`——不再有雙語。
- `src/components/LanguageToggle.jsx`——不再有語言切換。
- `STATUS.EXIT`——未使用的列舉成員。

## [1.1.0] - 2026-09-28

### 變更
- 遊戲更名為「棋塊陷阱 · Chess Blocks & Traps」（`package.json` name →
  `chess-blocks-traps`，標題與 `<html lang>` 一併更新）。
- 遊戲引擎改寫為**不可變 OOP**——`engine.js` 中的 `Game`、`Player`、
  `Cell` 類別。每個動作方法回傳新實例，接收者永不變更。`useGame` 改為
  對 `Game` 實例方法做 reduce。
- 整個介面改為**雙語**（繁體中文／英文），預設繁體中文。所有顯示文字
  移至 `src/i18n/strings.js`，透過 `useI18n()` 的 `t` 表讀取；
  `LanguageToggle` 按鈕切換語言。
- 重新設計版面與樣式：深色主題面板、漸層標題、棋盤座標標籤
  （A–H／1–8）、計分進度條、技能格標籤、動畫彈窗與改善的響應式行為。
- 更新 `README.md` 與 `AGENTS.md` 以記錄 OOP 引擎與 i18n 層。

### 新增
- `src/i18n/strings.js`——平行的 `tc`／`en` 字串表。
- `src/i18n/LanguageContext.jsx`——`LanguageProvider` + `useI18n` hook
  （`{ lang, setLang, toggle, t }`）。
- `src/components/LanguageToggle.jsx`——標題列語言切換按鈕。
- `PLAYER.NONE` 常數，用於更簡潔的空格所有權標示。

## [1.0.2] - 2026-09-28

### 變更
- 將發布管線合併為單一 `auto-merge.yml` 工作流程，改用內建
  `GITHUB_TOKEN` 取代 PAT。工作流程現將 `dev-001 -> dev -> main` 依序
  合併、建置並部署至 Pages，全部在一次執行中完成。
- 完全移除 `GIT_PUSH_TOKEN`／細粒度 PAT 依賴。
- `dev` 與 `main` 必須保持未受保護，`GITHUB_TOKEN` 才能推送。

### 移除
- `deploy_reactjs_page.yml`——其部署步驟已是 `auto-merge.yml` 的一部分。

## [1.0.1] - 2026-09-28

### 修正
- `deploy_reactjs_page.yml`：移除錯誤的 `blog/` 工作目錄與
  cache-dependency 路徑；建置現於倉庫根目錄執行並上傳 `./dist`。
- `auto-merge.yml`：新增 fail-fast 守衛，當 `GIT_PUSH_TOKEN` 密鑰為空或
  缺少時清楚報錯，而非在 checkout 時以晦澀的 `could not read Username`
  git 提示失敗。

### 變更
- `AGENTS.md`：以 `GIT_PUSH_TOKEN` 密鑰需求說明取代（已修正的）
  `blog/` 部署陷阱備註。

## [1.0.0] - 2026-09-28

### 新增
- 將舊版 jQuery／SweetAlert 應用改寫為 React + Vite 單頁應用。
- 純粹、與 UI 無關的遊戲引擎（`src/game/`），具不可變狀態轉換。
- `useGame` hook 作為 React↔引擎唯一橋接（`useReducer` 包裝引擎函式）。
- 元件：`Chessboard`、`Sidebar`、`Modal` 與 `App` 版面。
- 全域樣式表，含主題 token 與響應式版面。
- Vite 設定含 `base: './'`（GitHub Pages 子路徑支援）與
  `assetsInclude: ['**/*.PNG']` 以處理大寫原始圖檔。
- `AGENTS.md`，含 OpenCode 工作階段的倉庫專屬指引。
- 更新 `README.md`，含規則、開發／建置指令、部署步驟、專案結構與
  統一程式碼規範。
- GitHub Actions 工作流程：`auto-merge.yml`（`dev-001 → dev → main`
  串接）與 `deploy_reactjs_page.yml`（Pages 部署）。

### 移除
- 舊版 `Index.html`、`myscript.js`、`mystyle.css`、
  `constant.module.js`、`model.module.js`。
- 第三方 `libs/`（jQuery、SweetAlert2）。
- 舊 `statics/` 目錄（圖示已遷移至 `src/assets/img/`）。
- 備份封存（`*.zip`）。
