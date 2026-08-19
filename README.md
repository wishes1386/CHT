# 中華電信規範違規查詢網站

靜態查詢網站：輸入職員行為，自動對應中華電信公開的行為準則、誠信經營、反貪腐、內線交易、供應商行為準則等規範，列出是否違反、違反條文、相關政策文件與建議通報方式。

查詢後可選擇是否擬出報告書；報告書會彙整行為描述、違反條文與建議處理，並可列印或儲存為 PDF。

## 使用方式

直接開啟 `index.html`，或在專案目錄執行：

```bash
python3 -m http.server 8000
```

然後開啟 `http://localhost:8000`。

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

3. 到 repository 的 Settings → Pages，將 Source 設為 `GitHub Actions`。
4. Push 後 GitHub Actions 會自動部署，網站完成後即可透過 `https://<你的帳號>.github.io/CHT/` 使用。

## 資料說明

- 行為比對資料位於 `data/policies.js`，以中華電信官網公開政策摘要為基礎。
- 查詢結果僅供參考，正式認定以中華電信內部調查與正式條文為準。
- 未公開之內部作業規定不在本網站判斷範圍內。

## 官方來源

中華電信 ESG 誠信經營與治理文件：

- 行為準則：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-2.pdf
- 誠信經營守則：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-5.pdf
- 誠信經營作業程序及行為指南：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-4.pdf
- 反貪腐反賄賂與反洗錢政策：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-7.pdf
- 防範內線交易管理控制作業要點：https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/0716.pdf
- 供應商行為準則：https://www.cht.com.tw/zh-TW/home/cht/-/media/Web/Images/ESG2023/4-3new_supplier-code-of-conduct-1.pdf
