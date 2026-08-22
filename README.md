# 中華電信規範違規查詢網站

靜態查詢網站：輸入職員行為，自動對應中華電信公開的行為準則、誠信經營、反貪腐、內線交易、供應商行為準則等規範，列出是否違反、違反條文、相關政策文件與建議通報方式。

查詢後可選擇是否擬出報告書；報告書會彙整行為描述、違反條文與建議處理，並可列印或儲存為 PDF。

網站內建「語意搜尋」引擎，可在瀏覽器端比對行為描述與規則的語意相似度，補足關鍵字無法涵蓋的換句話說；語意模型無法載入時會自動退回關鍵字比對。

## 功能特色

- **否定句處理**：偵測「並未收受」「沒有洩漏」「未提供回扣」等否定語氣（含子句範圍），避免誤報；「未揭露／未申報」等作為正面要件的規則不受影響。
- **命中關鍵字顯示**：每張結果卡標示命中了哪些關鍵字，方便核對判斷依據。
- **原文摘錄**：46 條規則附官方文件原文節錄（摘錄自官方 PDF），與改寫摘要並列，方便複核。
- **嚴重度分級**：結果依「違反狀態 → 嚴重度（最高／高／中）→ 命中數」排序，卡片顯示嚴重度徽章。
- **法令層引用**：對應條文另附可能涉及的外部法令（刑法、個資法、證交法、營業秘密法等），與公司內規分開標示，並附「僅供參考、非法律意見」之聲明。
- **語意搜尋**：可顯示語意相似度分數；模型於使用者首次與查詢區互動時背景預載，下載時顯示進度（首次約 113 MB，之後由瀏覽器快取、可離線）。
- **分享連結**：查詢字串寫入網址 hash（`#q=...`），可複製連結分享，開啟連結即自動帶入查詢。
- **匯出結果**：查詢結果可匯出 CSV（Excel 相容）或 JSON。
- **最近查詢**：本機記錄最近 10 筆查詢（localStorage），可一鍵清除；輸入內容僅在瀏覽器本機處理，不會上傳。
- **資料版本**：側欄顯示規則資料版本與校對日期。
- **維護檢查按鈕**：側欄「維護檢查」按鈕可在頁面內直接執行維護測試——檢查規則資料完整性、法令引用之條號格式與適用性說明、法令名稱是否在已知清單，並對官方連結做瀏覽器內最佳努力驗證；結果以通過／注意／失敗分級呈現，供日後例行維護使用。

## 使用方式

直接開啟 `index.html`，或在專案目錄執行：

```bash
python3 -m http.server 8000
```

然後開啟 `http://localhost:8000`。

## 測試與維護

比對引擎（`matcher.js`）與維護檢查引擎（`maintenance.js`）皆為瀏覽器與 Node 共用，可跑單元測試：

```bash
npm test
```

測試涵蓋資料完整性（規則、法令、原文摘錄、版本）、否定句處理、正例回歸、排序邏輯與維護檢查引擎（條號格式、適用性說明、法令名稱清單）。

定期檢查官方文件與報告書連結是否失效（瀏覽器內因 CORS 限制無法完整驗證，請以本指令為準）：

```bash
npm run check:links
```

日常維護也可直接使用網站側欄的「維護檢查」按鈕，於頁面內執行資料與法令引用檢查。

## 部署到 GitHub Pages

1. 在 GitHub 建立新 repository，名稱設為 `CHT`。
2. 將本目錄內容推送到 repository：

```bash
git init
git add .
git commit -m "Add CHT rule query site"
git branch -M main
git remote add origin https://github.com/<你的帳號>/CHT.git
git push -u origin main
```

3. 到 repository 的 Settings → Pages，將 Source 設為 `Deploy from a branch`，Branch 選 `main` 與 `/ (root)`。
4. 網站完成後即可透過 `https://<你的帳號>.github.io/CHT/` 使用。

## 資料說明

- 行為比對資料位於 `data/policies.js`，以中華電信官網公開政策摘要為基礎。
- 法令層引用位於 `data/statutes.js`，僅供參考、非法律意見；實際適用應依具體事實由公司法務單位認定。
- 查詢結果僅供參考，正式認定以中華電信內部調查與正式條文為準。
- 未公開之內部作業規定不在本網站判斷範圍內。
- 輸入內容僅在瀏覽器本機處理，不會上傳。

## 官方來源

中華電信 ESG 誠信經營與治理文件：

- 行為準則：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-2.pdf
- 誠信經營守則：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-5.pdf
- 誠信經營作業程序及行為指南：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-4.pdf
- 反貪腐反賄賂與反洗錢政策：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-7.pdf
- 防範內線交易管理控制作業要點：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/0716.pdf
- 供應商行為準則：https://www.cht.com.tw/zh-TW/home/cht/-/media/Web/Images/ESG2023/4-3new_supplier-code-of-conduct-1.pdf
