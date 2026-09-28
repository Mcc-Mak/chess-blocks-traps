# 架構決策記錄（ADR）

## ADR-001：選用 React + Vite 作為前端框架

**狀態**：已接受

**背景**

舊版以 jQuery + SweetAlert2 實作，缺乏模組化、狀態管理與元件複用。需要現代化重寫。

**決策**

採用 React 18 + Vite 5。理由：
- React 的元件模型與單向資料流適合棋盤遊戲的狀態管理。
- Vite 提供快速開發伺服器與優化的生產建置。
- 生態系成熟，無需額外框架。

**後果**

- 正面：元件化、hooks 模式、HMR 開發體驗佳。
- 負面：需要理解 React 渲染模型與不可變狀態。

---

## ADR-002：遊戲引擎為不可變 OOP

**狀態**：已接受

**背景**

需要將遊戲邏輯與 UI 分離，且狀態更新需可預測、可追蹤。

**決策**

引擎由 `Game`、`Player`、`Cell` 三個類別組成，全部不可變。每個動作方法（`moveChess`、`placeBlock`、`placeBomb`、`selectChess` 等）回傳新實例，接收者永不變更。每個類別提供 `clone()` 方法。

理由：
- 不可變性與 React 的 `useReducer` 天然契合——reducer 回傳新 `Game`，React 自動觸發重渲染。
- OOP 封裝遊戲規則，避免邏輯散落各處。
- 可獨立測試引擎，不需 DOM 或 React。

**後果**

- 正面：狀態可預測、引擎可獨立測試、與 React 整合乾淨。
- 負面：每次動作需複製整個棋盤（8×8 = 64 格），效能成本可忽略。

---

## ADR-003：useReducer 作為 React↔引擎唯一橋接

**狀態**：已接受

**背景**

需要將 React 的渲染與引擎的狀態轉換銜接。

**決策**

`useGame` hook 內部以 `useReducer` 包裝 `Game` 實例方法。Reducer 的每個 action type 對應一個引擎方法，回傳新 `Game`。所有 dispatcher 以 `useCallback` 記憶化。

UI 狀態（如彈窗顯示）以元件內 `useState` 管理，不放入遊戲 reducer。

**後果**

- 正面：單一橋接點、元件無狀態、測試容易。
- 負面：新增 action 需同時更新 reducer 與 hook 回傳值。

---

## ADR-004：每回合一動作規則

**狀態**：已接受

**背景**

原設計中每回合可執行多個動作（移動 + 放置），需計數器管理。

**決策**

改為每回合一動作：移動棋子、放置方塊或放置炸彈，三選一，執行後立即結束回合。移除 `Player` 中的每回合動作計數器。

**後果**

- 正面：規則簡化、策略性提升（每步都關鍵）、`Player` 結構更簡潔。
- 負面：無。

---

## ADR-005：移除 i18n 層，僅保留繁體中文

**狀態**：已接受

**背景**

v1.1.0 引入雙語（繁中／英文）i18n 層，增加複雜度但目標使用者全為繁中使用者。

**決策**

移除 `src/i18n/`、`LanguageToggle.jsx`。所有顯示文字改為各元件內的模組層級 `TEXT` 常數。

**後果**

- 正面：程式碼簡化、減少一層抽象、字串與元件同檔易於維護。
- 負面：若未來需多語言需重新引入 i18n 層。

---

## ADR-006：trap 更名為 bomb

**狀態**：已接受

**背景**

「trap」一詞語意模糊，且實際行為是接觸時引爆。

**決策**

全面更名 trap → bomb：`CELL.TRAP` → `CELL.BOMB`、`selectTrap` → `selectBomb`、`placeTrap` → `placeBomb`、`playerTrapImage` → `playerBombImage`、`TRAPS_PER_GAME` → `BOMBS_PER_PLAYER`、素材檔案 `TRAP_*.PNG` → `BOMB_*.PNG`。

**後果**

- 正面：語意清晰、命名一致。
- 負面：無。

---

## ADR-007：單一 GitHub Actions 工作流程

**狀態**：已接受

**背景**

原有多個工作流程檔案（`auto-merge.yml` + `deploy_reactjs_page.yml`），且依賴 PAT 密鑰。

**決策**

合併為單一 `auto-merge.yml`，使用內建 `GITHUB_TOKEN`。工作流程在單次執行中完成 `dev-001 → dev → main` 合併、建置、部署。`dev` 與 `main` 保持未受保護。

**後果**

- 正面：簡化管線、移除密鑰依賴、單檔可追蹤。
- 負面：`dev` 與 `main` 無分支保護，需靠紀律避免直接推送。

---

## ADR-008：回合面板依玩家切換色彩

**狀態**：已接受

**背景**

回合切換時缺乏視覺提示，玩家可能未注意到換手。

**決策**

`.panel-turn` 套用 `turn-p1`（藍色漸層 + 邊框 + 光暈）或 `turn-p2`（紅色漸層 + 邊框 + 光暈），依當前玩家動態切換。

**後果**

- 正面：回合切換視覺醒目。
- 負面：無。
