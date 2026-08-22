/* matcher.js — 關鍵字比對引擎
 *
 * 瀏覽器與 Node 共用（UMD 形式）：
 *   - 瀏覽器：於 <script> 標籤載入後暴露 window.CHT_MATCHER
 *   - Node   ：require("./matcher.js") 回傳 api
 *
 * 規則資料來自 data/policies.js（window/globalThis.CHT_POLICIES）。
 */
(function (root) {
  "use strict";

  function getPolicies() {
    return (root && root.CHT_POLICIES) || [];
  }

  /* 部分規則需特定關鍵字才成立（避免單一泛用詞誤判） */
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

  /* 固定否定片語（既有機制，整段文字比對） */
  const NEGATED_PHRASES = [
    "沒有洩漏", "未洩漏", "不曾洩漏", "沒有外洩", "未外洩",
    "沒有違反", "未違反", "沒有收受", "未收受", "沒有提供", "未提供",
    "沒有交易", "未交易", "沒有參與", "未參與", "沒有利用", "未利用",
    "沒有賄賂", "未賄賂", "沒有性騷擾", "未性騷擾",
    "沒有收受回扣", "未收受回扣", "沒有收禮", "未收禮", "沒有行賄", "未行賄",
    "沒有造假", "未造假", "沒有偽造", "未偽造", "沒有虛報", "未虛報"
  ];

  /* 動詞層否定（新機制，子句範圍比對）：
   *   被否定的動詞 → 同子句內受其影響的關鍵字清單。
   *   例如「並未收受廠商禮物」中，「收受」被否定，
   *   則同子句的「禮物」「款待」等關鍵字不再視為命中。
   *
   * 刻意不放入「揭露」「申報」「陳報」等動詞，
   * 因為「未揭露／未申報」本身是部分規則的正面要件（如 gift-undeclared）。
   */
  const NEGATED_VERBS = {
    "收受": ["禮物", "餽贈", "紀念品", "款待", "回扣", "佣金", "疏通費", "賄賂", "紅包", "招待", "贈品", "好處", "不正當利益"],
    "接受": ["禮物", "餽贈", "紀念品", "款待", "回扣", "佣金", "疏通費", "賄賂", "紅包", "招待", "贈品", "好處", "不正當利益"],
    "收到": ["禮物", "餽贈", "紀念品", "回扣", "佣金", "賄賂", "紅包", "好處", "不正當利益"],
    "取得": ["禮物", "餽贈", "紀念品", "回扣", "佣金", "賄賂", "紅包", "好處", "不正當利益", "營業秘密", "商業機密", "個資", "客戶資料", "個人資料"],
    "參與": ["招標", "投標", "標案", "採購", "決標", "評選"],
    "提供": ["賄賂", "回扣", "佣金", "疏通費", "紅包", "好處", "不正當利益", "禮物", "款待", "招待", "贈品"],
    "給予": ["賄賂", "回扣", "佣金", "疏通費", "紅包", "好處", "不正當利益", "禮物", "款待", "招待"],
    "洩漏": ["營業秘密", "商業機密", "機密", "個資", "客戶資料", "個人資料", "資料外洩", "內部文件", "重大消息", "未公開資訊", "內幕", "技術資料", "配方", "客戶隱私", "電話號碼", "身分證"],
    "外洩": ["個資", "客戶資料", "個人資料", "資料外洩", "客戶隱私", "電話號碼", "身分證", "營業秘密", "商業機密", "機密", "內部文件"],
    "洩露": ["營業秘密", "商業機密", "機密", "個資", "內部文件", "重大消息", "未公開資訊"]
  };

  /* 否定詞。刻意不放單獨的「不」「無」，避免誤判「無償提供」「不定期」等語 */
  const NEGATION_MARKERS = ["並未", "未曾", "不曾", "從未", "沒有", "並無", "未"];

  /* 子句切分：句讀與轉折連接詞。否定作用不跨子句 */
  const CLAUSE_SPLIT = /[，。；、！？!?；\n]|但(?:是)?|然而|不過|惟|只是|可是/;

  function normalize(text) {
    return text.toLowerCase().replace(/\s+/g, "");
  }

  function splitClauses(text) {
    return text.split(CLAUSE_SPLIT).filter(Boolean);
  }

  /* 既有：固定否定片語（整段比對） */
  function isNegatedPhrase(text, keyword) {
    return NEGATED_PHRASES.some((phrase) => phrase.includes(keyword) && text.includes(phrase));
  }

  /* 新：動詞層否定（子句範圍）。否定動詞須出現在關鍵字之前。 */
  function isNegatedByVerb(text, keyword) {
    for (const clause of splitClauses(text)) {
      const kwIndex = clause.indexOf(keyword);
      if (kwIndex < 0) continue;
      for (const verb of Object.keys(NEGATED_VERBS)) {
        if (!NEGATED_VERBS[verb].includes(keyword)) continue;
        for (const marker of NEGATION_MARKERS) {
          const pattern = marker + verb;
          const idx = clause.indexOf(pattern);
          if (idx >= 0 && idx < kwIndex) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isNegated(text, keyword) {
    return isNegatedPhrase(text, keyword) || isNegatedByVerb(text, keyword);
  }

  /* 整條規則被否定（供 negatable 規則使用）：
   *   1) 既有片語機制：否定片語內含規則關鍵字
   *   2) 動詞機制：任一子句出現「否定詞＋動詞」，且該動詞影響的關鍵字與規則關鍵字重疊
   */
  function ruleNegated(text, rule) {
    if (NEGATED_PHRASES.some((phrase) => text.includes(phrase) && rule.keywords.some((keyword) => phrase.includes(keyword)))) {
      return true;
    }
    for (const clause of splitClauses(text)) {
      for (const verb of Object.keys(NEGATED_VERBS)) {
        if (!NEGATED_VERBS[verb].some((keyword) => rule.keywords.includes(keyword))) continue;
        for (const marker of NEGATION_MARKERS) {
          if (clause.includes(marker + verb)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function keywordMatchesFor(rule, normalized) {
    const required = REQUIRED[rule.id];
    let hits = 0;
    let requiredHit = false;
    const matchedKeywords = [];

    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword) && !isNegated(normalized, keyword)) {
        hits += 1;
        matchedKeywords.push(keyword);
        if (required && required.includes(keyword)) {
          requiredHit = true;
        }
      }
    }
    return { hits, requiredHit, matchedKeywords };
  }

  const SEVERITY_RANK = { "最高": 3, "高": 2, "中": 1 };

  /* 排序：狀態（已違反優先）→ 嚴重度 → 命中數／語意分數 */
  function compareMatches(a, b) {
    if (a.rule.status !== b.rule.status) {
      return a.rule.status === "violated" ? -1 : 1;
    }
    const sa = SEVERITY_RANK[a.rule.severity] || 0;
    const sb = SEVERITY_RANK[b.rule.severity] || 0;
    if (sa !== sb) {
      return sb - sa;
    }
    const scoreA = typeof a.score === "number" ? a.score : a.hits;
    const scoreB = typeof b.score === "number" ? b.score : b.hits;
    return scoreB - scoreA;
  }

  function matchRules(text) {
    const normalized = normalize(text);
    const results = [];

    for (const rule of getPolicies()) {
      const { hits, requiredHit, matchedKeywords } = keywordMatchesFor(rule, normalized);

      if (hits === 0) {
        continue;
      }
      const required = REQUIRED[rule.id];
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
      if (rule.negatable && ruleNegated(normalized, rule)) {
        continue;
      }

      results.push({ rule, hits, matchedKeywords, status: rule.status });
    }

    results.sort(compareMatches);
    return results;
  }

  function cosine(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i += 1) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  const api = {
    getPolicies,
    matchRules,
    compareMatches,
    cosine,
    normalize,
    splitClauses,
    isNegated,
    SEVERITY_RANK,
    NEGATED_VERBS,
    NEGATED_PHRASES,
    REQUIRED
  };

  root.CHT_MATCHER = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
