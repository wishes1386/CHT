/* test/maintenance.test.js — 維護檢查引擎測試
 *
 * 執行方式：npm test（node --test 自動發現）
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

require("../data/policies.js");
require("../data/statutes.js");
const { runChecks, checkStatutes, isValidArticle, KNOWN_LAWS } = require("../maintenance.js");

const STATUTES = globalThis.CHT_STATUTES;

test("維護檢查：預設檢查不應有失敗項目", async () => {
  const results = await runChecks(); // 不檢查連結，避免 Node 環境 fetch 依賴
  const fails = results.filter((r) => r.level === "fail");
  assert.deepEqual(fails.map((f) => f.label), [], "維護檢查出現失敗項目");
});

test("維護檢查：法令引用檢查不應有失敗項目", () => {
  const results = checkStatutes();
  const fails = results.filter((r) => r.level === "fail");
  assert.deepEqual(fails.map((f) => f.label), []);
});

test("維護檢查：所有法令名稱皆在已知清單內", () => {
  for (const [id, list] of Object.entries(STATUTES)) {
    for (const s of list) {
      assert.ok(KNOWN_LAWS.includes(s.name), `${id} 引用未知法令名稱：${s.name}`);
    }
  }
});

test("維護檢查：條號格式（isValidArticle）", () => {
  const valid = [
    "第 342 條",
    "第 121、122 條",
    "第 13-1、13-2 條",
    "第 157-1 條",
    "第 358、359、360 條",
    "第 44～48 條",
    "第 1 條",
    "（整體適用）"
  ];
  for (const article of valid) {
    assert.ok(isValidArticle(article), `應為合法格式：${article}`);
  }
  const invalid = ["342 條", "第 342", "第 342 條之 1", "刑法第 342 條", ""];
  for (const article of invalid) {
    assert.ok(!isValidArticle(article), `應為非法格式：${article}`);
  }
});

test("維護檢查：適用性說明（note）覆蓋率", () => {
  let total = 0;
  let withNote = 0;
  for (const list of Object.values(STATUTES)) {
    for (const s of list) {
      total += 1;
      if (s.note) withNote += 1;
    }
  }
  assert.ok(withNote === total, `適用性說明應全數具備：${withNote}/${total}`);
});
