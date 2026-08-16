# 神话知识库结构化数据 (Mythology Knowledge Base)

本目录由 [scripts/build_knowledge.py](../scripts/build_knowledge.py) 从
`sources/8bei8/` 中的四部古籍自动抽取生成，用于后续神话主题网站的开发。

- **数据来源**：太极书馆 (https://www.8bei8.com/book/)
- **抓取日期**：2026-08-07
- **生成日期**：2026-08-07
- **收录古籍**：《山海经》《搜神记》《楚辞》《淮南子》共 4 部、86 章、1057 个条目

> **重要原则：所有内容均以提供的资料为唯一依据。**
> 资料中未作解释的实体，其 `description` 字段为 `null`（例如仅在原文叙述中出现、
> 但没有注释说明的人物）；资料本身注明“所指不详/待考”的，如实保留该说法，
> **不使用任何外部知识补充**。前端在 `description` 为空时应显示“资料未载”之类的占位文案。

---

## 文件总览

| 文件 / 目录 | 内容 |
|---|---|
| `books.json` | 四部古籍及其章节的总索引（含统计数据、每章来源 URL） |
| `entities.json` | 全部实体的**摘要目录**（不含逐条 mention 明细，便于列表/检索） |
| `relations.json` | 实体之间的关系（河流流向、山产兽、同见） |
| `entities/<id>.json` | 每个实体的**完整记录**（含全部出处与原文） |
| `chapters/<bookId>/<NN>.json` | 每章的原文、注释、译文，以及该章出现的实体引用 |

`entities.json` 适合做列表页、搜索索引；进入实体详情页时按需加载
`entities/<id>.json`。

---

## 实体类型 (entity types)

`type` 字段取值如下（括号内为本次抽取的数量）：

| type | 含义 | 示例 |
|---|---|---|
| `deity` | 神 / 天帝 / 神话人物 | 女娲、西王母、祝融、句芒 |
| `person` | 历史人物 / 传说人物 | 禹、舜、羿、鲧 |
| `creature` | 兽 / 动物 / 妖怪 | 狌狌、九尾狐一类 |
| `bird` | 鸟类 | 毕方、三青鸟 |
| `fish` | 鱼类 / 水生动物 | 何罗鱼 |
| `serpent` | 蛇 / 龙类 | 烛阴（烛龙）、巴蛇、虬 |
| `plant` | 草 / 草本植物 | 祝馀 |
| `tree` | 木 / 乔木 | 扶桑、迷榖 |
| `mineral` | 金石矿物 | 丹粟、玉、石涅 |
| `mountain` | 山 | 昆仑山、招摇山 |
| `river` | 水 / 河 / 江 / 泽 | 赤水、洛水、沅湘 |
| `place` | 地名 / 邑 / 台 / 宫 / 湖泽 | 瑶池、彭泽、丹阳 |
| `state` | 国 / 部族 | 一目国、钉灵之国 |
| `object` | 器物 / 兵器 / 乐器等 | 汤镬、九鼎 |
| `concept` | 抽象概念 / 祭祀 / 术数 | 九天、封禅、食气 |
| `star` | 星辰 / 天象 / 风 | 彗星、镇星、凯风 |
| `unit` | 度量衡单位 | 仞、畹 |
| `unknown` | 资料注明“所指不详”者 | 倒祠 |

`typeConfidence` 为 `high`（由注释明确归类）或 `medium`（仅在原文中按
命名模式识别，如“有兽焉，其名曰X”）。

---

## 数据模式 (schema)

### books.json

```jsonc
{
  "generatedAt": "2026-08-07",
  "source": "太极书馆 (8bei8.com)",
  "bookCount": 4,
  "totalChapters": 86,
  "totalEntries": 1057,
  "entityCount": 1441,
  "relationCount": 1572,
  "entityTypes": { "mountain": 371, "river": 233, /* ... */ },
  "books": [
    {
      "id": "shanhaijing",            // 书的稳定 ID
      "title": "山海经",
      "titleEn": "Classic of Mountains and Seas",
      "pinyin": "Shānhǎijīng",
      "era": "先秦至西汉",
      "category": "地理志 · 神话志怪",
      "description": "……",          // 来自资料的内容提要
      "totalEntries": 569,
      "chapters": [
        {
          "index": 1,
          "title": "南山经第一",
          "entryCount": 37,
          "entityCount": 191,
          "file": "chapters/shanhaijing/01.json",
          "sourceUrl": "https://www.8bei8.com/book/shanhaijing_1.html"
        }
      ]
    }
  ]
}
```

### entities.json （摘要）

```jsonc
{
  "generatedAt": "2026-08-07",
  "source": "太极书馆 (8bei8.com)",
  "count": 1441,
  "types": { /* 各类型数量 */ },
  "entities": [
    {
      "id": "西王母",
      "name": "西王母",
      "pinyin": "",                  // 若注释标注了读音则给出
      "aliases": ["瑶池金母"],       // 异名、又名、X之山等变体
      "type": "deity",
      "typeConfidence": "high",
      "description": "古代神话传说中的女神……",  // 取自注释；可能为 null
      "bookCount": 3,
      "mentionCount": 10,
      "books": ["shanhaijing", "huainanzi", "soushenji"]
    }
  ]
}
```

### entities/&lt;id&gt;.json （完整记录）

比摘要多出 `mentions`（逐条出处）与 `firstSeen`：

```jsonc
{
  "id": "女娲",
  "name": "女娲",
  "pinyin": "wā",
  "aliases": [],
  "type": "deity",
  "typeConfidence": "high",
  "description": "神话中人类的始祖……",
  "firstSeen": { "bookId": "shanhaijing", "chapterIndex": 16 },
  "mentions": [
    {
      "bookId": "shanhaijing",
      "chapterIndex": 16,
      "entryId": "shanhaijing-16-03",
      "type": "annotation",          // annotation = 来自注释；text = 来自原文
      "annotationExplanation": "神话中人类的始祖……"  // 仅 annotation 类型有
    },
    {
      "bookId": "shanhaijing",
      "chapterIndex": 16,
      "entryId": "shanhaijing-16-03",
      "type": "text",
      "context": "有神十人，名曰女娲之肠。化为神……"  // 原文片段，仅 text 类型有
    }
  ]
}
```

通过 `entryId` 可在对应 `chapters/<bookId>/<chapterIndex>.json` 的 `entries`
中定位到完整原文与译文。

### relations.json

```jsonc
{
  "generatedAt": "2026-08-07",
  "source": "太极书馆 (8bei8.com)",
  "count": 1572,
  "relations": [
    {
      "source": "丽麂水",
      "target": "海",
      "type": "flows_into",
      "description": "丽麂水流注于海",
      "occurrenceCount": 1,
      "occurrences": [
        { "bookId": "shanhaijing", "chapterIndex": 1, "entryId": "shanhaijing-01-01" }
      ]
    }
  ]
}
```

关系类型：

| type | 含义 | source → target |
|---|---|---|
| `flows_into` | 河流流向 | 河流 → 所注入的水/河/海/泽 |
| `contains` | 山产某物（“有兽/鸟/草/木焉，其名曰X”） | 山 → 兽/鸟/草/木等 |
| `appears_with` | 两个具名角色同见于一条记载 | 实体 ↔ 实体 |

`source` / `target` 均为实体的主名（`name`）；同一实体的异名已在抽取阶段
合并，关系端点不会出现已被合并的别名。

### chapters/&lt;bookId&gt;/&lt;NN&gt;.json

```jsonc
{
  "id": "shanhaijing-01",
  "bookId": "shanhaijing",
  "bookTitle": "山海经",
  "chapterIndex": 1,
  "chapterTitle": "南山经第一",
  "entryCount": 37,
  "source": {
    "website": "太极书馆 (8bei8.com)",
    "url": "https://www.8bei8.com/book/shanhaijing_1.html",
    "scrapedAt": "2026-08-07"
  },
  "entries": [
    {
      "index": 1,
      "title": "其一",
      "originalText": "南山经之首，曰鹊山……",
      "translation": "……",
      "annotations": [
        { "term": "招摇之山", "explanation": "即招摇山，山名……" }
      ]
    }
  ],
  "entityRefs": [
    { "entityName": "鹊山", "entryId": "shanhaijing-01-01", "entryTitle": "其一", "term": "鹊山" }
  ]
}
```

---

## ID 与命名约定

- 实体 `id` 由名称生成：保留中文字符，其余字符替换为 `_`
  （因此中文实体的 `id` 通常就是其名称，如 `女娲`、`昆仑山`）。
- **异名合并**：`招摇之山` 与 `招摇山` 视为同一实体；注释中“又名/亦名/
  一名/即/又称 X”会被收录进 `aliases`。纯交叉引用（如“昆仑之虚……指昆仑山”）
  会直接并入目标实体，不单独建实体。
- `entryId` 格式为 `<bookId>-<章号两位>-<条号两位>`，全局唯一，
  是连接“实体出处”与“章节原文”的外键。

## 重新生成

```bash
python3 scripts/build_knowledge.py
```

脚本仅使用 Python 3 标准库，无外部依赖。它会覆盖写入本目录下所有 JSON 文件。
