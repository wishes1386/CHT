window.CHT_SOURCES = {
  codeOfConduct: { label: "中華電信行為準則", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-2.pdf" },
  ethicalPrinciples: { label: "誠信經營守則", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-5.pdf" },
  ethicalGuide: { label: "誠信經營作業程序及行為指南", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-4.pdf" },
  antiCorruption: { label: "反貪腐反賄賂與反洗錢政策", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-7.pdf" },
  insider: { label: "防範內線交易管理控制作業要點", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/0716.pdf" },
  governance: { label: "公司治理守則", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-1.pdf" },
  whistleblowing: { label: "違反行為準則案件受理作業要點", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-6.pdf" },
  supplier: { label: "供應商行為準則", url: "https://www.cht.com.tw/zh-TW/home/cht/-/media/Web/Images/ESG2023/4-3new_supplier-code-of-conduct-1.pdf" },
  humanRights: { label: "人權政策", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/07192_5.pdf" },
  antiDiscrimination: { label: "反歧視與反騷擾準則", url: "https://www.cht.com.tw/zh-TW/home/cht/-/media/Web/Images/ESG2023/07206_3-1.pdf" },
  harassment: { label: "性騷擾防治措施申訴及懲戒要點", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/0716-6-3v2.pdf" },
  privacy: { label: "隱私權保護政策", url: "https://www.cht.com.tw/zh-tw/home/cht/esg/customer-care/privacy-protection/privacy-policy" },
  cybersecurity: { label: "資安承諾", url: "https://www.cht.com.tw/zh-tw/home/cht/esg/customer-care/cybersecurity/cybersecurity-policy" },
  ai: { label: "負責任人工智慧計畫", url: "https://www.cht.com.tw/zh-tw/home/cht/esg/customer-care/responsible-ai" },
  tax: { label: "稅務政策及管理辦法", url: "https://www.cht.com.tw/home/cht/-/media/web/images/web_2024/esg/chinese/7192_2-14.pdf" }
};

window.CHT_POLICIES = [
  {
    id: "conflict-family",
    category: "利益衝突",
    title: "親屬或關係人涉及公司招標未揭露",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條",
    status: "violated",
    severity: "高",
    summary: "本人、配偶、子女或二親等內親屬之利益與公司利益衝突時，應主動向直接主管或組織暨人才發展單位報告；親屬或關係人涉及公司招標時，應向主管及稽核單位揭露。",
    keywords: ["利益衝突", "親屬", "家人", "關係人", "招標", "投標", "二親等", "配偶", "子女", "揭露"],
    requiredGroups: [
      ["親屬", "家人", "關係人", "二親等", "配偶", "子女"],
      ["招標", "投標", "揭露"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["向直屬主管或組織暨人才發展單位報告", "涉招標事項另向稽核單位揭露"]
  },
  {
    id: "conflict-director-loan",
    category: "利益衝突",
    title: "對董事或高階主管及其親屬借貸或保證",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條",
    status: "violated",
    severity: "高",
    summary: "禁止對董事、高階主管及其配偶、子女或二親等內親屬給予借貸或為保證；對其他人員借貸須事先依公司規定審閱核准。",
    keywords: ["借貸", "借款", "保證", "董事", "高階主管", "副總", "總經理"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["向組織暨人才發展單位確認借貸核准程序"]
  },
  {
    id: "conflict-compete",
    category: "利益衝突",
    title: "未經同意從事競業行為",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 4 條",
    status: "violated",
    severity: "高",
    summary: "除事前取得組織暨人才發展單位書面同意外，不得從事與中華電信競業之行為。",
    keywords: ["競業", "兼職", "同行", "競爭公司", "同業", "其他公司工作"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["未取得書面同意前應停止該行為"]
  },
  {
    id: "private-gain",
    category: "利益衝突",
    title: "利用公司財產、資訊或職位謀取私人利益",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 4 條",
    status: "violated",
    severity: "高",
    summary: "非經公司同意，任何人不得利用公司之財產、資訊或職位以獲取私人利益。",
    keywords: ["私人利益", "圖利", "利用職位", "利用公司資源", "公器私用", "中飽私囊"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["立即停止行為並向直屬主管報告"]
  },
  {
    id: "bribe-kickback",
    category: "貪腐與賄賂",
    title: "收受或給予回扣、佣金、疏通費",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 8 條、第 12 條",
    status: "violated",
    severity: "最高",
    summary: "不得自客戶、供應商或關係團體取得或給予回扣或其他不正當利益；不得直接或間接提供、承諾、要求或收受任何形式之不正當利益。",
    keywords: ["回扣", "佣金", "疏通費", "賄賂", "行賄", "收賄", "不正當利益", "紅包"],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.antiCorruption, CHT_SOURCES.ethicalGuide],
    channels: ["依誠信經營作業程序陳報直屬主管並知會專責單位", "涉及不法時通報法務與稽核單位"]
  },
  {
    id: "gift-over-limit",
    category: "貪腐與賄賂",
    title: "收受廠商禮物或款待",
    document: CHT_SOURCES.ethicalPrinciples.label,
    article: "第 13 條、誠信經營作業程序第 6、7 條",
    status: "possible",
    severity: "中",
    summary: "原則上不得收受不正當利益；僅能接受市價低於 1,000 元新台幣之普通紀念品，且無職務利害關係者應於三個工作日內陳報直屬主管，有職務利害關係者應退還或拒絕。",
    keywords: ["禮物", "餽贈", "紀念品", "送禮", "收禮", "款待", "應酬", "請客", "招待"],
    reports: [CHT_SOURCES.ethicalPrinciples, CHT_SOURCES.ethicalGuide, CHT_SOURCES.antiCorruption],
    channels: ["金額超過 1,000 元應婉拒退回", "無法退還時三個工作日內交專責單位處理"]
  },
  {
    id: "political-donation",
    category: "貪腐與賄賂",
    title: "捐贈政治獻金",
    document: CHT_SOURCES.ethicalGuide.label,
    article: "第 9 條",
    status: "violated",
    severity: "最高",
    summary: "中華電信不得捐贈政治獻金，亦不得藉政治捐獻謀取商業利益或交易優勢。",
    keywords: ["政治獻金", "捐贈政黨", "政治捐款", "候選人", "政治人物"],
    reports: [CHT_SOURCES.ethicalGuide, CHT_SOURCES.antiCorruption],
    channels: ["立即停止並通報組織暨人才發展單位"]
  },
  {
    id: "charity-bribery",
    category: "貪腐與賄賂",
    title: "以慈善捐贈或贊助變相行賄",
    document: CHT_SOURCES.ethicalGuide.label,
    article: "第 10 條",
    status: "violated",
    severity: "高",
    summary: "慈善捐贈或贊助應符合法令並做成書面紀錄，對象應為慈善機構，不得為變相行賄，不得圖利商業往來對象或相關人員。",
    keywords: ["慈善捐贈", "贊助", "變相行賄", "捐贈", "回饋"],
    reports: [CHT_SOURCES.ethicalGuide, CHT_SOURCES.antiCorruption],
    channels: ["依董事會暨經理部門權責劃分表審查後辦理"]
  },
  {
    id: "trade-secret-leak",
    category: "保密與營業秘密",
    title: "洩漏營業秘密或商業機密",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 6 條",
    status: "violated",
    severity: "最高",
    summary: "營業秘密包含內部規範之營業秘密及因業務或合作關係知悉且負保密義務之資訊；除法令規定或經授權外，不得揭露。",
    keywords: ["營業秘密", "商業機密", "機密", "洩漏", "外洩", "技術資料", "配方"],
    negatable: true,
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["立即通報法務與資安單位", "必要時啟動損害控管"]
  },
  {
    id: "customer-data-leak",
    category: "保密與營業秘密",
    title: "洩漏客戶個人資料",
    document: CHT_SOURCES.privacy.label,
    article: "隱私權保護政策",
    status: "violated",
    severity: "最高",
    summary: "客戶個資之蒐集、處理、利用限於法令規定範圍，不得提供、出租或以變相方式揭露予第三人；員工對客戶個人資料負絕對保密責任。",
    keywords: ["個資", "客戶資料", "個人資料", "資料外洩", "客戶隱私", "電話號碼", "身分證"],
    negatable: true,
    reports: [CHT_SOURCES.privacy, CHT_SOURCES.codeOfConduct],
    channels: ["立即通報法務、資安與個資保護窗口"]
  },
  {
    id: "internal-doc-leak",
    category: "保密與營業秘密",
    title: "外洩公司內部文件",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 6 條",
    status: "violated",
    severity: "高",
    summary: "員工對營運機密及內部文件負有保密責任，離職後仍須遵守；嚴禁將文件外洩。",
    keywords: ["內部文件", "文件外洩", "資料外洩", "離職", "外流", "偷拍"],
    negatable: true,
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.whistleblowing],
    channels: ["通報法務與資安單位"]
  },
  {
    id: "cyber-incident",
    category: "保密與營業秘密",
    title: "造成資安或個資事故",
    document: CHT_SOURCES.cybersecurity.label,
    article: "資安承諾",
    status: "violated",
    severity: "高",
    summary: "公司對資安採零容忍原則，員工應落實資通安全政策與隱私權保護政策，避免重大資安與個資事故。",
    keywords: ["資安", "資通安全", "駭客", "攻擊", "漏洞", "未授權存取", "帳密", "釣魚"],
    reports: [CHT_SOURCES.cybersecurity, CHT_SOURCES.privacy],
    channels: ["依資安事件通報程序立即回報"]
  },
  {
    id: "ai-sensitive",
    category: "保密與營業秘密",
    title: "未經管控使用敏感 AI 或生成內容",
    document: CHT_SOURCES.ai.label,
    article: "負責任人工智慧計畫",
    status: "possible",
    severity: "中",
    summary: "涉及個人資料、身分識別、行為軌跡、影像特徵及關鍵場域資訊之 AI 應用須納入敏感 AI 管理並執行風險評鑑；AI 生成內容與輔助決策應標示 AI 參與程度。",
    keywords: ["AI", "人工智慧", "生成內容", "影像特徵", "行為軌跡", "機器人", "自動決策"],
    reports: [CHT_SOURCES.ai],
    channels: ["AI 應用導入前完成風險評鑑與資料合法性確認"]
  },
  {
    id: "insider-trading",
    category: "內線交易",
    title: "知悉重大未公開消息仍交易股票",
    document: CHT_SOURCES.insider.label,
    article: "第 5 條、行為準則第 11 條",
    status: "violated",
    severity: "最高",
    summary: "實際知悉內部重大消息時，於消息明確後、未公開前或公開後 18 小時內，不得自行或以他人名義買入或賣出股票、具股權性質之有價證券或公司債。",
    keywords: ["內線", "未公開", "重大消息", "股票", "買賣", "交易", "18小時", "股價"],
    requiredGroups: [
      ["內線", "未公開", "重大消息", "財報", "股價", "併購"],
      ["買", "賣", "交易", "進出", "持股", "下單"]
    ],
    reports: [CHT_SOURCES.insider, CHT_SOURCES.codeOfConduct],
    channels: ["停止交易並通報防範內線交易作業小組"]
  },
  {
    id: "insider-blackout",
    category: "內線交易",
    title: "財報公告前封閉期間交易",
    document: CHT_SOURCES.insider.label,
    article: "第 5 條",
    status: "violated",
    severity: "高",
    summary: "內部人不得於年度財務報告公告前 30 日及每季財務報告公告前 15 日之封閉期間交易其股票。",
    keywords: ["封閉期間", "財報前", "年報前", "季報前", "30日", "15日", "閉鎖期"],
    reports: [CHT_SOURCES.insider],
    channels: ["封閉期間內停止交易"]
  },
  {
    id: "insider-leak",
    category: "內線交易",
    title: "洩漏內部重大消息",
    document: CHT_SOURCES.insider.label,
    article: "第 7 條",
    status: "violated",
    severity: "最高",
    summary: "參與或知悉內部重大消息者應保守秘密，不得對外洩漏，包括配偶、子女、未參與或未知悉之員工及他人。",
    keywords: ["洩漏", "重大消息", "未公開資訊", "內幕", "偷聽", "轉述"],
    negatable: true,
    requiredGroups: [
      ["洩漏", "透露", "告知", "外洩"],
      ["重大消息", "未公開資訊", "內幕", "財報", "併購"]
    ],
    reports: [CHT_SOURCES.insider],
    channels: ["立即向作業小組秘書單位報告", "必要時通報稽核處"]
  },
  {
    id: "false-financial",
    category: "資訊與財務",
    title: "製作不實財務報表或誤導文件",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 7 條",
    status: "violated",
    severity: "最高",
    summary: "不得故意製作或使他人製作不完整、誤導或虛偽之會計、財務或揭露文件，不得強迫、操縱、誤導或欺騙稽核人員。",
    keywords: ["財務報表", "造假", "虛偽", "不實", "誤導", "會計", "帳冊", "財報"],
    requiredGroups: [
      ["財務報表", "財報", "會計", "帳冊"],
      ["造假", "虛偽", "不實", "誤導", "偽造", "做假", "竄改", "隱匿"]
    ],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["立即停止並通報內部法務與稽核單位"]
  },
  {
    id: "destroy-records",
    category: "資訊與財務",
    title: "銷毀、竄改或偽造調查相關文件",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 10 條",
    status: "violated",
    severity: "最高",
    summary: "訴訟或政府調查進行中或可能發生時，相關文件不得毀損、擅改或偽造；應諮詢內部法務單位並依其指示辦理。",
    keywords: ["銷毀", "竄改", "偽造", "湮滅", "訴訟", "調查", "證據"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["保全文件並諮詢內部法務單位"]
  },
  {
    id: "false-disclosure",
    category: "資訊與財務",
    title: "對外不實陳述或隱匿資訊",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 7、10 條",
    status: "violated",
    severity: "高",
    summary: "資訊揭露應完整、公平、正確、及時；不得對客戶、供應商或主管機關就事實、契約條件或公司政策為不實陳述或隱匿。",
    keywords: ["不實陳述", "隱匿", "誤導", "謊報", "隱瞞", "假資料"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["儘速向主管及內部法務單位更正諮商"]
  },
  {
    id: "unfair-competition",
    category: "公平競爭",
    title: "聯合定價、分割市場或操縱投標",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 10 條",
    status: "violated",
    severity: "最高",
    summary: "不得與競爭廠商合訂價格、分配或分割市場或客戶、聯合杯葛，亦不得固定價格、操縱投標、限制產量或分享市場。",
    keywords: ["聯合定價", "壟斷", "分割市場", "杯葛", "圍標", "操縱投標", "綁標", "限制競爭"],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["立即停止並通報法務單位"]
  },
  {
    id: "competitive-info",
    category: "公平競爭",
    title: "與競爭廠商交換競爭敏感資訊",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 10 條",
    status: "violated",
    severity: "高",
    summary: "除事前經內部法務單位或上級同意外，不得與競爭廠商代表討論或交換具商業競爭敏感性之訊息。",
    keywords: ["競爭廠商", "敏感資訊", "交換訊息", "報價", "客戶名單"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["取得法務或上級同意前不得交換"]
  },
  {
    id: "asset-misuse",
    category: "資產保護",
    title: "挪用或侵占公司資產",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 9 條",
    status: "violated",
    severity: "高",
    summary: "公司資產僅得基於合法商業目的使用，不得因個人或其他不適當目的使用、竊取或故意侵占公司或客戶資產。",
    keywords: ["挪用", "侵占", "竊取", "公司資產", "設備", "公款", "公物"],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["立即停止並通報稽核單位"]
  },
  {
    id: "harassment",
    category: "職場行為",
    title: "性騷擾或職場騷擾",
    document: CHT_SOURCES.antiDiscrimination.label,
    article: "反歧視與反騷擾準則、性騷擾防治措施申訴及懲戒要點",
    status: "violated",
    severity: "最高",
    summary: "禁止任何形式騷擾，包括性騷擾、敵意性工作環境、以性要求作為勞動條件交換，以及使他人感到驚恐、畏懼或困擾之行為。",
    keywords: ["性騷擾", "騷擾", "性暗示", "觸摸", "親吻", "擁抱", "色情", "跟蹤", "追求"],
    reports: [CHT_SOURCES.antiDiscrimination, CHT_SOURCES.harassment],
    channels: ["向各機構組織暨人才發展處或性騷擾申訴管道提出申訴"]
  },
  {
    id: "discrimination",
    category: "職場行為",
    title: "非法歧視或不平等對待",
    document: CHT_SOURCES.antiDiscrimination.label,
    article: "反歧視與反騷擾準則",
    status: "violated",
    severity: "高",
    summary: "不得因種族、性別、性傾向、宗教信仰、年齡、政治傾向、國籍、出生地、身心障礙等受法令保護事項歧視或騷擾他人。",
    keywords: ["歧視", "種族", "性別", "宗教", "年齡", "身心障礙", "政治傾向", "不平等"],
    reports: [CHT_SOURCES.antiDiscrimination, CHT_SOURCES.humanRights],
    channels: ["向組織暨人才發展單位提出申訴"]
  },
  {
    id: "retaliation",
    category: "職場行為",
    title: "報復檢舉人或申訴人",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 14 條",
    status: "violated",
    severity: "最高",
    summary: "任何人以善意告知違背道德之虞、疑似違反證券法令或其他不當行為，不得遭受任何形式之報復、霸凌或不當處分。",
    keywords: ["報復", "檢舉人", "申訴人", "霸凌", "秋後算帳", "威脅", "不利處分"],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.whistleblowing],
    channels: ["向直屬主管或組織暨人才發展單位報告"]
  },
  {
    id: "false-whistleblowing",
    category: "職場行為",
    title: "虛報或惡意檢舉",
    document: CHT_SOURCES.ethicalGuide.label,
    article: "第 21 條",
    status: "violated",
    severity: "中",
    summary: "內部人員如有虛報或惡意指控情事，應依從業人員獎懲標準懲處，情節重大者得終止勞動契約。",
    keywords: ["虛報", "惡意檢舉", "捏造", "陷害", "假證據", "惡意指控"],
    requiredGroups: [
      ["虛報", "惡意檢舉", "捏造", "陷害", "假證據", "惡意指控"],
      ["檢舉", "指控", "申訴", "誣告"]
    ],
    reports: [CHT_SOURCES.ethicalGuide],
    channels: ["由組織暨人才發展單位依獎懲標準處理"]
  },
  {
    id: "supplier-bribe",
    category: "供應商",
    title: "供應商提供或收受不正當利益",
    document: CHT_SOURCES.supplier.label,
    article: "供應商行為準則 D.2、D.11",
    status: "violated",
    severity: "高",
    summary: "供應商不得承諾、提供、批准、給予或收受賄賂或其他不正當收益，不得提供回扣、佣金或疏通費以影響商業交易。",
    keywords: ["供應商", "承包商", "包商", "賄賂", "回扣", "佣金", "不當利益"],
    requiredGroups: [
      ["供應商", "承包商", "包商", "廠商"],
      ["賄賂", "回扣", "佣金", "疏通費", "不當利益", "行賄", "收賄", "送錢"]
    ],
    reports: [CHT_SOURCES.supplier, CHT_SOURCES.antiCorruption],
    channels: ["供應商可透過檢舉專線 02-2344-6020 或信箱 sy@cht.com.tw 通報"]
  },
  {
    id: "supplier-record",
    category: "供應商",
    title: "供應商偽造紀錄或不實揭露",
    document: CHT_SOURCES.supplier.label,
    article: "供應商行為準則 D.3",
    status: "violated",
    severity: "高",
    summary: "供應商所有業務往來應具透明度並準確記錄於帳簿，不得偽造記錄或虛報供應鏈狀況或慣例。",
    keywords: ["偽造", "供應商", "虛報", "不實紀錄", "假帳"],
    requiredGroups: [
      ["供應商", "承包商", "包商", "廠商", "供應鏈"],
      ["偽造", "虛報", "假帳", "不實紀錄"]
    ],
    reports: [CHT_SOURCES.supplier],
    channels: ["依採購契約追究並得終止業務關係"]
  },
  {
    id: "supplier-subcontract",
    category: "供應商",
    title: "供應商未經同意轉包",
    document: CHT_SOURCES.supplier.label,
    article: "供應商行為準則 D.10",
    status: "violated",
    severity: "高",
    summary: "對於中華電信期待供應商親自履約之事項，非經同意，供應商不得轉包或令第三方代為履行。",
    keywords: ["轉包", "分包", "代為履行", "層層轉包"],
    reports: [CHT_SOURCES.supplier],
    channels: ["依契約要求恢復親自履約並評估是否終止合作"]
  },
  {
    id: "supplier-labor",
    category: "供應商",
    title: "供應商違反勞工或人權標準",
    document: CHT_SOURCES.supplier.label,
    article: "供應商行為準則 A 部分",
    status: "violated",
    severity: "高",
    summary: "供應商禁止強迫勞動、童工、每週工時超過 60 小時、扣薪懲戒、苛待人權、非法歧視；工資與福利應符合法令。",
    keywords: ["童工", "強迫勞動", "超時", "60小時", "扣薪", "奴役", "人口販運"],
    reports: [CHT_SOURCES.supplier, CHT_SOURCES.humanRights],
    channels: ["向中華電信供應鏈管理窗口通報"]
  },
  {
    id: "procurement-complaint",
    category: "採購",
    title: "採購招標或契約執行違規申訴",
    document: CHT_SOURCES.whistleblowing.label,
    article: "採購申訴作業處理程序",
    status: "possible",
    severity: "中",
    summary: "廠商或個人對採購案招標辦理、契約執行認有違反法令、誠信或採購規則時，得具名檢具事證向採購申訴處理小組提出申訴。",
    keywords: ["採購", "申訴", "招標", "廠商", "契約", "投標", "標案"],
    requiredGroups: [
      ["申訴", "投訴", "爭議", "糾紛"],
      ["採購", "招標", "標案", "契約", "廠商"]
    ],
    reports: [CHT_SOURCES.whistleblowing],
    channels: ["採購申訴電子郵件 sy@cht.com.tw", "電話 02-2344-6020"]
  },
  {
    id: "report-violation",
    category: "檢舉通報",
    title: "知悉違規未通報",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 14 條",
    status: "possible",
    severity: "中",
    summary: "董事、經理人及員工知悉或從事任何可能違背行為準則或相關法規之行為時，應即刻報告組織暨人才發展單位；主管未提報違規行為者亦同受處分。",
    keywords: ["檢舉", "通報", "發現違規", "疑似違規", "不上報", "知情不報"],
    requiredGroups: [
      ["檢舉", "通報", "發現違規", "疑似違規"],
      ["未通報", "沒通報", "不上報", "知情不報", "沒有報告", "未報告", "隱瞞"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.whistleblowing],
    channels: ["向組織暨人才發展單位報告", "可匿名檢舉"]
  },
  {
    id: "conflict-family-supervisor",
    category: "模糊地帶",
    title: "親屬同單位且可能受主管監督",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條、誠信經營作業程序第 11 條",
    status: "possible",
    severity: "中",
    summary: "父子等一親等親屬若同單位工作，且一方為單位主管或涉及監督、考核、獎懲或決策，即可能構成利益衝突或客觀性受質疑，應揭露並於相關事項迴避。",
    keywords: ["爸爸", "父親", "媽媽", "母親", "兒子", "女兒", "親屬", "家人", "主管", "單位", "客網", "上班", "考核", "監督", "直屬"],
    requiredGroups: [
      ["爸爸", "父親", "媽媽", "母親", "兒子", "女兒", "親屬", "家人"],
      ["主管", "單位", "客網", "上班", "同事", "同一單位", "同單位"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["向直屬主管或組織暨人才發展單位揭露", "若涉監督或決策，應申請利益迴避"]
  },
  {
    id: "conflict-family-supplier",
    category: "模糊地帶",
    title: "親屬任職於往來廠商或供應商",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條、誠信經營作業程序第 11 條",
    status: "possible",
    severity: "高",
    summary: "本人、配偶、子女或二親等內親屬任職於與公司往來之廠商、供應商或客戶，若職務涉及採購、契約或交易決策，可能構成利益衝突，應揭露並迴避。",
    keywords: ["親屬", "家人", "爸爸", "父親", "媽媽", "母親", "兒子", "女兒", "兄弟", "姊妹", "供應商", "廠商", "客戶", "承包商", "任職", "上班", "工作"],
    requiredGroups: [
      ["親屬", "家人", "爸爸", "父親", "媽媽", "母親", "兒子", "女兒", "兄弟", "姊妹"],
      ["供應商", "廠商", "客戶", "承包商", "包商"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide, CHT_SOURCES.supplier],
    channels: ["主動向直屬主管及稽核單位揭露", "涉及採購決策時應迴避"]
  },
  {
    id: "conflict-family-competitor",
    category: "模糊地帶",
    title: "親屬任職於競爭公司未揭露",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條",
    status: "possible",
    severity: "中",
    summary: "個人、配偶、子女或二親等內親屬任職於與公司有直接競爭關係之公司，可能使個人客觀性受質疑，應向直接主管或組織暨人才發展單位報告。",
    keywords: ["親屬", "家人", "配偶", "子女", "爸爸", "父親", "兒子", "女兒", "競爭", "同行", "同業", "其他電信"],
    requiredGroups: [
      ["親屬", "家人", "配偶", "子女", "爸爸", "父親", "媽媽", "母親", "兒子", "女兒"],
      ["競爭", "同行", "同業", "其他電信"]
    ],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["向直接主管或組織暨人才發展單位報告"]
  },
  {
    id: "supervisor-subordinate-loan",
    category: "模糊地帶",
    title: "主管與下屬私下借貸或共同投資",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條",
    status: "possible",
    severity: "高",
    summary: "主管與下屬間借貸、保證或共同投資可能造成考核、獎懲與決策之利益衝突；對董事或高階主管及其親屬之借貸保證明令禁止，其他人員借貸須事先依公司規定審閱核准。",
    keywords: ["借貸", "借款", "借錢", "投資", "合夥", "主管", "下屬", "部屬", "長官", "保證"],
    requiredGroups: [
      ["借貸", "借款", "借錢", "投資", "合夥", "保證"],
      ["主管", "下屬", "部屬", "長官"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["事先向公司申請審閱核准", "涉及監督關係時應揭露並迴避"]
  },
  {
    id: "gift-undeclared",
    category: "模糊地帶",
    title: "收受小額禮物或款待未申報",
    document: CHT_SOURCES.ethicalPrinciples.label,
    article: "誠信經營作業程序第 7 條",
    status: "possible",
    severity: "中",
    summary: "即使為普通紀念品或正常社交款待，若屬職務上往來對象所提供且未於三個工作日內陳報直屬主管，仍可能違反誠信經營作業程序。",
    keywords: ["禮物", "餽贈", "紀念品", "款待", "應酬", "請客", "未申報", "沒有申報", "未陳報", "沒有陳報", "未揭露", "沒有揭露"],
    requiredGroups: [
      ["禮物", "餽贈", "紀念品", "款待", "應酬", "請客"],
      ["未申報", "沒有申報", "未陳報", "沒有陳報", "未揭露", "沒有揭露", "未報告", "沒有報告"]
    ],
    reports: [CHT_SOURCES.ethicalPrinciples, CHT_SOURCES.ethicalGuide],
    channels: ["補陳報直屬主管並知會專責單位", "無法補救時向專責單位說明"]
  },
  {
    id: "supplier-social-overlap",
    category: "模糊地帶",
    title: "與供應商過度頻繁社交往來",
    document: CHT_SOURCES.supplier.label,
    article: "供應商行為準則 D.9",
    status: "possible",
    severity: "中",
    summary: "與供應商不必要或過度頻繁之社交往來可能構成利益衝突觀感；供應商發現潛在利益衝突時應通報公司，公司人員亦應保持一般商業往來分際。",
    keywords: ["供應商", "廠商", "承包商", "包商", "客戶", "社交", "往來", "應酬", "餐敘", "旅遊", "聚會", "頻繁", "打球", "高爾夫"],
    requiredGroups: [
      ["供應商", "廠商", "承包商", "包商", "客戶"],
      ["社交", "應酬", "餐敘", "旅遊", "聚會", "頻繁", "打球", "高爾夫", "聚餐", "飯局"]
    ],
    reports: [CHT_SOURCES.supplier, CHT_SOURCES.ethicalGuide],
    channels: ["減少非必要往來", "依公司程序陳報或申請核准"]
  },
  {
    id: "supplier-hospitality",
    category: "模糊地帶",
    title: "供應商招待旅遊或高檔餐會",
    document: CHT_SOURCES.antiCorruption.label,
    article: "反貪腐反賄賂與反洗錢政策、誠信經營作業程序第 6、7 條",
    status: "possible",
    severity: "高",
    summary: "供應商提供旅遊、高檔餐會、住宿或其他款待，若超出正常社交禮俗或與職務利害關係相關，可能構成不正當利益，應拒絕或退還並陳報。",
    keywords: ["供應商", "廠商", "承包商", "包商", "旅遊", "招待", "出國", "高檔", "餐會", "住宿", "晚宴"],
    requiredGroups: [
      ["供應商", "廠商", "承包商", "包商"],
      ["旅遊", "招待", "出國", "高檔", "餐會", "住宿", "晚宴"]
    ],
    reports: [CHT_SOURCES.antiCorruption, CHT_SOURCES.ethicalGuide],
    channels: ["婉拒並向直屬主管陳報", "無法拒絕時交專責單位處理"]
  },
  {
    id: "moonlighting-related",
    category: "模糊地帶",
    title: "未經同意兼職或投資與公司業務相關事業",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 4 條",
    status: "possible",
    severity: "中",
    summary: "員工未經公司書面同意，兼職、投資或合夥經營與公司業務相關或具有競業性質之事業，可能違反不圖取私人利益及競業限制。",
    keywords: ["兼職", "副業", "投資", "合夥", "開公司", "創業", "相關", "同行", "同業", "業務", "供應商", "客戶", "電信"],
    requiredGroups: [
      ["兼職", "副業", "投資", "合夥", "開公司", "創業"],
      ["相關", "同行", "同業", "業務", "供應商", "客戶", "電信"]
    ],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["事前向組織暨人才發展單位申請書面同意"]
  },
  {
    id: "asset-private-use",
    category: "模糊地帶",
    title: "使用公司設備或資源處理私人事務",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 9 條",
    status: "possible",
    severity: "中",
    summary: "公司資產僅得基於合法商業目的使用；未經許可將公務車、油卡、電腦、器材或文具用於私人用途，可能構成不當使用公司資產。",
    keywords: ["公司電腦", "公務車", "油卡", "印表機", "器材", "設備", "資產", "文具", "私用", "私人", "個人", "家用", "帶回家", "家人"],
    requiredGroups: [
      ["公司電腦", "公務車", "油卡", "印表機", "器材", "設備", "資產", "文具"],
      ["私用", "私人", "個人", "家用", "帶回家", "家人"]
    ],
    reports: [CHT_SOURCES.codeOfConduct],
    channels: ["立即停止並歸還公司資產"]
  },
  {
    id: "insider-tip-family",
    category: "模糊地帶",
    title: "將未公開重大消息告知親友",
    document: CHT_SOURCES.insider.label,
    article: "第 7 條、行為準則第 11 條",
    status: "violated",
    severity: "最高",
    summary: "參與或知悉內部重大消息者不得對外洩漏，包含告知配偶、子女、未參與員工、親友或他人，即使未從中獲利仍可能違反內線交易與保密規定。",
    keywords: ["未公開", "內線", "重大消息", "財報", "併購", "親友", "家人", "朋友", "配偶", "子女", "同事", "告知", "透露", "洩漏"],
    requiredGroups: [
      ["未公開", "內線", "重大消息", "財報", "併購"],
      ["親友", "家人", "朋友", "配偶", "子女", "同事"],
      ["告知", "透露", "洩漏", "告訴", "講", "說"]
    ],
    reports: [CHT_SOURCES.insider, CHT_SOURCES.codeOfConduct],
    channels: ["立即停止洩漏並向防範內線交易作業小組通報"]
  },
  {
    id: "blackout-relative-trade",
    category: "模糊地帶",
    title: "封閉期間由親屬或他人代為交易",
    document: CHT_SOURCES.insider.label,
    article: "第 5 條",
    status: "violated",
    severity: "最高",
    summary: "內部人不得自行或以他人名義，於重大消息公開前或公開後 18 小時內、以及財報封閉期間交易股票；由配偶、子女、親屬或他人代為交易同樣受規範。",
    keywords: ["封閉期間", "財報前", "年報前", "季報前", "閉鎖期", "配偶", "子女", "親屬", "家人", "朋友", "他人", "代為", "帳戶"],
    requiredGroups: [
      ["封閉期間", "財報前", "年報前", "季報前", "閉鎖期"],
      ["配偶", "子女", "親屬", "家人", "朋友", "他人", "代為", "帳戶"]
    ],
    reports: [CHT_SOURCES.insider],
    channels: ["封閉期間內停止一切相關交易"]
  },
  {
    id: "supervisor-conceal",
    category: "模糊地帶",
    title: "主管知悉下屬違規未提報",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 14、15 條",
    status: "possible",
    severity: "高",
    summary: "主管知悉或發現下屬可能違反行為準則或相關法規而未提報，依行為準則可能同受懲處；知悉後應即刻向組織暨人才發展單位報告。",
    keywords: ["主管", "長官", "經理", "課長", "處長", "知情", "知道", "發現", "隱瞞", "未通報", "沒通報", "不上報"],
    requiredGroups: [
      ["主管", "長官", "經理", "課長", "處長"],
      ["知情", "知道", "發現", "隱瞞", "未通報", "沒通報", "不上報"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.whistleblowing],
    channels: ["向組織暨人才發展單位提報"]
  },
  {
    id: "retaliation-subtle",
    category: "模糊地帶",
    title: "以調職或考績等方式報復檢舉人",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 14 條",
    status: "possible",
    severity: "高",
    summary: "對提出檢舉、申訴或協助調查之員工，以調職、降調、影響考績、冷落或刁難等方式為不利處分，可能構成報復並違反吹哨者保護規定。",
    keywords: ["檢舉", "申訴", "吹哨", "調職", "冷落", "考績", "降調", "刁難", "邊緣化", "報復", "不當處分"],
    requiredGroups: [
      ["檢舉", "申訴", "吹哨"],
      ["調職", "冷落", "考績", "降調", "刁難", "邊緣化", "報復", "不當處分"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.whistleblowing],
    channels: ["向直屬主管或組織暨人才發展單位報告"]
  },
  {
    id: "harassment-gray",
    category: "模糊地帶",
    title: "言語或行為造成他人不適或冒犯",
    document: CHT_SOURCES.antiDiscrimination.label,
    article: "反歧視與反騷擾準則",
    status: "possible",
    severity: "中",
    summary: "即使非典型性騷擾，任何言語、玩笑、評論、訊息或動作若使他人感到驚恐、畏懼、困擾或冒犯，並侵犯尊嚴或形成不利工作環境，仍可能違反反騷擾準則。",
    keywords: ["言語", "玩笑", "評論", "訊息", "動作", "虧", "不適", "冒犯", "害怕", "恐懼", "困擾", "不舒服", "壓力"],
    requiredGroups: [
      ["言語", "玩笑", "評論", "訊息", "動作", "虧", "黃腔", "開黃腔", "性玩笑"],
      ["不適", "冒犯", "害怕", "恐懼", "困擾", "不舒服", "壓力"]
    ],
    reports: [CHT_SOURCES.antiDiscrimination, CHT_SOURCES.harassment],
    channels: ["向組織暨人才發展處提出申訴"]
  },
  {
    id: "ai-content-release",
    category: "模糊地帶",
    title: "未經核可使用 AI 生成內容對外發布",
    document: CHT_SOURCES.ai.label,
    article: "負責任人工智慧計畫",
    status: "possible",
    severity: "中",
    summary: "AI 生成內容用於對外溝通、文件、客服或公告時，應依使用情境標示 AI 參與程度，並確認最終決策與內容仍由人員負責；未經核實發布可能違反負責任 AI 管理。",
    keywords: ["AI", "人工智慧", "生成", "發布", "對外", "公布", "公告", "客服", "文件", "報告"],
    requiredGroups: [
      ["AI", "人工智慧", "生成"],
      ["發布", "對外", "公布", "公告", "客服", "文件", "報告"]
    ],
    reports: [CHT_SOURCES.ai],
    channels: ["完成內容核實與 AI 標示後再發布"]
  },
  {
    id: "procurement-family-supplier",
    category: "模糊地帶",
    title: "採購人員親屬任職於投標廠商",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 3 條、誠信經營作業程序第 11 條",
    status: "possible",
    severity: "高",
    summary: "採購或招標人員之親屬任職於投標廠商或供應商，可能構成利益衝突，應於招標前揭露並迴避相關審議、決標與履約管理事項。",
    keywords: ["採購", "招標", "標案", "投標", "親屬", "家人", "配偶", "子女", "爸爸", "父親", "兄弟", "姊妹", "廠商", "供應商"],
    requiredGroups: [
      ["採購", "招標", "標案", "投標"],
      ["親屬", "家人", "配偶", "子女", "爸爸", "父親", "兄弟", "姊妹"],
      ["廠商", "供應商", "承包商"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["招標前向稽核單位揭露", "於相關程序迴避"]
  },
  {
    id: "expense-fraud",
    category: "模糊地帶",
    title: "虛報交際費或差旅費",
    document: CHT_SOURCES.antiCorruption.label,
    article: "反貪腐反賄賂與反洗錢政策第玖條",
    status: "violated",
    severity: "高",
    summary: "所有財務行為包括交際費、差旅費與各項核銷，應真實、完整記錄；不得以虛報、浮報、假發票或偽造單據誤導帳冊。",
    keywords: ["虛報", "浮報", "假發票", "假單", "偽造單據", "交際費", "差旅費", "報帳", "核銷", "費用", "發票"],
    requiredGroups: [
      ["虛報", "浮報", "假發票", "假單", "偽造單據"],
      ["交際費", "差旅費", "報帳", "核銷", "費用", "發票"]
    ],
    reports: [CHT_SOURCES.antiCorruption, CHT_SOURCES.codeOfConduct],
    channels: ["停止不實申報並通報稽核單位"]
  },
  {
    id: "consultant-supplier",
    category: "模糊地帶",
    title: "員工兼任供應商顧問或掛名職位",
    document: CHT_SOURCES.codeOfConduct.label,
    article: "第 4 條",
    status: "possible",
    severity: "高",
    summary: "員工兼任往來廠商之顧問、董事、監事或掛名職位，可能利用職位獲取私人利益並造成利益衝突，未經公司同意即屬可能違規。",
    keywords: ["顧問", "掛名", "董事", "監事", "職位", "兼職", "合夥", "供應商", "廠商", "客戶", "承包商", "包商"],
    requiredGroups: [
      ["顧問", "掛名", "董事", "監事", "職位", "兼職", "合夥"],
      ["供應商", "廠商", "客戶", "承包商", "包商"]
    ],
    reports: [CHT_SOURCES.codeOfConduct, CHT_SOURCES.ethicalGuide],
    channels: ["事前向公司申請同意", "涉及往來對象時應迴避"]
  },
  {
    id: "tax-evasion",
    category: "稅務",
    title: "不誠實納稅或非法避稅",
    document: CHT_SOURCES.tax.label,
    article: "稅務政策及管理辦法",
    status: "violated",
    severity: "高",
    summary: "公司承諾誠實納稅、依期限申報完納；關係人交易遵循 OECD 移轉訂價準則，不刻意移轉利潤至低稅率國家，不進行不合法避稅或操作避稅天堂。",
    keywords: ["逃稅", "避稅", "漏稅", "洗錢", "低稅率", "避稅天堂", "假發票"],
    reports: [CHT_SOURCES.tax, CHT_SOURCES.antiCorruption],
    channels: ["通報法務、會計與稽核單位"]
  }
];
