# AGENTS.md

OpenCode 工作階段於此倉庫操作的精要指南。

## 變更流程（必須遵守）

- **每次變更都必須更新 `CHANGELOG.md`**，採語意化版本 `X.X.X`，隨後以 git 提交。沒有「太小而不需更新」的變更。
- Git 控制流程：提交（附上規範化、格式良好的主旨與內文）→ 僅推送至 `dev-001` → 觸發自動合併管線 `dev-001 → dev → main → GitHub Pages 部署`。
- 絕不直接推送至 `dev` 或 `main`；那些轉換由管線負責。

## 分支與部署流程

此倉庫由單一 GitHub Actions 發布管線驅動——不要手動複製：

```
推送至 dev-001  -->  auto-merge.yml:  dev-001 -> dev -> main  ->  建置 -> 部署至 Pages
```

- 推送至 `dev-001` 會觸發 `auto-merge.yml`，將 `dev-001` 合併進 `dev`，再將 `dev` 合併進 `main`，接著建置並部署 `main` 至 GitHub Pages——全部在同一工作流程完成。
- 管線使用內建 `GITHUB_TOKEN`（不需 PAT / `GIT_PUSH_TOKEN` 密鑰）。以 `GITHUB_TOKEN` 推送不會觸發其他工作流程，這沒問題，因為整個串接都在同一檔案內。
- `dev` 與 `main` 必須保持**未受保護**（無分支保護規則），`GITHUB_TOKEN` 才能推送。若新增保護規則，合併步驟會以 403 失敗。
- 不要重新引入獨立的 `deploy_reactjs_page.yml`；部署步驟已是 `auto-merge.yml` 的一部分。

## 指令

僅有三個 npm script——**沒有 `test`、`lint` 或 `typecheck`**。驗證 = 乾淨的建置。

```bash
npm install
npm run dev        # Vite 開發伺服器
npm run build      # 生產建置至 ./dist  <- 驗證步驟
npm run preview    # 本機伺服已建置的 ./dist
```

## Vite 設定注意事項

- `base: './'` 輸出相對資源 URL，使建置能在任何 GitHub Pages 子路徑下運作。不要改為 `/`。
- `assetsInclude: ['**/*.PNG']` 是必須的，因為原始圖檔使用**大寫** `.PNG` 副檔名，Vite 預設不視其為資源。圖片 import 一律透過 `src/game/constants.js`（`IMAGES` 對照表 + 輔助函式），絕不使用原始路徑。

## 架構

- `src/game/`（`constants.js`、`engine.js`）是**純粹且與 UI 無關**的：無 DOM 存取、無 React import、不變更狀態。引擎為 OOP——`Game`、`Player`、`Cell` 類別——但**不可變**：每個動作方法回傳新實例，接收者永不變更。**每回合一動作**：放置方塊、放置炸彈或移動棋子皆立即結束回合。不要在此引入副作用或 React 耦合。
- `src/hooks/useGame.js` 是 React 與引擎之間**唯一**的橋接（以 `useReducer` 包裝 `Game` 實例方法）。UI 狀態（如彈窗顯示）以元件內 `useState` 管理，不放入遊戲 reducer。
- `src/components/` 中的元件是 `game` 物件的無狀態接收者；透過 handler 派發，絕不變更。
- 所有顯示文字為**繁體中文**，以各元件內的模組層級 `TEXT` 常數定義。不要引入語言切換層。

## 風格

詳細程式碼規範（命名、格式化、各層規則）見 `README.md`「程式碼規範」一節。請遵循該處規範；本檔案僅記錔程式碼中不顯而易見的部分。
