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

let lastQuery = "";

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
  doc.textContent = `${rule.document}  ${rule.article}`;

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
    return;
  }

  for (const match of matches) {
    resultList.append(buildRuleElement(match));
  }
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
}

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
  resultsSection.hidden = true;
  resultList.replaceChildren();
  input.focus();
});

document.querySelectorAll(".example-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.example;
    runQuery();
  });
});

buildCategoryFilters();
