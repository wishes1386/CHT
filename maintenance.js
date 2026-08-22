/* maintenance.js — 維護檢查（法令條號／適用性、資料完整性）
 *
 * 瀏覽器與 Node 共用（UMD）：
 *   - 瀏覽器：window.CHT_MAINTENANCE.runChecks()
 *   - Node   ：require("./maintenance.js")
 *
 * 用途：網站「維護檢查」按鈕的檢查引擎，
 * 供規則資料與法令引用（data/statutes.js）之例行維護使用。
 */
(function (root) {
  "use strict";

  /* 已知法令名稱清單：用於抓出誤植的法律名稱 */
  const KNOWN_LAWS = [
    "刑法", "民法", "公司法", "營業秘密法", "個人資料保護法", "證券交易法",
    "公平交易法", "政府採購法", "政治獻金法", "稅捐稽徵法", "性騷擾防治法",
    "性別平等工作法", "就業服務法", "勞動基準法", "人口販運防制法", "洗錢防制法"
  ];

  /* 條號格式：第 N 條、第 N、M 條、第 N～M 條、第 N 條第 X 項、第 13-1 條等 */
  const NUM = "[0-9０-９一二三四五六七八九十百千]+(?:-[0-9０-９]+)?";
  const ARTICLE_PATTERN = new RegExp(
    "^第\\s*" + NUM + "(?:[、，]\\s*第?\\s*" + NUM + ")*(?:\\s*[～~至]\\s*第?\\s*" + NUM + ")?\\s*條" +
    "(?:\\s*第\\s*[0-9０-９一二三四五六七八九十百千]+\\s*項)?$"
  );
  const SPECIAL_ARTICLES = new Set(["（整體適用）"]);

  function getPolicies() {
    return (root && root.CHT_POLICIES) || [];
  }
  function getStatutes() {
    return (root && root.CHT_STATUTES) || {};
  }
  function getSources() {
    return (root && root.CHT_SOURCES) || {};
  }
  function getMeta() {
    return (root && root.CHT_DATA_META) || null;
  }

  function result(level, label, detail) {
    return { level, label, detail: detail || "" };
  }

  function isValidArticle(article) {
    if (!article) return false;
    if (SPECIAL_ARTICLES.has(article)) return true;
    return ARTICLE_PATTERN.test(article);
  }

  /* ---- 規則資料完整性 ---- */
  function checkRuleData() {
    const out = [];
    const policies = getPolicies();

    out.push(result(
      policies.length === 51 ? "pass" : "warn",
      `規則總數：${policies.length} 條`,
      policies.length === 51 ? "與預期 51 條相符" : "與預期（51）不同，請確認是否為預期變更"
    ));

    const ids = policies.map((r) => r.id);
    const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    out.push(result(
      dup.length === 0 ? "pass" : "fail",
      "規則 id 唯一性",
      dup.length ? `重複：${dup.join("、")}` : "無重複"
    ));

    const requiredFields = ["id", "category", "title", "document", "article", "status", "severity", "summary", "keywords", "reports", "channels"];
    const missing = [];
    for (const rule of policies) {
      for (const field of requiredFields) {
        if (rule[field] === undefined || rule[field] === null || rule[field] === "") {
          missing.push(`${rule.id}.${field}`);
        }
      }
    }
    out.push(result(
      missing.length === 0 ? "pass" : "fail",
      "規則必要欄位",
      missing.length ? `缺少：${missing.slice(0, 5).join("、")}${missing.length > 5 ? ` 等 ${missing.length} 處` : ""}` : "全部完整"
    ));

    const badStatus = policies.filter((r) => !["violated", "possible"].includes(r.status));
    const badSeverity = policies.filter((r) => !["最高", "高", "中"].includes(r.severity));
    out.push(result(
      badStatus.length === 0 && badSeverity.length === 0 ? "pass" : "fail",
      "status / severity 列舉值",
      badStatus.length || badSeverity.length
        ? `status 異常：${badStatus.map((r) => r.id).join("、")}；severity 異常：${badSeverity.map((r) => r.id).join("、")}`
        : "全部合法"
    ));

    const emptyKw = policies.filter((r) => !r.keywords || r.keywords.length === 0 || r.keywords.some((k) => !k));
    out.push(result(
      emptyKw.length === 0 ? "pass" : "fail",
      "關鍵字非空",
      emptyKw.length ? `異常規則：${emptyKw.map((r) => r.id).join("、")}` : "全部合法"
    ));

    const withQuote = policies.filter((r) => r.quote);
    out.push(result(
      withQuote.length >= 40 ? "pass" : "warn",
      `原文摘錄覆蓋率：${withQuote.length}/${policies.length}`,
      withQuote.length >= 40 ? "多數規則已附原文摘錄" : "低於 40 條，建議補齊"
    ));

    const meta = getMeta();
    out.push(result(
      meta && meta.version && /^\d{4}-\d{2}-\d{2}$/.test(meta.reviewedAt || "") ? "pass" : "warn",
      "資料版本中繼資料",
      meta ? `v${meta.version}（${meta.reviewedAt} 校對）` : "缺少 CHT_DATA_META"
    ));

    return out;
  }

  /* ---- 法令引用：條號與適用性 ---- */
  function checkStatutes() {
    const out = [];
    const policies = getPolicies();
    const statutes = getStatutes();
    const ruleIds = new Set(policies.map((r) => r.id));

    const badKeys = Object.keys(statutes).filter((id) => !ruleIds.has(id));
    out.push(result(
      badKeys.length === 0 ? "pass" : "fail",
      "法令引用對應規則 id",
      badKeys.length ? `不存在之規則：${badKeys.join("、")}` : "全部對應存在"
    ));

    const missingField = [];
    const badArticle = [];
    const unknownLaw = [];
    const missingNote = [];
    let total = 0;
    for (const [id, list] of Object.entries(statutes)) {
      for (const s of list) {
        total += 1;
        if (!s.name || !s.article) missingField.push(id);
        if (s.article && !isValidArticle(s.article)) badArticle.push(`${id} → ${s.name} ${s.article}`);
        if (s.name && !KNOWN_LAWS.includes(s.name)) unknownLaw.push(`${id} → ${s.name}`);
        if (!s.note) missingNote.push(`${id} → ${s.name} ${s.article}`);
      }
    }

    out.push(result(
      missingField.length === 0 ? "pass" : "fail",
      "法令條目必填欄位（name / article）",
      missingField.length ? `缺少欄位：${missingField.slice(0, 5).join("、")}` : "全部完整"
    ));
    out.push(result(
      badArticle.length === 0 ? "pass" : "fail",
      "條號格式（第 N 條／第 N、M 條／第 N～M 條）",
      badArticle.length ? `格式異常：${badArticle.slice(0, 5).join("；")}` : "全部符合格式"
    ));
    out.push(result(
      unknownLaw.length === 0 ? "pass" : "warn",
      "法令名稱於已知清單",
      unknownLaw.length
        ? `未在已知清單：${unknownLaw.slice(0, 5).join("；")}（可能是新法令或誤植，請確認）`
        : `全部為已知法令（${KNOWN_LAWS.length} 部）`
    ));
    out.push(result(
      missingNote.length === 0 ? "pass" : "warn",
      "適用性說明（note）",
      missingNote.length
        ? `缺適用性說明：${missingNote.slice(0, 5).join("；")}`
        : `全部附適用性說明（共 ${total} 筆）`
    ));

    return out;
  }

  /* ---- 官方連結（瀏覽器最佳努力） ---- */
  async function checkLinksBestEffort() {
    const sources = getSources();
    const urls = [...new Set(Object.values(sources).map((s) => s && s.url).filter(Boolean))];
    let ok = 0;
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: "HEAD", mode: "cors", redirect: "follow" });
        if (res.ok) ok += 1;
      } catch {
        /* 跨域被擋，列入無法驗證 */
      }
    }
    if (ok === urls.length) {
      return result("pass", `官方連結（瀏覽器）：${ok}/${urls.length} 可達`);
    }
    return result(
      "warn",
      `官方連結（瀏覽器）：${ok}/${urls.length} 可達`,
      "部分或全部連結因瀏覽器跨域（CORS）限制無法在頁面內驗證；請於維護時執行 npm run check:links 做完整檢查"
    );
  }

  /* ---- 主入口 ---- */
  async function runChecks({ checkLinks = false } = {}) {
    const results = [
      result("pass", "檢查範圍：規則資料完整性 + 法令引用（條號／適用性）", "供規則資料與 data/statutes.js 之例行維護使用"),
      ...checkRuleData(),
      ...checkStatutes()
    ];
    if (checkLinks) {
      results.push(await checkLinksBestEffort());
    }
    return results;
  }

  const api = {
    runChecks,
    checkRuleData,
    checkStatutes,
    isValidArticle,
    KNOWN_LAWS
  };

  root.CHT_MAINTENANCE = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
