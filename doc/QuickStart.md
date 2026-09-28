# 快速開始（Quick Start）

## 環境需求

- Node.js 18+（建議 20+）
- npm 10+

## 1. 安裝

```bash
git clone https://github.com/Mcc-Mak/chess-blocks-traps.git
cd chess-blocks-traps
npm install
```

## 2. 本機開發

```bash
npm run dev
```

啟動 Vite 開發伺服器，預設網址為 `http://localhost:5173`。支援 HMR（熱模組替換）。

## 3. 建置

```bash
npm run build
```

生產建置輸出至 `./dist`。此為驗證步驟——建置成功即代表程式碼正確。

## 4. 預覽建置結果

```bash
npm run preview
```

在本機伺服 `./dist`，模擬生產環境。

## 5. 部署

部署為全自動化，**不需手動操作**。

### 部署流程

```
推送至 dev-001  →  auto-merge.yml 自動執行：
                      1. 合併 dev-001 → dev
                      2. 合併 dev → main
                      3. npm ci + npm run build
                      4. 部署 dist/ 至 GitHub Pages
```

### 操作步驟

```bash
# 1. 在 dev-001 分支上提交變更
git add -A
git commit -m "feat: 你的變更描述"

# 2. 推送至 dev-001
git push origin dev-001

# 3. 等待 GitHub Actions 自動合併、建置、部署
#    查看管線狀態：
gh run watch
```

### 部署規則

- **僅推送至 `dev-001`**。絕不直接推送至 `dev` 或 `main`。
- `dev` 與 `main` 必須保持未受保護（無分支保護規則）。
- 管線使用內建 `GITHUB_TOKEN`，不需設定密鑰。
- 線上網址：<https://mcc-mak.github.io/chess-blocks-traps/>

## 6. 專案結構速覽

```
src/
├── main.jsx              # React 啟動入口
├── App.jsx               # 頂層版面 + 彈窗
├── styles.css            # 全域樣式
├── game/
│   ├── constants.js      # 列舉常數、設定值、圖片
│   └── engine.js         # 不可變 OOP 遊遊戲引擎
├── hooks/
│   └── useGame.js        # React ↔ 引擎橋接
└── components/
    ├── Chessboard.jsx     # 棋盤
    ├── Sidebar.jsx        # 側邊欄（回合、計分、技能）
    └── Modal.jsx          # 通用彈窗
```

## 7. 常見問題

### Q: 為什麼圖片副檔名是大寫 `.PNG`？

原始素材使用大寫副檔名。Vite 預設不將 `.PNG`（大寫）視為資源，因此 `vite.config.js` 中設定 `assetsInclude: ['**/*.PNG']`。不要將副檔名改為小寫。

### Q: 為什麼 `base` 設為 `'./'`？

GitHub Pages 部署在子路徑下（`/<repo>/`），相對路徑確保資源 URL 在任何子路徑下都能正確載入。不要改為 `/`。

### Q: 沒有 test / lint / typecheck 指令？

本專案僅有三個 npm script：`dev`、`build`、`preview`。驗證方式為 `npm run build` 是否成功。
