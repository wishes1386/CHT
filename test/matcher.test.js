/* test/matcher.test.js — 比對引擎單元測試
 *
 * 執行方式：node --test test/
 * 涵蓋：資料完整性、否定句處理、正例回歸、嚴重度排序、法令層資料。
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

// 載入規則資料與比對引擎（Node 端走 globalThis 相容路徑）
require("../data/policies.js");
require("../data/statutes.js");
const matcher = require("../matcher.js");

const POLICIES = globalThis.CHT_POLICIES;
const STATUTES = globalThis.CHT_STATUTES;

const { matchRules } = matcher;

function idsOf(text) {
  return matchRules(text).map((m) => m.rule.id);
}

test("資料完整性：規則總數與唯一 id", () => {
  assert.equal(POLICIES.length, 51);
  const ids = POLICIES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, "規則 id 不得重複");
});

test("資料完整性：必要欄位與列舉值", () => {
  for (const rule of POLICIES) {
    for (const field of ["id", "category", "title", "document", "article", "status", "severity", "summary", "keywords", "reports", "channels"]) {
      assert.ok(rule[field] !== undefined && rule[field] !== null && rule[field] !== "", `${rule.id} 缺少 ${field}`);
    }
    assert.ok(["violated", "possible"].includes(rule.status), `${rule.id} 的 status 不合法`);
    assert.ok(["最高", "高", "中"].includes(rule.severity), `${rule.id} 的 severity 不合法`);
    assert.ok(rule.keywords.length > 0, `${rule.id} 沒有關鍵字`);
    for (const kw of rule.keywords) {
      assert.ok(typeof kw === "string" && kw.length > 0, `${rule.id} 含空關鍵字`);
    }
    assert.ok(rule.reports.length > 0, `${rule.id} 沒有報告書來源`);
    assert.ok(rule.channels.length > 0, `${rule.id} 沒有建議處理`);
    if (rule.requiredGroups) {
      assert.ok(rule.requiredGroups.length > 0, `${rule.id} requiredGroups 為空`);
      for (const group of rule.requiredGroups) {
        assert.ok(Array.isArray(group) && group.length > 0, `${rule.id} requiredGroups 含空群組`);
      }
    }
  }
});

test("資料完整性：法令層索引對應規則 id", () => {
  const ruleIds = new Set(POLICIES.map((r) => r.id));
  for (const id of Object.keys(STATUTES)) {
    assert.ok(ruleIds.has(id), `CHT_STATUTES 含不存在的規則 ${id}`);
    for (const s of STATUTES[id]) {
      assert.ok(s.name && s.article, `${id} 的法令條目缺少 name/article`);
    }
  }
});

test("資料完整性：原文摘錄（quote）欄位", () => {
  const withQuote = POLICIES.filter((r) => r.quote !== undefined);
  assert.ok(withQuote.length >= 40, `原文摘錄覆蓋率不足：僅 ${withQuote.length}/51`);
  for (const rule of withQuote) {
    assert.ok(typeof rule.quote === "string" && rule.quote.length >= 10, `${rule.id} 的 quote 過短或非字串`);
  }
  const keyRules = ["trade-secret-leak", "insider-trading", "bribe-kickback", "gift-over-limit", "harassment", "tax-evasion", "supplier-labor"];
  for (const id of keyRules) {
    const rule = POLICIES.find((r) => r.id === id);
    assert.ok(rule && rule.quote, `${id} 應具備原文摘錄`);
  }
});

test("資料完整性：資料版本中繼資料", () => {
  const meta = globalThis.CHT_DATA_META;
  assert.ok(meta, "缺少 CHT_DATA_META");
  assert.ok(meta.version, "缺少版本號");
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(meta.reviewedAt), `reviewedAt 格式應為 YYYY-MM-DD：${meta.reviewedAt}`);
});

test("否定句：並未收受廠商禮物 → 不命中禮物類規則", () => {
  const results = matchRules("某採購人員並未收受廠商禮物。");
  assert.deepEqual(idsOf("某採購人員並未收受廠商禮物。"), []);
});

test("否定句：沒有洩漏營業秘密 → 不命中營業秘密規則", () => {
  assert.ok(!idsOf("某員工沒有洩漏營業秘密。").includes("trade-secret-leak"));
});

test("否定句：未提供任何回扣或佣金 → 不命中收賄規則", () => {
  assert.ok(!idsOf("某員工未提供任何回扣或佣金。").includes("bribe-kickback"));
});

test("否定句：未曾接受廠商招待 → 不命中款待規則", () => {
  const ids = idsOf("某員工未曾接受廠商招待。");
  assert.ok(!ids.includes("gift-over-limit"));
  assert.ok(!ids.includes("supplier-hospitality"));
});

test("否定句：作用範圍不跨子句（後半句仍算命中）", () => {
  // 前半句否定回扣，後半句接受禮物 → 禮物規則仍命中
  const ids = idsOf("雖然未收受回扣，但接受了廠商禮物。");
  assert.ok(ids.includes("gift-over-limit"));
  assert.ok(!ids.includes("bribe-kickback"));
});

test("否定句：否定收禮但收受回扣 → 只命中回扣規則", () => {
  const ids = idsOf("沒有收受廠商禮物，但收取了廠商回扣。");
  assert.ok(ids.includes("bribe-kickback"));
  assert.ok(!ids.includes("gift-over-limit"));
});

test("否定句：未參與招標 → 不命中招標揭露規則", () => {
  assert.ok(!idsOf("某採購人員的配偶未參與招標。").includes("conflict-family"));
});

test("否定句：未取得客戶個資 → 不命中個資外洩規則", () => {
  assert.ok(!idsOf("某員工未取得客戶個資。").includes("customer-data-leak"));
});

test("否定句：不得誤殺以「未申報／未揭露」為正面要件的規則", () => {
  const ids = idsOf("某採購人員收受廠商禮物但未申報");
  assert.ok(ids.includes("gift-undeclared"), `應命中 gift-undeclared，實際：${ids.join(",")}`);
});

test("正例回歸：現有快速範例皆應有命中", () => {
  const examples = [
    "某採購主管收受廠商 2 萬元禮物，且未向主管揭露。",
    "某主管的配偶參與公司招標，他沒有向主管或稽核單位揭露。",
    "某員工把客戶個資檔案外洩給外部廠商。",
    "某員工知悉公司尚未公布的重大消息，在財報封閉期間買賣公司股票。",
    "某主管對提出檢舉的員工進行報復和霸凌。",
    "同事的爸媽是單位主管，兒女在同一單位上班。",
    "主管與下屬私下借貸，且未向公司申請核准。",
    "採購人員的配偶在投標廠商任職，未揭露。",
    "員工與供應商頻繁餐敘，且收受小額禮物未申報。"
  ];
  for (const example of examples) {
    const ids = idsOf(example);
    assert.ok(ids.length > 0, `範例無命中：${example}`);
  }
});

test("正例：爸媽／兒女用語命中親屬同單位規則", () => {
  const ids = idsOf("同事的爸媽是單位主管，兒女在同一單位上班。");
  assert.ok(ids.includes("conflict-family-supervisor"), `應命中 conflict-family-supervisor，實際：${ids.join(",")}`);
});

test("正例：洩漏客戶個資 → customer-data-leak 且回報命中關鍵字", () => {
  const text = "某員工洩漏客戶個資給外部廠商。";
  const results = matchRules(text);
  const match = results.find((m) => m.rule.id === "customer-data-leak");
  assert.ok(match, "應命中 customer-data-leak");
  assert.ok(match.matchedKeywords.includes("個資"), `命中關鍵字應含「個資」，實際：${match.matchedKeywords.join(",")}`);
  assert.equal(match.rule.status, "violated");
});

test("正例：封閉期間買賣股票 → 內線交易與封閉期間規則皆命中", () => {
  const ids = idsOf("某員工知悉公司尚未公布的重大消息，在財報封閉期間買賣公司股票。");
  assert.ok(ids.includes("insider-trading"));
  assert.ok(ids.includes("insider-blackout"));
});

test("排序：狀態優先，其次嚴重度，再其次命中數", () => {
  const text = "某員工收受廠商禮物，並在財報封閉期間買賣公司股票。";
  const results = matchRules(text);
  const order = results.map((m) => m.rule.id);
  const tradingIdx = order.indexOf("insider-trading");
  const blackoutIdx = order.indexOf("insider-blackout");
  const giftIdx = order.indexOf("gift-over-limit");
  assert.ok(tradingIdx > -1 && blackoutIdx > -1 && giftIdx > -1, `應命中三條規則，實際：${order.join(",")}`);
  assert.ok(tradingIdx < blackoutIdx, "同為已違反時，嚴重度最高者在前");
  assert.ok(blackoutIdx < giftIdx, "已違反應排在可能違反之前");
  assert.equal(results[0].rule.id, "insider-trading");
});

test("排序：同嚴重度時命中數多者在前", () => {
  const text = "某採購人員收受廠商禮物、款待與應酬。";
  const results = matchRules(text);
  assert.ok(results.length > 0);
  const hits = results.map((m) => m.hits);
  for (let i = 1; i < hits.length; i += 1) {
    assert.ok(hits[i - 1] >= hits[i], "命中數應遞減");
  }
});

test("法令層：重點規則具備對應法令條目", () => {
  const expected = {
    "insider-trading": ["證券交易法"],
    "customer-data-leak": ["個人資料保護法"],
    "trade-secret-leak": ["營業秘密法", "刑法"],
    "tax-evasion": ["稅捐稽徵法"],
    "political-donation": ["政治獻金法"],
    "unfair-competition": ["公平交易法"]
  };
  for (const [id, lawNames] of Object.entries(expected)) {
    const statutes = STATUTES[id];
    assert.ok(statutes && statutes.length > 0, `${id} 應有法令條目`);
    for (const name of lawNames) {
      assert.ok(statutes.some((s) => s.name === name), `${id} 應引用 ${name}`);
    }
  }
});

test("法令層：非重點規則不誤標法令", () => {
  const noStatuteIds = ["conflict-family", "gift-over-limit", "supplier-social-overlap"];
  for (const id of noStatuteIds) {
    assert.equal(STATUTES[id], undefined, `${id} 不應有法令條目`);
  }
});
