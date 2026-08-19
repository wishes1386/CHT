const input = document.getElementById("behavior-input");
const queryButton = document.getElementById("query-button");
const clearButton = document.getElementById("clear-button");
const categoryList = document.getElementById("category-list");
const onlyViolated = document.getElementById("only-violated");
const resultsSection = document.getElementById("results");
const summaryTitle = document.getElementById("summary-title");
const summaryText = document.getElementById("summary-text");
const resultList = document.getElementById("result-list");
const countViolated = document.getElementById("count-violated");
const countPossible = document.getElementById("count-possible");
const countClean = document.getElementById("count-clean");
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

const REQUIRED = {
  "trade-secret-leak": ["營業秘密", "商業機密", "機密"],
  "customer-data-leak": ["個資", "個人資料", "客戶資料"],
  "internal-doc-leak": ["內部文件", "文件外洩", "資料外洩"],
  "cyber-incident": ["資安", "資通安全", "駭客", "攻擊", "漏洞", "未授權存取"],
  "ai-sensitive": ["AI", "人工智慧", "生成內容", "影像特徵", "行為軌跡"],
  "insider-trading": ["內線", "未公開", "重大消息", "股票", "封閉期間"],
  "insider-blackout": ["封閉期間", "財報前", "年報前", "季報前", "閉鎖期"],
  "insider-leak": ["洩漏", "重大消息", "未公開資訊", "內幕"],
  "harassment": ["騷擾", "性騷擾", "性暗示", "觸摸", "親吻", "色情"],
  "discrimination": ["歧視", "種族", "性別", "宗教", "身心障礙", "不平等"],
  "supplier-bribe": ["供應商", "承包商", "包商", "賄賂", "回扣", "佣金"],
  "supplier-record": ["偽造", "供應商", "虛報", "假帳"],
  "supplier-subcontract": ["轉包", "分包", "代為履行"],
  "supplier-labor": ["童工", "強迫勞動", "超時", "60小時", "扣薪", "奴役", "人口販運"],
  "procurement-complaint": ["採購", "申訴", "招標", "標案", "投標"],
  "report-violation": ["檢舉", "通報", "發現違規", "疑似違規", "知情不報"]
};

const NEGATED_PHRASES = [
  "沒有洩漏", "未洩漏", "不曾洩漏", "沒有外洩", "未外洩",
  "沒有違反", "未違反", "沒有收受", "未收受", "沒有提供", "未提供",
  "沒有交易", "未交易", "沒有參與", "未參與", "沒有利用", "未利用",
  "沒有賄賂", "未賄賂", "沒有性騷擾", "未性騷擾"
  , "沒有收受回扣", "未收受回扣", "沒有收禮", "未收禮", "沒有行賄", "未行賄",
  "沒有造假", "未造假", "沒有偽造", "未偽造", "沒有虛報", "未虛報"
];

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, "");
}

function isNegated(text, keyword) {
  return NEGATED_PHRASES.some((phrase) => phrase.includes(keyword) && text.includes(phrase));
}

function matchRules(text) {
  const normalized = normalize(text);
  const results = [];

  for (const rule of window.CHT_POLICIES) {
    const required = REQUIRED[rule.id];
    let hits = 0;
    let requiredHit = false;

    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword) && !isNegated(normalized, keyword)) {
        hits += 1;
        if (required && required.includes(keyword)) {
          requiredHit = true;
        }
      }
    }

    if (hits === 0) {
      continue;
    }
    if (required && !requiredHit) {
      continue;
    }
    if (rule.requiredGroups) {
      const groupsOk = rule.requiredGroups.every((group) =>
        group.some((keyword) => normalized.includes(keyword) && !isNegated(normalized, keyword))
      );
      if (!groupsOk) {
        continue;
      }
    }
    if (rule.negatable && NEGATED_PHRASES.some((phrase) => normalized.includes(phrase) && rule.keywords.some((keyword) => phrase.includes(keyword)))) {
      continue;
    }

    results.push({ rule, hits, status: rule.status });
  }

  results.sort((a, b) => {
    if (a.rule.status !== b.rule.status) {
      return a.rule.status === "violated" ? -1 : 1;
    }
    return b.hits - a.hits;
  });

  return results;
}

function statusLabel(status) {
  if (status === "violated") return "已違反";
  if (status === "possible") return "可能違反";
  return "未違反";
}

function buildRuleElement(match) {
  const { rule } = match;
  const card = document.createElement("article");
  card.className = `rule-result ${rule.status}`;

  const head = document.createElement("div");
  head.className = "rule-head";

  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = rule.category;

  const badge = document.createElement("span");
  badge.className = `status-badge ${rule.status}`;
  badge.textContent = statusLabel(rule.status);

  head.append(category, badge);

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

  card.append(head, title, doc, summary, linksLabel, channelsHeading, channels);
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

  const violatedCount = matches.filter((m) => m.rule.status === "violated").length;
  const possibleCount = matches.filter((m) => m.rule.status === "possible").length;
  const cleanCount = matches.filter((m) => m.rule.status !== "violated" && m.rule.status !== "possible").length;
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

function runQuery() {
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  lastQuery = value;
  const rawMatches = matchRules(value);
  let matches = rawMatches;
  const selectedCategories = new Set(
    [...document.querySelectorAll("#category-list input:checked")].map((box) => box.value)
  );
  matches = matches.filter((match) => selectedCategories.has(match.rule.category));
  if (onlyViolated.checked) {
    matches = matches.filter((match) => match.rule.status === "violated");
  }
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  render(matches, value, rawMatches.length > 0 && matches.length === 0);
  currentMatches = matches;
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
  for (const head of ["判斷", "違反事項", "規範與條文", "判斷理由", "建議處理"]) {
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
    const docTd = document.createElement("td");
    docTd.textContent = `${rule.document} ${rule.article}`;
    const reasonTd = document.createElement("td");
    reasonTd.textContent = rule.summary;
    const actionTd = document.createElement("td");
    actionTd.textContent = rule.channels.join("；");
    tr.append(statusCell(rule.status), titleTd, docTd, reasonTd, actionTd);
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

  doc.append(letterhead, docMeta, info, behaviorSection, resultSection, conclusionSection, note, footer);
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
  runQuery();
}

categoryList.addEventListener("change", refreshQuery);
onlyViolated.addEventListener("change", refreshQuery);

queryButton.addEventListener("click", runQuery);

input.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    runQuery();
  }
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
  input.focus();
});

document.querySelectorAll(".example-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.example;
    runQuery();
  });
});

buildCategoryFilters();
