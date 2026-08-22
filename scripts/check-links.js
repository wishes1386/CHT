/* scripts/check-links.js — 檢查官方文件與報告書連結是否仍有效
 *
 * 執行方式：npm run check:links
 * 蒐集 data/policies.js 內所有官方文件與規則報告連結，逐個以 HEAD 檢查；
 * 伺服器不支援 HEAD 時改以 GET + Range 抓前 1 KB。
 */
"use strict";

require("../data/policies.js");
require("../data/statutes.js");

const SOURCES = globalThis.CHT_SOURCES || {};
const POLICIES = globalThis.CHT_POLICIES || [];

const urls = new Map(); // url -> label
for (const [key, source] of Object.entries(SOURCES)) {
  if (source && source.url) urls.set(source.url, `CHT_SOURCES.${key}`);
}
for (const rule of POLICIES) {
  for (const report of rule.reports || []) {
    if (report && report.url && !urls.has(report.url)) {
      urls.set(report.url, `${rule.id}.reports`);
    }
  }
}

async function check(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(20000)
    });
    return res.status;
  } catch {
    // 部分伺服器不支援 HEAD，改用 GET 只取前 1 KB
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
        headers: { Range: "bytes=0-1024" }
      });
      return res.status;
    } catch {
      return 0; // 網路錯誤
    }
  }
}

(async () => {
  let ok = 0;
  let fail = 0;
  const lines = [];
  for (const [url, label] of urls.entries()) {
    const status = await check(url);
    if (status >= 200 && status < 400) {
      ok += 1;
      lines.push(`OK   ${status}  ${label}  ${url}`);
    } else {
      fail += 1;
      lines.push(`FAIL ${status || "ERR"}  ${label}  ${url}`);
    }
  }
  lines.sort();
  for (const line of lines) console.log(line);
  console.log(`\n共檢查 ${urls.size} 個連結：OK ${ok} / FAIL ${fail}`);
  process.exit(fail > 0 ? 1 : 0);
})();
