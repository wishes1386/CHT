const input = document.getElementById("behavior-input");
const queryButton = document.getElementById("query-button");
const clearButton = document.getElementById("clear-button");
const copyLinkButton = document.getElementById("copy-link-button");
const categoryList = document.getElementById("category-list");
const onlyViolated = document.getElementById("only-violated");
const resultsSection = document.getElementById("results");
const summaryTitle = document.getElementById("summary-title");
const summaryText = document.getElementById("summary-text");
const resultList = document.getElementById("result-list");
const countViolated = document.getElementById("count-violated");
const countPossible = document.getElementById("count-possible");
const countClean = document.getElementById("count-clean");
const semanticToggle = document.getElementById("semantic-toggle");
const semanticStatus = document.getElementById("semantic-status");
const semanticProgress = document.getElementById("semantic-progress");
const queryButtonLabel = document.getElementById("query-button-label");
const ruleCount = document.getElementById("rule-count");
const dataVersion = document.getElementById("data-version");
const exportCsvButton = document.getElementById("export-csv");
const exportJsonButton = document.getElementById("export-json");
const runMaintenanceButton = document.getElementById("run-maintenance");
const maintPanel = document.getElementById("maint-panel");
const maintClose = document.getElementById("maint-close");
const maintSummary = document.getElementById("maint-summary");
const maintResults = document.getElementById("maint-results");
const reportPrompt = document.getElementById("report-prompt");
const openReportButton = document.getElementById("open-report");
const dismissReportButton = document.getElementById("dismiss-report");
const reportBuilder = document.getElementById("report-builder");
const reportCase = document.getElementById("report-case");
const reportSubject = document.getElementById("report-subject");
const reportUnit = document.getElementById("report-unit");
const reportDate = document.getElementById("report-date");
const reportDesc = document.getElementById("report-desc");
const reportAuthor = document.getElementById("report-author");
const generateReportButton = document.getElementById("generate-report");
const printReportButton = document.getElementById("print-report");
const reportOutput = document.getElementById("report-output");

let lastQuery = "";
let currentMatches = [];
let semanticModel = null;
let ruleEmbeddings = null;
let semanticError = false;
let semanticLoading = false;
let semanticPreloadStarted = false;

/* 比對引擎自 matcher.js 匯入（瀏覽器全域） */
const { matchRules, compareMatches, cosine } = window.CHT_MATCHER;
const { CHT_STATUTES = {}, CHT_STATUTES_DISCLAIMER = "" } = window;

async function loadSemanticModel() {
  if (semanticModel && ruleEmbeddings) {
    return true;
  }
  if (semanticLoading) {
    return false;
  }
  semanticLoading = true;
  semanticStatus.textContent = "語意模型：載入中，首次使用需下載";
  try {
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
    semanticModel = await pipeline("feature-extraction", "Xenova/multilingual-e5-small", {
      quantized: true,
      progress_callback: (progress) => {
        if (progress.status === "progress" && typeof progress.progress === "number") {
          const pct = Math.round(progress.progress);
          semanticProgress.value = pct;
          semanticProgress.hidden = false;
          semanticStatus.textContent = `語意模型：下載中 ${pct}%`;
        }
      }
    });
    semanticProgress.hidden = true;
    ruleEmbeddings = [];
    for (const rule of window.CHT_POLICIES) {
      const text = `passage: ${rule.category} ${rule.title} ${rule.summary} ${rule.document} ${rule.article}`;
      const output = await semanticModel(text, { pooling: "mean", normalize: true });
      ruleEmbeddings.push(Array.from(output.data));
    }
    semanticStatus.textContent = "語意模型：已就緒（已快取，可離線使用）";
    return true;
  } catch (error) {
    semanticError = true;
    semanticProgress.hidden = true;
    semanticStatus.textContent = "語意模型：載入失敗，已使用關鍵字比對";
    return false;
  } finally {
    semanticLoading = false;
  }
}

/* 背景預載：使用者首次與查詢區互動時才下載模型，避免被動訪客白白耗流量 */
function maybePreloadSemantic() {
  if (semanticPreloadStarted || !semanticToggle.checked || semanticError || semanticModel) {
    return;
  }
  semanticPreloadStarted = true;
  semanticStatus.textContent = "語意模型：背景預載中（首次約需下載 113 MB）";
  void loadSemanticModel();
}

async function semanticMatches(text) {
  if (!semanticModel || !ruleEmbeddings) {
    return [];
  }
  const output = await semanticModel(`query: ${text}`, { pooling: "mean", normalize: true });
  const queryVector = Array.from(output.data);
  const results = [];
  for (let i = 0; i < window.CHT_POLICIES.length; i += 1) {
    const similarity = cosine(queryVector, ruleEmbeddings[i]);
    if (similarity >= 0.36) {
      results.push({ rule: window.CHT_POLICIES[i], status: window.CHT_POLICIES[i].status, hits: 0, score: similarity });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 12);
}

async function matchAll(text) {
  const keywordMatches = matchRules(text).map((match) => ({ ...match, source: "keyword", score: match.hits }));
  const merged = new Map(keywordMatches.map((match) => [match.rule.id, match]));

  if (semanticToggle.checked && !semanticError) {
    const loaded = await loadSemanticModel();
    if (loaded) {
      const semanticResults = await semanticMatches(text);
      for (const match of semanticResults) {
        const existing = merged.get(match.rule.id);
        if (existing) {
          existing.score = Math.max(existing.score, match.score);
        } else {
          merged.set(match.rule.id, { ...match, source: "semantic", status: "possible" });
        }
      }
    }
  }

  const results = [...merged.values()];
  results.sort(compareMatches);
  return results;
}

function statusLabel(status) {
  if (status === "violated") return "已違反";
  if (status === "possible") return "可能違反";
  return "未違反";
}

function severityLabel(severity) {
  if (severity === "最高") return "嚴重度：最高";
  if (severity === "高") return "嚴重度：高";
  if (severity === "中") return "嚴重度：中";
  return "";
}

function statutesFor(rule) {
  return (CHT_STATUTES && CHT_STATUTES[rule.id]) || [];
}

function buildRuleElement(match) {
  const { rule } = match;
  const card = document.createElement("article");
  card.className = `rule-result ${match.status}`;

  const head = document.createElement("div");
  head.className = "rule-head";

  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = rule.category;

  const badge = document.createElement("span");
  badge.className = `status-badge ${match.status}`;
  badge.textContent = statusLabel(match.status);

  head.append(category, badge);
  if (rule.severity) {
    const severity = document.createElement("span");
    severity.className = `severity-badge severity-${rule.severity}`;
    severity.textContent = severityLabel(rule.severity);
    severity.title = "依條文性質的初步嚴重度分級";
    head.append(severity);
  }
  if (match.source === "semantic") {
    const sourceTag = document.createElement("span");
    sourceTag.className = "source-tag";
    sourceTag.textContent = "語意比對";
    head.append(sourceTag);
    if (typeof match.score === "number") {
      const scoreTag = document.createElement("span");
      scoreTag.className = "score-tag";
      scoreTag.textContent = `語意相似度 ${match.score.toFixed(2)}`;
      scoreTag.title = "與規則內容的語意相似度（0–1），越高越相關";
      head.append(scoreTag);
    }
  }

  const title = document.createElement("h3");
  title.className = "rule-title";
  title.textContent = rule.title;

  const doc = document.createElement("p");
  doc.className = "rule-doc";
  const docName = document.createElement("span");
  docName.className = "doc-name";
  docName.textContent = rule.document;
  const docArticle = document.createElement("span");
  docArticle.className = "doc-article";
  docArticle.textContent = rule.article;
  doc.append(docName, "  ", docArticle);

  const summary = document.createElement("p");
  summary.className = "rule-summary";
  summary.textContent = rule.summary;

  let quoteBlock = null;
  if (rule.quote) {
    quoteBlock = document.createElement("blockquote");
    quoteBlock.className = "rule-quote";
    const quoteLabel = document.createElement("span");
    quoteLabel.className = "rule-quote-label";
    quoteLabel.textContent = "原文摘錄（節錄）";
    const quoteText = document.createElement("p");
    quoteText.textContent = rule.quote;
    quoteBlock.append(quoteLabel, quoteText);
  }

  const links = document.createElement("ul");
  links.className = "rule-links";
  for (const report of rule.reports) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = report.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = report.label;
    item.append(link);
    links.append(item);
  }

  const linksLabel = document.createElement("div");
  linksLabel.className = "rule-links-label";
  const linksHeading = document.createElement("p");
  linksHeading.className = "rule-doc";
  linksHeading.textContent = "相關條文與報告書";
  linksLabel.append(linksHeading, links);

  const channelsHeading = document.createElement("p");
  channelsHeading.className = "rule-doc";
  channelsHeading.textContent = "建議處理或通報";

  const channels = document.createElement("ul");
  channels.className = "rule-channels";
  for (const channel of rule.channels) {
    const item = document.createElement("li");
    item.textContent = channel;
    channels.append(item);
  }

  let kwLabel = null;
  let kwList = null;
  if (match.matchedKeywords && match.matchedKeywords.length > 0) {
    kwLabel = document.createElement("p");
    kwLabel.className = "rule-doc rule-section-label";
    kwLabel.textContent = "命中關鍵字";
    kwList = document.createElement("ul");
    kwList.className = "keyword-chips";
    for (const keyword of match.matchedKeywords) {
      const item = document.createElement("li");
      item.className = "keyword-chip";
      item.textContent = keyword;
      kwList.append(item);
    }
  }

  let hint = null;
  if (match.status === "possible") {
    hint = document.createElement("p");
    hint.className = "possible-hint";
    hint.textContent = "此項屬「可能違反」，需確認金額、是否揭露、是否經主管同意、是否通報等細節後再行認定。";
  }

  const statutes = statutesFor(rule);
  let statutesHeading = null;
  let statutesList = null;
  if (statutes.length > 0) {
    statutesHeading = document.createElement("p");
    statutesHeading.className = "rule-doc rule-section-label";
    statutesHeading.textContent = "相關法令（僅供參考）";
    statutesList = document.createElement("ul");
    statutesList.className = "rule-statutes";
    for (const statute of statutes) {
      const item = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = statute.name;
      const article = document.createElement("span");
      article.className = "statute-article";
      article.textContent = statute.article;
      const note = document.createElement("span");
      note.className = "statute-note";
      note.textContent = statute.note ? `（${statute.note}）` : "";
      item.append(name, " ", article, " ", note);
      statutesList.append(item);
    }
  }

  card.append(
    head,
    title,
    doc,
    summary,
    ...(quoteBlock ? [quoteBlock] : []),
    ...(kwLabel && kwList ? [kwLabel, kwList] : []),
    ...(hint ? [hint] : []),
    linksLabel,
    channelsHeading,
    channels,
    ...(statutesHeading && statutesList ? [statutesHeading, statutesList] : [])
  );
  return card;
}

function renderNoMatch(filteredOut) {
  const panel = document.createElement("div");
  panel.className = "no-match";

  const title = document.createElement("h3");
  title.textContent = filteredOut ? "篩選條件下無符合結果" : "未發現明確違反項目";

  const body = document.createElement("p");
  body.textContent = filteredOut
    ? "目前輸入內容有對應規範，但被目前的類別或狀態篩選排除。請調整篩選條件後重新查詢。"
    : "目前輸入內容未對應到公開規範中的明確違規要件。可補充職員職務、金額、是否揭露、是否經手文件或是否已通報等細節後再查詢。";

  panel.append(title, body);
  return panel;
}

function render(matches, inputText, filteredOut) {
  resultList.replaceChildren();
  reportOutput.replaceChildren();
  reportBuilder.hidden = true;
  printReportButton.hidden = true;

  const violatedCount = matches.filter((m) => m.status === "violated").length;
  const possibleCount = matches.filter((m) => m.status === "possible").length;
  const cleanCount = matches.filter((m) => m.status !== "violated" && m.status !== "possible").length;
  countViolated.textContent = violatedCount;
  countPossible.textContent = possibleCount;
  countClean.textContent = cleanCount;

  if (violatedCount > 0) {
    summaryTitle.textContent = "查詢結果：發現違反項目";
    summaryText.textContent = `依你描述的行為，對應 ${violatedCount} 項已違反、${possibleCount} 項可能違反之公司規定。`;
  } else if (possibleCount > 0) {
    summaryTitle.textContent = "查詢結果：可能違反";
    summaryText.textContent = `依你描述的行為，對應 ${possibleCount} 項可能違反之公司規定，需視細節確認。`;
  } else {
    summaryTitle.textContent = "查詢結果：未發現明確違反";
    summaryText.textContent = `輸入：${inputText}`;
  }

  if (matches.length === 0) {
    resultList.append(renderNoMatch(filteredOut));
    reportPrompt.hidden = true;
    return;
  }

  for (const match of matches) {
    resultList.append(buildRuleElement(match));
  }
  reportPrompt.hidden = false;
}

async function runQuery() {
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  lastQuery = value;
  queryButton.disabled = true;
  queryButtonLabel.textContent = "判斷中...";
  try {
    const rawMatches = await matchAll(value);
    let matches = rawMatches;
    const selectedCategories = new Set(
      [...document.querySelectorAll("#category-list input:checked")].map((box) => box.value)
    );
    matches = matches.filter((match) => selectedCategories.has(match.rule.category));
    if (onlyViolated.checked) {
      matches = matches.filter((match) => match.status === "violated");
    }
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    render(matches, value, rawMatches.length > 0 && matches.length === 0);
    currentMatches = matches;
    updateShareHash(value);
  } finally {
    queryButton.disabled = false;
    queryButtonLabel.textContent = "執行查詢";
  }
}

function todayISO() {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function reportId() {
  const stamp = todayISO().replaceAll("-", "");
  const time = new Date().toTimeString().slice(0, 2) + new Date().toTimeString().slice(3, 5);
  return `CHT-RPT-${stamp}-${time}`;
}

function reportSection(title, number) {
  const section = document.createElement("section");
  section.className = "report-section";
  const heading = document.createElement("h4");
  const num = document.createElement("span");
  num.className = "report-section-number";
  num.textContent = number;
  heading.append(num, document.createTextNode(title));
  section.append(heading);
  return section;
}

function statusCell(status) {
  const td = document.createElement("td");
  const span = document.createElement("span");
  span.className = `report-status ${status}`;
  span.textContent = statusLabel(status);
  td.append(span);
  return td;
}

function infoTable(items) {
  const table = document.createElement("table");
  table.className = "report-info-table";
  const tbody = document.createElement("tbody");
  for (const [label, value] of items) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = label;
    const td = document.createElement("td");
    td.textContent = value;
    tr.append(th, td);
    tbody.append(tr);
  }
  table.append(tbody);
  return table;
}

function buildReport() {
  const doc = document.createElement("div");
  doc.className = "report-document";

  const letterhead = document.createElement("div");
  letterhead.className = "report-letterhead";
  const mark = document.createElement("div");
  mark.className = "report-letterhead-mark";
  mark.textContent = "CHT";
  const titleBlock = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = "中華電信行為違規查詢報告書";
  const enTitle = document.createElement("p");
  enTitle.textContent = "CHT Compliance Inquiry Report";
  titleBlock.append(h3, enTitle);
  letterhead.append(mark, titleBlock);

  const docMeta = document.createElement("div");
  docMeta.className = "report-doc-meta";
  const metaItems = [
    ["文件編號", reportId()],
    ["查詢日期", reportDate.value || todayISO()],
    ["密等", "內部使用"],
    ["頁次", "1 / 1"]
  ];
  for (const [label, value] of metaItems) {
    const span = document.createElement("span");
    span.textContent = `${label}：${value}`;
    docMeta.append(span);
  }

  const info = infoTable([
    ["案件名稱", reportCase.value.trim() || "行為違規查詢案"],
    ["被查詢人", reportSubject.value.trim() || "未填寫"],
    ["單位 / 職稱", reportUnit.value.trim() || "未填寫"],
    ["填表人", reportAuthor.value.trim() || "未填寫"]
  ]);

  const behaviorSection = reportSection("查詢對象與行為描述", "壹");
  const behavior = document.createElement("p");
  behavior.className = "report-behavior";
  behavior.textContent = reportDesc.value.trim() || lastQuery;
  behaviorSection.append(behavior);

  const resultSection = reportSection("查詢結果", "貳");
  const summary = document.createElement("p");
  summary.className = "report-summary-line";
  summary.textContent = summaryText.textContent;
  const table = document.createElement("table");
  table.className = "violation-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const head of ["判斷", "違反事項", "嚴重度", "規範與條文", "判斷理由", "建議處理", "相關法令"]) {
    const th = document.createElement("th");
    th.textContent = head;
    headRow.append(th);
  }
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  for (const match of currentMatches) {
    const { rule } = match;
    const tr = document.createElement("tr");
    const titleTd = document.createElement("td");
    titleTd.textContent = rule.title;
    const severityTd = document.createElement("td");
    severityTd.textContent = rule.severity || "—";
    const docTd = document.createElement("td");
    docTd.textContent = `${rule.document} ${rule.article}`;
    const reasonTd = document.createElement("td");
    reasonTd.textContent = rule.summary;
    const actionTd = document.createElement("td");
    actionTd.textContent = rule.channels.join("；");
    const statutes = statutesFor(rule);
    const statutesTd = document.createElement("td");
    statutesTd.textContent = statutes.length
      ? statutes.map((s) => `${s.name} ${s.article}`).join("；")
      : "—";
    tr.append(statusCell(match.status), titleTd, severityTd, docTd, reasonTd, actionTd, statutesTd);
    tbody.append(tr);
  }
  table.append(thead, tbody);
  resultSection.append(summary, table);

  const conclusionSection = reportSection("結論與後續處理", "參");
  const conclusion = document.createElement("p");
  conclusion.textContent = "依查詢結果，建議依上表對應之規範與條文進行確認；若屬違規，應依公司檢舉或通報程序辦理，必要時移送法務、稽核或資安等權責單位。";
  conclusionSection.append(conclusion);

  const note = document.createElement("div");
  note.className = "report-note";
  note.textContent = "本報告書僅依中華電信官網公開文件作初步判斷，正式認定仍以公司內部調查、正式條文與權責單位結論為準。";

  const statuteNote = document.createElement("div");
  statuteNote.className = "report-note";
  statuteNote.textContent = CHT_STATUTES_DISCLAIMER || "法令引用僅供參考，非法律意見。";

  const footer = document.createElement("div");
  footer.className = "report-footer";
  const signature = document.createElement("div");
  signature.className = "report-signature";
  const author = document.createElement("span");
  author.textContent = `填表人：${reportAuthor.value.trim() || "＿＿＿＿"}    日期：${reportDate.value || todayISO()}`;
  const supervisor = document.createElement("span");
  supervisor.textContent = "單位主管：＿＿＿＿";
  const reviewer = document.createElement("span");
  reviewer.textContent = "覆核：＿＿＿＿";
  signature.append(author, supervisor, reviewer);
  const seal = document.createElement("div");
  seal.className = "report-seal";
  seal.textContent = "機構章戳";
  footer.append(signature, seal);

  doc.append(letterhead, docMeta, info, behaviorSection, resultSection, conclusionSection, note, statuteNote, footer);
  reportOutput.replaceChildren(doc);
  printReportButton.hidden = false;
}

openReportButton.addEventListener("click", () => {
  reportPrompt.hidden = true;
  reportBuilder.hidden = false;
  reportOutput.replaceChildren();
  printReportButton.hidden = true;
  reportDesc.value = lastQuery;
  if (!reportDate.value) {
    reportDate.value = todayISO();
  }
  reportBuilder.scrollIntoView({ behavior: "smooth", block: "start" });
});

dismissReportButton.addEventListener("click", () => {
  reportPrompt.hidden = true;
});

generateReportButton.addEventListener("click", buildReport);

printReportButton.addEventListener("click", () => {
  window.print();
});

function buildCategoryFilters() {
  const categories = [...new Set(window.CHT_POLICIES.map((rule) => rule.category))];
  categoryList.replaceChildren();
  for (const category of categories) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = category;
    checkbox.checked = true;
    label.append(checkbox, document.createTextNode(category));
    categoryList.append(label);
  }
}

function refreshQuery() {
  if (!lastQuery) return;
  input.value = lastQuery;
  void runQuery();
}

categoryList.addEventListener("change", refreshQuery);
onlyViolated.addEventListener("change", refreshQuery);
semanticToggle.addEventListener("change", () => {
  if (!semanticToggle.checked) {
    semanticProgress.hidden = true;
    semanticStatus.textContent = "語意搜尋已停用";
  } else {
    semanticStatus.textContent = semanticModel
      ? "語意模型：已就緒"
      : semanticPreloadStarted
        ? "語意模型：載入中"
        : "語意模型：待載入";
  }
});

queryButton.addEventListener("click", () => void runQuery());

input.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    void runQuery();
  }
});

/* 分享連結：把查詢字串寫進 URL hash（#q=...） */
function updateShareHash(value) {
  if (history.replaceState) {
    history.replaceState(null, "", `#q=${encodeURIComponent(value)}`);
  } else {
    location.hash = `q=${encodeURIComponent(value)}`;
  }
}

function clearShareHash() {
  if (history.replaceState) {
    history.replaceState(null, "", location.pathname + location.search);
  } else {
    location.hash = "";
  }
}

function queryFromHash() {
  const match = location.hash.match(/^#q=(.*)$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch (error) {
    return null;
  }
}

/* 維護檢查：法令條號／適用性與資料完整性 */
const MAINT_LEVEL_LABEL = { pass: "通過", warn: "注意", fail: "失敗" };

function renderMaintenance(results) {
  maintResults.replaceChildren();
  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const item of results) {
    counts[item.level] = (counts[item.level] || 0) + 1;
    const li = document.createElement("li");
    li.className = `maint-item maint-${item.level}`;
    const mark = document.createElement("span");
    mark.className = "maint-mark";
    mark.textContent = item.level === "pass" ? "✓" : item.level === "warn" ? "!" : "✕";
    const body = document.createElement("div");
    body.className = "maint-body";
    const label = document.createElement("strong");
    label.textContent = item.label;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    body.append(label, detail);
    li.append(mark, body);
    maintResults.append(li);
  }
  const total = results.length;
  maintSummary.textContent =
    `共 ${total} 項檢查：通過 ${counts.pass} ／ 注意 ${counts.warn} ／ 失敗 ${counts.fail}` +
    (counts.fail > 0 ? "（請先修正失敗項目）" : counts.warn > 0 ? "（有項目需人工確認）" : "（全部正常）");
  maintSummary.className = `maint-summary summary-${counts.fail > 0 ? "fail" : counts.warn > 0 ? "warn" : "pass"}`;
  maintPanel.hidden = false;
}

runMaintenanceButton.addEventListener("click", async () => {
  if (!window.CHT_MAINTENANCE) {
    renderMaintenance([{ level: "fail", label: "維護檢查模組未載入", detail: "請確認 maintenance.js 已於 app.js 之前載入。" }]);
    return;
  }
  runMaintenanceButton.disabled = true;
  runMaintenanceButton.textContent = "檢查中...";
  try {
    const results = await window.CHT_MAINTENANCE.runChecks({ checkLinks: true });
    renderMaintenance(results);
  } finally {
    runMaintenanceButton.disabled = false;
    runMaintenanceButton.textContent = "維護檢查";
  }
});

maintClose.addEventListener("click", () => {
  maintPanel.hidden = true;
});

/* 匯出查詢結果 */
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const s = String(value == null ? "" : value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportRows() {
  return currentMatches.map((m) => {
    const { rule } = m;
    return [
      statusLabel(m.status),
      rule.severity,
      rule.title,
      rule.document,
      rule.article,
      rule.summary,
      rule.channels.join("；"),
      statutesFor(rule).map((s) => `${s.name} ${s.article}`).join("；")
    ];
  });
}

exportCsvButton.addEventListener("click", () => {
  if (currentMatches.length === 0) return;
  const header = ["判斷", "嚴重度", "違反事項", "規範", "條文", "判斷理由", "建議處理", "相關法令"];
  const csv = "\uFEFF" + [header, ...exportRows()].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  downloadFile(`CHT-查詢結果-${todayISO()}.csv`, csv, "text/csv;charset=utf-8");
});

exportJsonButton.addEventListener("click", () => {
  if (currentMatches.length === 0) return;
  const payload = {
    query: lastQuery,
    generatedAt: new Date().toISOString(),
    matches: currentMatches.map((m) => ({
      ruleId: m.rule.id,
      status: m.status,
      severity: m.rule.severity,
      title: m.rule.title,
      document: m.rule.document,
      article: m.rule.article,
      summary: m.rule.summary,
      quote: m.rule.quote || null,
      channels: m.rule.channels,
      statutes: statutesFor(m.rule)
    }))
  };
  downloadFile(`CHT-查詢結果-${todayISO()}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
});

/* 背景預載觸發：與查詢區互動（聚焦或點擊）時才開始下載語意模型 */
input.addEventListener("focus", maybePreloadSemantic, { once: true });
document.addEventListener("pointerdown", maybePreloadSemantic, { once: true });

copyLinkButton.addEventListener("click", async () => {
  const target = location.href;
  try {
    await navigator.clipboard.writeText(target);
    copyLinkButton.textContent = "已複製連結";
  } catch (error) {
    window.prompt("請手動複製此連結：", target);
  }
  setTimeout(() => {
    copyLinkButton.textContent = "複製連結";
  }, 2000);
});

clearButton.addEventListener("click", () => {
  input.value = "";
  lastQuery = "";
  currentMatches = [];
  resultsSection.hidden = true;
  resultList.replaceChildren();
  reportPrompt.hidden = true;
  reportBuilder.hidden = true;
  printReportButton.hidden = true;
  reportOutput.replaceChildren();
  clearShareHash();
  input.focus();
});

document.querySelectorAll(".example-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.example;
    void runQuery();
  });
});

const initialQuery = queryFromHash();
if (initialQuery) {
  input.value = initialQuery;
  void runQuery();
}

buildCategoryFilters();
ruleCount.textContent = `${window.CHT_POLICIES.length} 項判斷規則`;

if (window.CHT_DATA_META) {
  const meta = window.CHT_DATA_META;
  dataVersion.textContent = `規則資料 v${meta.version}（${meta.reviewedAt} 校對）`;
}
