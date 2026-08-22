/* data/statutes.js — 法令層引用（與公司內規分開標示）
 *
 * 對應 data/policies.js 中各規則可能涉及的外部法令，
 * 僅供參考、非法律意見；適用與否應依具體事實由公司法務單位認定。
 * 瀏覽器與 Node 共用（UMD）。
 */
(function (root) {
  "use strict";

  root.CHT_STATUTES = {
    "private-gain": [
      { name: "刑法", article: "第 342 條", note: "背信罪，視情節適用" }
    ],
    "bribe-kickback": [
      { name: "刑法", article: "第 121、122 條", note: "具公務員身分者之受賄／行賄罪" },
      { name: "刑法", article: "第 342 條", note: "背信罪，視情節適用" },
      { name: "政府採購法", article: "第 87 條", note: "涉政府採購圍標、綁標時" }
    ],
    "political-donation": [
      { name: "政治獻金法", article: "第 7 條", note: "公營事業或政府持股逾 20% 之民營企業不得捐贈政治獻金" }
    ],
    "trade-secret-leak": [
      { name: "營業秘密法", article: "第 13-1、13-2 條", note: "侵害營業秘密之刑事責任" },
      { name: "刑法", article: "第 317 條", note: "洩漏業務上知悉之工商秘密罪" }
    ],
    "customer-data-leak": [
      { name: "個人資料保護法", article: "第 41、42 條", note: "違法蒐集利用個資之刑事責任" }
    ],
    "internal-doc-leak": [
      { name: "刑法", article: "第 317 條", note: "視文件是否屬工商秘密適用" }
    ],
    "cyber-incident": [
      { name: "刑法", article: "第 358、359、360 條", note: "妨害電腦使用罪" },
      { name: "個人資料保護法", article: "第 41 條", note: "涉個資事故時" }
    ],
    "ai-sensitive": [
      { name: "個人資料保護法", article: "第 41 條", note: "AI 應用涉個資處理違法時" }
    ],
    "insider-trading": [
      { name: "證券交易法", article: "第 157-1 條", note: "內線交易之禁止與刑事責任" }
    ],
    "insider-blackout": [
      { name: "證券交易法", article: "第 157-1 條", note: "封閉期間屬禁止交易期間" }
    ],
    "insider-leak": [
      { name: "證券交易法", article: "第 157-1 條", note: "內線消息傳遞之責任，視情節適用" },
      { name: "刑法", article: "第 317 條", note: "洩漏業務上知悉之工商秘密罪" }
    ],
    "false-financial": [
      { name: "證券交易法", article: "第 171、174 條", note: "財報不實、虛偽記載之刑事責任" },
      { name: "刑法", article: "第 215 條", note: "業務上文書登載不實罪" }
    ],
    "destroy-records": [
      { name: "刑法", article: "第 165 條", note: "湮滅刑事證據罪" }
    ],
    "false-disclosure": [
      { name: "刑法", article: "第 339 條", note: "詐欺罪，視情節適用" }
    ],
    "unfair-competition": [
      { name: "公平交易法", article: "第 15 條", note: "聯合行為之禁止" },
      { name: "公平交易法", article: "第 25 條", note: "其他足以影響交易秩序之欺罔或顯失公平行為" }
    ],
    "competitive-info": [
      { name: "公平交易法", article: "第 15 條", note: "交換敏感資訊恐構成聯合行為之虞" }
    ],
    "asset-misuse": [
      { name: "刑法", article: "第 335、336 條", note: "侵占罪，視情節適用" }
    ],
    "harassment": [
      { name: "性騷擾防治法", article: "（整體適用）", note: "性騷擾事件之防治與責任" },
      { name: "性別平等工作法", article: "第 12 條", note: "職場性騷擾之定義與防治義務" }
    ],
    "discrimination": [
      { name: "就業服務法", article: "第 5 條", note: "就業歧視之禁止" }
    ],
    "retaliation": [
      { name: "勞動基準法", article: "第 74 條", note: "雇主不得因勞工申訴予以不利處分" }
    ],
    "false-whistleblowing": [
      { name: "刑法", article: "第 169 條", note: "誣告罪" }
    ],
    "supplier-bribe": [
      { name: "政府採購法", article: "第 59 條", note: "廠商不得以佣金、利益等促成採購契約" },
      { name: "刑法", article: "第 342 條", note: "背信罪，視情節適用" }
    ],
    "supplier-record": [
      { name: "刑法", article: "第 210、215 條", note: "偽造文書罪，視情節適用" }
    ],
    "supplier-labor": [
      { name: "勞動基準法", article: "第 30 條", note: "工時上限" },
      { name: "勞動基準法", article: "第 44～48 條", note: "童工之僱用限制" },
      { name: "人口販運防制法", article: "（整體適用）", note: "涉強迫勞動、奴役情節時" }
    ],
    "procurement-complaint": [
      { name: "政府採購法", article: "第 87 條", note: "圍標、綁標之刑事責任" },
      { name: "政府採購法", article: "第 101 條", note: "不良廠商之刊登與停權" }
    ],
    "insider-tip-family": [
      { name: "證券交易法", article: "第 157-1 條", note: "內線消息傳遞之責任，視情節適用" },
      { name: "刑法", article: "第 317 條", note: "洩漏業務上知悉之工商秘密罪" }
    ],
    "blackout-relative-trade": [
      { name: "證券交易法", article: "第 157-1 條", note: "以他人名義交易同受內線交易規範" }
    ],
    "retaliation-subtle": [
      { name: "勞動基準法", article: "第 74 條", note: "雇主不得因勞工申訴予以不利處分" }
    ],
    "harassment-gray": [
      { name: "性騷擾防治法", article: "（整體適用）", note: "視情節適用" }
    ],
    "expense-fraud": [
      { name: "刑法", article: "第 215、339 條", note: "業務登載不實、詐欺，視情節適用" }
    ],
    "tax-evasion": [
      { name: "稅捐稽徵法", article: "第 41 條", note: "以詐術或其他不正當方法逃漏稅捐之刑責" }
    ]
  };

  root.CHT_STATUTES_DISCLAIMER =
    "法令引用僅供參考，非法律意見；實際適用應依具體事實由公司法務單位認定。";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.CHT_STATUTES;
  }
})(typeof window !== "undefined" ? window : globalThis);
