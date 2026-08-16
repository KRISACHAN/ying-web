#!/usr/bin/env python3
"""
Build structured knowledge data from scraped Markdown sources.

Reads:  sources/8bei8/<book>/*.md
Writes: data/books.json              — book/chapter index with metadata
        data/entities.json           — extracted entity catalog
        data/relations.json          — relationships between entities
        data/chapters/<book>/NN.json — full chapter content with entity refs

Every entity and claim is traceable to its source (book, chapter, URL).
Entities not explained in the source material are left with type "unknown"
and description null — no external knowledge is added.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "sources" / "8bei8"
DATA_DIR = ROOT / "data"
CHAPTER_DIR = DATA_DIR / "chapters"
SCRAPE_DATE = "2026-08-07"
SOURCE_SITE = "太极书馆 (8bei8.com)"
BASE_URL = "https://www.8bei8.com/book"

# ── Book metadata ──────────────────────────────────────────────────────────

BOOKS_META = [
    {
        "id": "shanhaijing",
        "title": "山海经",
        "titleEn": "Classic of Mountains and Seas",
        "pinyin": "Shānhǎijīng",
        "era": "先秦至西汉",
        "category": "地理志 · 神话志怪",
        "dirName": "山海经",
        "description": (
            "《山海经》是中国先秦重要古籍，传世版本共十八卷，包括《山经》五卷、"
            "《海经》十三卷。内容主要是民间传说中的地理知识，包括山川、道里、民族、"
            "物产、药物、祭祀、巫医等，保存了夸父逐日、女娲补天、精卫填海、大禹治水等"
            "远古神话传说和寓言故事。"
        ),
    },
    {
        "id": "soushenji",
        "title": "搜神记",
        "titleEn": "In Search of the Supernatural",
        "pinyin": "Sōushénjì",
        "era": "东晋",
        "category": "志怪小说 · 神话传说",
        "dirName": "搜神记",
        "description": (
            "《搜神记》是东晋史学家干宝编撰的古代民间传说中神奇怪异故事集，"
            "共二十卷，大小故事四百五十四篇。所叙多为神灵怪异之事，也有不少民间传说"
            "和神话故事，主角有鬼、妖怪和神仙，设想奇幻，极富浪漫主义色彩。"
            "本数据集还包含十卷《搜神后记》及佚文。"
        ),
    },
    {
        "id": "chuci",
        "title": "楚辞",
        "titleEn": "Verses of Chu",
        "pinyin": "Chǔcí",
        "era": "战国至东汉",
        "category": "诗歌总集 · 神话",
        "dirName": "楚辞",
        "description": (
            "《楚辞》是中国文学史上第一部浪漫主义诗歌总集，西汉刘向编辑成集，"
            "东汉王逸作章句。以屈原作品为主，收录战国楚人屈原、宋玉及汉代淮南小山、"
            "东方朔、王褒、刘向等人辞赋。运用楚地文学样式、方言声韵和风土物产，"
            "具有浓厚地方色彩。其中《离骚》《九歌》《天问》等篇保存了丰富的上古神话材料。"
        ),
    },
    {
        "id": "huainanzi",
        "title": "淮南子",
        "titleEn": "Huainanzi",
        "pinyin": "Huáinánzǐ",
        "era": "西汉",
        "category": "哲学著作 · 神话",
        "dirName": "淮南子",
        "description": (
            "《淮南子》（又名《淮南鸿烈》《刘安子》）是西汉淮南王刘安及其门客集体编写的"
            "道家哲学著作。内容繁富，包罗万象，涉及哲学、政治、天文、地理、农学、生物、"
            "音律、神话等方面。书中保存了女娲补天、后羿射日、嫦娥奔月等大量上古神话传说，"
            "是研究中国古代神话的重要典籍。"
        ),
    },
]

BOOK_ID_BY_DIR = {b["dirName"]: b["id"] for b in BOOKS_META}

# ── Entity signal detection ────────────────────────────────────────────────
# An annotation is treated as a mythology entity only if its explanation
# contains one of these classification / mythology signals. Pure word-gloss
# annotations (e.g. "亟：急切", "伏：通'服'") are skipped — they explain
# classical Chinese usage, not named mythology entities.

ENTITY_SIGNAL_KEYWORDS = [
    # classification suffixes
    "山名", "山系名", "水名", "川名", "河名", "海名", "泽名", "渊名",
    "池名", "潭名", "泉名", "井名",
    "地名", "邑名", "城名", "台名", "宫名", "殿名", "阁名", "楼名",
    "门名", "关名", "塞名", "桥名", "陵名", "墓名", "丘名", "墟名",
    "古县名", "县名", "郡名", "州名", "府名", "路名", "道名", "省名",
    "古地名", "古城名", "古邑名", "古台名", "古宫名", "古地名",
    "国名", "国号", "古国名", "古族名", "族名", "部落名", "氏族名",
    "民族名", "种族名", "部族",
    "神名", "仙名", "人名", "姓名", "古人名",
    "兽名", "鸟名", "鱼名", "蛇名", "龙名", "虫名", "贝名", "龟名",
    "鳖名", "马名", "牛名", "羊名", "犬名", "豕名", "鹿名",
    "草名", "木名", "树名", "植物名", "花名", "果名", "药名",
    "玉名", "石名", "矿物名", "金属名", "宝名",
    "星名", "星宿", "星座", "风名", "节气",
    "剑名", "琴名", "瑟名", "鼓名", "钟名", "车名", "船名", "弓名",
    "鼎名", "璧名", "器名", "物名",
    "土坝", "水坝", "堤坝", "小桌",
    # legendary/mythological markers
    "传说中的", "神话中", "上古", "远古", "古代传说",
    "古代神", "山神", "水神", "雨师", "风伯", "雷神",
    "太阳神", "月神", "天神", "地神",
    "仙人", "神仙", "真人", "神人", "神女", "玉女",
    "西王母", "女娲", "伏羲", "夸父", "精卫", "嫦娥", "姮娥",
    "五帝", "上帝", "天帝", "帝俊", "颛顼", "少昊", "太皞",
    "炎帝", "黄帝", "尧", "舜", "禹", "后羿", "羿",
    "昆仑山", "不周山", "蓬莱", "扶桑", "弱水",
    "凤", "凰", "鸾", "麒麟", "饕餮", "穷奇", "梼杌", "混沌",
    "毕方", "九尾狐", "白泽", "英招", "陆吾", "开明兽",
    "三足乌", "青鸟", "青鸟",
    # locational / antiquity markers that indicate a named place
    "在今", "治今", "旧址", "遗址", "故城", "故址",
    "相传", "据传",
]

# Textual-criticism / word-gloss indicators — skip these entirely
GLOSS_INDICATORS = [
    "通“", '通"', "通'",  # phonetic loan
    "同“", '同"', "同'",  # variant form
    "指后来", "指后天", "指先天", "指这里", "此处指", "这里指",
    "这里的", "此处的",
    "系衍文", "为衍文", "字系衍文", "二字系衍文", "两字系衍文",
    "应作", "当为", "当作", "疑为", "疑是", "本作",
    "一作", "或作", "或为",
    "字之误", "二字误", "误倒", "误衍",
    "不是经文", "后人的注解", "后人所加",
    "否定句", "宾语提前", "句式",
    "形容词", "动词", "名词", "副词", "连词", "介词", "助词",
    "语气词", "代词",
    "的样子", "之貌", "的意思", "这里比喻", "比喻",
    "通假字", "古今字",
    "象声词", "拟声词", "形声字",
    "楚方言", "方言",
    "卦名",  # I Ching hexagram names are not mythology entities
    # textual-criticism patterns
    "字前当有", "字后当有", "字后应有", "字前应有",
    "字前当有", "后面应有", "前面应有", "此字",
    "似有脱漏", "文字似有",
    "念前当有", "前面当有",
    # medical / body-part glosses — not mythology entities
    "传染病", "瘟疫", "恶疮", "毒疮", "皮肤病", "皮肤病",
    "腹内结块", "颈上的大瘤", "寄生虫",
    # pure action / description glosses
    "犹言粉身碎骨", "做恶梦", "梦魇",
    "男女通奸",
    # purely abstract / literary glosses (not proper-noun entities)
    "极言其", "极言", "光明纯洁", "喻指", "喻内部",
    "问卜之辞", "以上四句", "作者自谓",
    "象声词", "光彩耀目", "洁白光亮",
    "旅途艰苦", "保持容颜", "说别人的坏话",
    "向人敬酒", "调味用", "糖浆", "糖稀",
    "急火煮", "咬啮", "光着脚", "行走时佩饰",
    "撑齐并梳整", "低湿之地",
    "怜惜", "同情", "宽容", "赦免",
    "剖开", "破开", "往外透", "往外冒",
    "用刀", "用斧",
    "不伤人", "叶上无刺",
    "指甲", "趾甲", "雌性", "雄性",
    "视物模糊",
    "生育", "后裔", "请求活命", "爱护生命",
    "织布", "经线", "梳整纱缕",
    "味美如油脂",
    "珍美", "肴馔",
    "隐藏", "埋藏", "善、好",
    "像用刀斧", "劈削",
    "佩带",
    "吐丝", "呕丝",
    "群鸟栖止",
    "雄鸡爪", "脚趾的部分",
    "故意做作", "状若齿痛",
    "吃巴蛇",
    "胸部的骨肉", "胸部以下裸露",
    "枝枝梧梧", "支支吾吾",
    "以蕙草编缀",
    "麋鹿等的角",
    "太阳西落", "日影",
    "湖南最大",
    "眼睛的合缝处很直", "正骑乘",
    "味酸的食物",
    "蛇脱下的皮",
    "应是一种动物",
    "指疣子",  # 寓 — disease
    "前应有", "前当有",  # textual notes about missing characters
    "放达之人", "被放逐之人",
    # textual variants without mythology content
    "借为",
    # phrase-level glosses (not named entities)
    "把一年划分为", "按照一年中的",
]


def is_entity_annotation(term, explanation):
    """
    Determine whether an annotation pair describes a named mythology entity
    (as opposed to a common-word gloss or textual-criticism note).
    """
    # Strip pinyin from term for length checks
    clean_term = re.sub(r'\([^)]*\)', '', term).strip()

    # Check for positive entity signal first. Annotations like
    # "少昊：一作少皞，传说中远古东夷族的首领..." start with a textual
    # variant note ("一作") but then contain a real entity explanation.
    has_positive_signal = False
    for kw in ENTITY_SIGNAL_KEYWORDS:
        if kw in explanation:
            has_positive_signal = True
            break
    if term in KNOWN_MYTHOLOGY_TERMS:
        has_positive_signal = True

    # Exclude pure textual criticism / grammar notes, but only when there
    # is no positive entity signal later in the explanation.
    if not has_positive_signal:
        for indicator in GLOSS_INDICATORS:
            if indicator in explanation:
                return False

    if has_positive_signal:
        return True

    # Also positive: term itself is a known mythology name (2+ chars)
    # that appears in classical texts as a proper noun
    if term in KNOWN_MYTHOLOGY_TERMS:
        return True

    # Short explanation + short term = likely word gloss, skip
    if len(explanation) <= 6 and len(clean_term) <= 3:
        # e.g. "亟：急切", "伏：通'服'", "事：侍奉"
        return False

    # Single-char term whose explanation starts with 指 and gives a verbal /
    # common-word sense rather than pointing at a named entity. Distinguish
    # 河：指黄河 (entity, keep) from 汤：指烫(酒)、温(酒) (verb gloss, skip):
    # the latter does not name a place/person/deity within the first clause.
    if len(clean_term) == 1 and re.match(r'^指', explanation):
        first_clause = re.split(r'[，。；、,;]', explanation, 1)[0]
        if not re.search(r'[名神帝王国山川水河江海泽渊湖石玉星仙王侯]', first_clause):
            return False

    # Explanation is just a definition using "指X" where X is abstract
    if re.match(r'^指[^，。]{1,8}$', explanation) and len(explanation) <= 8:
        return False

    # Explanation that is purely a verb/action meaning (single short clause)
    if len(explanation) <= 4 and not re.search(r'[名神国山山川水木草鸟兽鱼虫玉石星人帝仙龙凤]', explanation):
        return False

    # Common-word glosses that are NOT named mythology entities:
    # body parts, diseases, general verbs/adjectives, ordinary objects.
    # (By this point, positive entity signals have already returned True.)
    # adjective/state descriptions ending in 貌
    if re.search(r'[貌](?:[。，]|$)', explanation) and len(clean_term) <= 4:
        return False
    # body-part definitions
    if re.search(r'(?:鸟兽|人|禽|鸟|兽|麋鹿|鹿|牛|马|羊|豕|犬)的?(?:嘴|指甲|趾甲|羽毛|翅膀|腿|脚|尾巴|头|眼|耳|鼻|舌|齿|骨|皮|毛|肉|血|雌性|雄性|角|蹄|爪)', explanation):
        return False
    if re.search(r'等的角', explanation):
        return False
    # body hair / bristles / mane glosses (e.g. 鬣：兽类颈上的长毛)
    if len(clean_term) <= 2 and re.search(
        r'(?:颈上|头上|身上|背上|尾部|兽类|鸟类|禽类)?的?(?:长毛|鬃毛|硬毛|柔毛|羽毛)',
        explanation,
    ):
        return False
    # disease definitions
    if re.search(r'(?:疟疾|瘟疫|恶疮|毒疮|皮肤病|结块|瘤子|传染病|瘊子|一种病)', explanation):
        return False
    # physical-description glosses (body shape / features of a people or creature)
    if re.search(r'(?:眼睛竖|胳膊反|脚弯曲|脚心朝|胸部.*?凸|罗圈腿|猪嘴|猪的嘴|尾巴的狐狸|九条尾巴|裸露|不长毛|肘部|关节|爪|趾甲|指甲|牙齿|鼻子|耳朵|嘴巴|前胸|后背|鸟兽的嘴|麋鹿等的角|鸟或兽|肘关节|胳膊背在身后|脚心朝)', explanation):
        return False
    # common verbs (short explanation, starts with a verb)
    if len(clean_term) <= 2 and re.match(
        r'^(?:剖开|砍|拔取|经过|经历|循行|守候|宽容|赦免|塞满|怜惜|同情|往外|生育|缉麻|度量|测量|等待|侍奉|佩带|吃|吐丝|埋葬|竖立|弯曲|抚摩|捶拍|登上|落下|流动|环绕|陈列|具备|失去|得到|使用|认为|好像|如同|说|叫|是|此|这|那)',
        explanation
    ):
        return False
    # ordinary civil-engineering / agricultural terms
    if re.search(r'^(?:堵水|田间|土坝|土埂)', explanation):
        return False
    # single / two-char terms whose explanation is a plain verb definition
    # (common-word glosses, not named entities)
    if len(clean_term) <= 2 and re.match(
        r'^(?:把|寻求|祈祷|迷信的人|祈祷以|送走|送到|埋葬|安葬|'
        r'驱除|消除|扫除|遇见|遇到|看见|听到|说|叫|认为|以为|'
        r'等待|等候|盼望|希望|贪图|贪恋|亲近|疏远|攻打|讨伐|'
        r'杀害|杀死|赦免|释放|举荐|推荐|任用|废黜|继承|传授)',
        explanation
    ):
        return False

    # Otherwise, treat as candidate entity (will be typed as unknown if unclassifiable)
    return True


# Well-known mythology proper nouns that may appear without explicit "X名"
# classification in their annotation. (Restricted to names verifiable in the
# corpus itself — these all appear in the source material with explanations.)
KNOWN_MYTHOLOGY_TERMS = {
    # deities / mythic figures
    "女娲", "伏羲", "神农", "黄帝", "炎帝", "蚩尤", "颛顼", "帝俊",
    "少昊", "太皞", "尧", "舜", "禹", "启", "后羿", "羿", "嫦娥",
    "姮娥", "西王母", "精卫", "夸父", "共工", "祝融", "句芒", "蓐收",
    "玄冥", "后土", "朱明", "刑天", "盘古", "嫘祖", "仓颉", "皋陶",
    "伯夷", "叔齐", "彭咸", "宁戚", "傅说", "吕望", "姜原", "简狄",
    "娥皇", "女英", "湘君", "湘夫人", "山鬼", "国殇", "河伯", "云中君",
    "东君", "大司命", "少司命", "东皇太一", "宓妃", "织女", "牛郎",
    "王乔", "赤松子", "王子乔", "宁封子", "师门", "啸父", "师门",
    "务光", "仇生", "文挚", "稷", "契", "冥", "微", "汤", "桀", "纣",
    "周文王", "周武王", "周公", "老子", "庄子", "孔子", "墨子",
    "屈原", "宋玉", "景差", "唐勒", "刘安", "淮南王", "干宝",
    "句芒", "神荼", "郁垒", "钟馗", "秦琼", "尉迟恭",
    # mythic places
    "昆仑", "昆仑山", "不周山", "蓬莱", "方丈", "瀛洲", "扶桑",
    "弱水", "瑶池", "玄圃", "县圃", "阆风", "增城", "九重",
    "苍梧", "九嶷", "会稽", "涂山", "荆山", "钟山", "玉山",
    "长留山", "章莪山", "天山", "泑山", "翼望山",
    "嶓冢", "岷山", "衡山", "华山", "泰山", "嵩山", "恒山", "衡山",
    "太行", "王屋", "首山", "岐山", "梁山", "霍山", "会稽山",
    "东海", "南海", "西海", "北海", "渤海", "沧海", "汤谷", "虞渊",
    "蒙汜", "甘渊", "羽渊", "雷泽", "云梦", "洞庭", "彭蠡", "震泽",
    "黄河", "长江", "汉水", "洛水", "渭水", "泾水", "沅水", "湘水",
    "赤水", "黑水", "弱水", "流沙", "赤水",
    "大夏", "大夏", "月氏", "匈奴", "东胡", "肃慎", "三苗", "九黎",
    "百越", "夜郎", "滇", "邛都", "笮都", "冉駹",
    # mythic creatures
    "凤凰", "鸾鸟", "麒麟", "饕餮", "穷奇", "梼杌", "混沌", "毕方",
    "九尾狐", "白泽", "英招", "陆吾", "开明兽", "三足乌", "青鸟",
    "烛龙", "烛阴", "应龙", "蛟龙", "虬龙", "螭龙", "蟠龙",
    "貔貅", "狻猊", "獬豸", "白泽", "重明鸟", "金吾",
    "鲛人", "人鱼", "互人", "鲧",
    # astronomical / mythic concepts
    "九天", "九州", "九野", "六合", "八极", "八纮", "四极", "四方",
    "五帝", "五方", "五行", "五色", "五味", "五音", "五谷", "五刑",
    "四时", "八风", "二十八宿", "北斗", "太一", "太岁", "岁星",
    "荧惑", "镇星", "太白", "辰星", "晨星",
    "扶桑", "若木", "建木", "寻木", "三桑",
    "不死药", "不死民", "不死国", "轩辕国", "丈夫国", "女子国",
    "白民国", "黑齿国", "三首国", "三身国", "一臂国", "奇肱国",
    "羽民国", "讙头国", "厌火国", "三苗国", "贯匈国", "交胫国",
    "岐舌国", "三首国", "周饶国", "长臂国", "长股国", "一目国",
    "柔利国", "聂耳国", "跂踵国", "拘缨国", "深目国", "无肠国",
    "博父国", "大人国", "君子国", "青丘国", "黑齿国", "玄股国",
    "毛民国", "劳民国", "氐人国", "钉灵国", "安息国", "大夏国",
    # key mythic objects
    "息壤", "九鼎", "和氏璧", "隋侯珠", "太阿", "龙泉", "干将",
    "莫邪", "轩辕剑", "射日弓",
}

# Typed dictionary of known mythology names (2+ chars only) for scanning
# original text. These names may appear in prose without a dedicated
# annotation; when found, we record the mention but leave the description
# null if the source material provides no explanation for them there.
# Types follow the same entity type taxonomy used elsewhere.
TYPED_KNOWN_TERMS = {
    # ── deities ──────────────────────────────────────────────
    "女娲": "deity", "伏羲氏": "deity", "伏羲": "deity", "神农氏": "deity",
    "神农": "deity", "黄帝": "deity", "炎帝": "deity", "蚩尤": "deity",
    "颛顼": "deity", "帝俊": "deity", "帝喾": "deity", "少昊": "deity",
    "少皞": "deity", "太皞": "deity", "太昊": "deity", "尧帝": "deity",
    "舜帝": "deity", "帝尧": "deity", "帝舜": "deity",
    "西王母": "deity", "精卫": "deity", "夸父": "deity", "共工": "deity",
    "祝融": "deity", "句芒": "deity", "蓐收": "deity", "玄冥": "deity",
    "后土": "deity", "朱明": "deity", "羲和": "deity", "常羲": "deity",
    "常仪": "deity", "尚仪": "deity", "刑天": "deity", "盘古": "deity",
    "嫘祖": "deity", "仓颉": "deity", "皋陶": "deity", "河伯": "deity",
    "云中君": "deity", "东君": "deity", "大司命": "deity", "少司命": "deity",
    "东皇太一": "deity", "宓妃": "deity", "湘君": "deity", "湘夫人": "deity",
    "山鬼": "deity", "国殇": "deity", "雨师": "deity", "风伯": "deity",
    "雷神": "deity", "灶神": "deity", "门神": "deity", "城隍": "deity",
    "神女": "deity", "玉女": "deity", "真人": "deity", "神人": "deity",
    "赤松子": "deity", "王子乔": "deity", "王乔": "deity", "宁封子": "deity",
    "啸父": "deity", "师门": "deity", "务光": "deity", "仇生": "deity",
    "文挚": "deity", "彭咸": "deity", "神荼": "deity", "郁垒": "deity",
    "钟馗": "deity",
    "嫦娥": "deity", "姮娥": "deity", "羿": "person", "后羿": "person",
    # ── people / historical figures ──────────────────────────
    "女娲": "deity", "娥皇": "person", "女英": "person",
    "伯夷": "person", "叔齐": "person", "宁戚": "person", "傅说": "person",
    "吕望": "person", "姜原": "person", "简狄": "person",
    "夏桀": "person", "商汤": "person", "商纣": "person", "桀": "person",
    "纣": "person", "汤": "person", "文王": "person", "武王": "person",
    "周公": "person", "老子": "person", "庄子": "person", "孔子": "person",
    "墨子": "person", "鲁班": "person", "屈原": "person", "宋玉": "person",
    "景差": "person", "唐勒": "person", "刘安": "person", "淮南王": "person",
    "干宝": "person", "孟尝君": "person", "王良": "person", "造父": "person",
    "师旷": "person", "詹何": "person", "蒲且子": "person", "雍门子": "person",
    "力牧": "person", "太山稽": "person",
    # ── mythic places ────────────────────────────────────────
    "昆仑山": "mountain", "昆仑": "mountain", "不周山": "mountain",
    "蓬莱": "place", "方丈": "place", "瀛洲": "place", "扶桑": "tree",
    "弱水": "river", "瑶池": "place", "玄圃": "place", "县圃": "place",
    "阆风": "place", "增城": "place", "苍梧": "place", "九嶷": "place",
    "会稽": "place", "涂山": "mountain", "荆山": "mountain", "钟山": "mountain",
    "玉山": "mountain", "汤谷": "place", "虞渊": "place", "蒙汜": "place",
    "甘渊": "place", "羽渊": "place", "雷泽": "place", "云梦": "place",
    "洞庭": "place", "彭蠡": "place", "震泽": "place",
    "东海": "river", "南海": "river", "西海": "river", "北海": "river",
    "渤海": "river", "沧海": "river",
    "黄河": "river", "长江": "river", "汉水": "river", "洛水": "river",
    "渭水": "river", "泾水": "river", "沅水": "river", "湘水": "river",
    "赤水": "river", "黑水": "river", "流沙": "place",
    # ── mythic states / peoples ──────────────────────────────
    "三苗": "state", "九黎": "state", "匈奴": "state", "东胡": "state",
    "肃慎": "state", "月氏": "state", "百越": "state", "夜郎": "state",
    "大夏": "state", "轩辕国": "state", "丈夫国": "state", "女子国": "state",
    "白民国": "state", "黑齿国": "state", "三首国": "state", "三身国": "state",
    "一臂国": "state", "奇肱国": "state", "羽民国": "state", "讙头国": "state",
    "厌火国": "state", "贯匈国": "state", "交胫国": "state",
    "周饶国": "state", "长臂国": "state", "长股国": "state", "一目国": "state",
    "柔利国": "state", "聂耳国": "state", "跂踵国": "state", "拘缨国": "state",
    "深目国": "state", "无肠国": "state", "大人国": "state", "君子国": "state",
    "青丘国": "state", "玄股国": "state", "毛民国": "state", "劳民国": "state",
    "氐人国": "state", "钉灵国": "state", "安息国": "state",
    # ── mythic creatures ─────────────────────────────────────
    "凤凰": "bird", "鸾鸟": "bird", "麒麟": "creature", "饕餮": "creature",
    "穷奇": "creature", "梼杌": "creature", "混沌": "creature", "毕方": "bird",
    "九尾狐": "creature", "白泽": "creature", "英招": "creature",
    "陆吾": "creature", "开明兽": "creature", "三足乌": "bird",
    "青鸟": "bird", "烛龙": "serpent", "烛阴": "serpent", "应龙": "serpent",
    "蛟龙": "serpent", "虬龙": "serpent", "螭龙": "serpent", "蟠龙": "serpent",
    "貔貅": "creature", "狻猊": "creature", "獬豸": "creature",
    "重明鸟": "bird", "鲛人": "creature", "人鱼": "creature",
    # ── astronomy / concepts ─────────────────────────────────
    "九天": "concept", "九州": "concept", "九野": "concept",
    "六合": "concept", "八极": "concept", "八纮": "concept",
    "五帝": "concept", "五方": "concept", "五行": "concept",
    "四时": "concept", "八风": "concept", "二十八宿": "star",
    "北斗": "star", "太一": "star", "太岁": "star",
    "岁星": "star", "荧惑": "star", "镇星": "star", "太白": "star",
    "辰星": "star",
    "建木": "tree", "若木": "tree", "寻木": "tree", "三桑": "tree",
    "不死药": "object", "息壤": "mineral", "九鼎": "object",
    "和氏璧": "object", "隋侯珠": "object", "干将": "object",
    "莫邪": "object", "太阿": "object",
}


# ── Entity type classification ─────────────────────────────────────────────
# Ordered by specificity: first match wins.

ENTITY_TYPE_RULES = [
    # ── deities / spirits / immortals ─────────────────────────────
    ("deity", [
        "传说中的神", "传说中的上古神", "古代神", "神话中", "司.*?之神",
        "天神", "山神", "水神", "雨师", "风伯", "雷神", "太阳神",
        "西王母", "女娲", "伏羲", "夸父", "精卫", "嫦娥", "姮娥",
        "五帝之一", "上帝", "天帝", "帝俊", "颛顼", "少昊", "太皞",
        "炎帝", "黄帝", "神名", "神仙", "仙人", "真人", "神女",
        "灵", "灶神", "门神", "城隍",
        "共工的儿子", "帝喾的妻子", "帝喾之子", "黄帝.*?之子",
        "炎帝.*?之", "颛顼.*?之",
        "传说中.*?神", "主.*?之神",
        "后土", "句龙", "祝融", "蓐收", "句芒", "玄冥", "朱明",
        "羲和", "常羲", "常仪", "尚仪",
        "神荼", "郁垒",
    ]),
    # ── people / historical / legendary figures ───────────────────
    ("person", [
        "古人名", "传说中的人", "人名", "姓名", "姓.*?名", "字.*?名",
        "巧匠名", "匠人名", "古代巧匠", "传说中的巧匠",
        "帝王", "国君", "君主", "皇帝", "天子", "夏王", "商王", "周王",
        "楚王", "大夫", "官员", "将领", "太子", "公子", "皇后",
        "哲学家", "思想家", "文学家", "诗人", "史学家", "道家",
        "战国.*?人", "春秋.*?人", "汉代.*?人", "东晋.*?人",
        "淮南王", "屈原", "宋玉", "干宝", "刘安", "禹", "汤", "文王",
        "武王", "纣", "桀", "尧", "舜", "启", "后羿", "羿",
        "王良", "造父", "师旷", "詹何", "蒲且子", "雍门子", "孟尝君",
        "倕", "鲁班", "墨子",
        "殷高宗", "高宗", "高辛氏", "帝喾", "傅说",
        "作者虚拟的人物", "正直贤善",
        "吕望", "屠夫",
        "古代传说中的小人", "传说中的小人", "身材特别矮小",
        "属同一类人", "骑马的侍从", "贵族的骑马",
        "禺貌", "禺京", "禺号", "淫梁",
        "的儿子", "之子", "之臣", "之贤臣", "之相", "之孙",
        "舜的儿子", "禹之贤臣",
    ]),
    # ── mythical creatures / animals ──────────────────────────────
    ("creature", [
        "传说中的一种兽", "传说中的兽", "传说中的一种怪兽", "怪兽",
        "兽名", "兽也", "传说中的动物", "动物名",
        "神话中.*?兽", "传说中的.*?动物",
        "马名", "牛名", "羊名", "犬名", "豕名", "鹿名",
        "兽类", "哺乳动物", "野牛", "野马", "牦牛",
        "传说中.*?兽", ".*?的一种兽",
        "传说中的一种马", "传说中的.*?马",
        "传说中的野人",
        "蜗牛", "螺", "蚌", "蛤", "蝾螈", "蜥蜴", "鼍", "鼋",
        "昆虫", "虫名", "寄生蜂", "蜂", "害虫",
        "牛的一种", "马的一种",
        "豪猪", "鹿一类", "长尾猿", "小猪", "猪",
        "鼠名", "猴子", "猿",
        "怪物", "妖怪", "山林中的妖怪",
        "在水里暗中害人",
        "象牛肝", "马腹",
        "大型的灰色鼠", "两栖类蛙类",
        "指开明兽",
        "蛀蚀木头的虫子", "树木上生长的蛀虫", "蛀虫",
        "尾部有毒针", "刺人的虫", "有毒针",
        "割去一块肉", "长着两只眼睛", "很快又会长",
        "又叫聚肉",
    ]),
    ("bird", [
        "鸟名", "鸟也", "传说中的鸟", "传说中的一种鸟", "禽名",
        "神话中.*?鸟", "凤", "凰", "鸾", "朱雀", "玄鸟",
        "雉的一种", ".*?的一种鸟", "水鸟", "乌鸦",
        "鸥", "鹭", "鹤", "雁", "燕", "雀", "鹊", "鸠", "鸮",
        "同.{0,3}鸥", "同.{0,3}凤",
        "野鸡", "长尾的野鸡", "翠鸟", "雕", "凶猛的鸟",
        "即雕", "隼",
        "鸾凤一类", "凤一类", "一类的鸟", "鸾凤一类的鸟",
    ]),
    ("fish", [
        "鱼名", "鱼也", "传说中的鱼", "传说中的一种鱼", "鱼属",
        "龟名", "鳖名", "贝名", "蛤名",
        ".*?的一种鱼", "水生动物", "两栖类动物",
        "大鲵", "娃娃鱼", "鲫鱼", "鱼胁",
    ]),
    ("serpent", [
        "蛇名", "蛇也", "龙名", "传说中的龙", "蛟龙", "虬", "螭",
        "传说中的蛇", "蛇属",
        "怪蛇", "一种蛇", "传说中的一种蛇",
        "委蛇", "延维", "毒蛇", "蝮蛇", "一种毒蛇",
    ]),
    # ── plants ────────────────────────────────────────────────────
    ("plant", [
        "草名", "植物名", "草本", "草药名",
        "传说中的草", "传说中的一种草",
        "落叶灌木", "灌木", "草本植物",
        "粳稻", "糯稻", "黍属", "粮食作物",
        "竹名", "竹片",
        "香草", "兰草一类", "兰花的一种", "兰花", "蕙兰",
        "茜.*?草", "可用于占卜的草",
        "真菌", "低等生物",
        "荆一类的植物", "酸枣树",
        "酒母", "发酵物",
        "豆类植物",
    ]),
    ("tree", [
        "木名", "树名", "乔木", "木本植物",
        "传说中的木", "传说中的树", "传说中的一种树",
        "古书上说的一种树", "一种树", "的一种树",
        "柳的一种", "桐树", "桂花树", "木犀",
        "树林", "森林",
    ]),
    # ── minerals / materials ──────────────────────────────────────
    ("mineral", [
        "矿物名", "玉名", "石名", "金属", "金矿", "银矿", "铜矿",
        "铁矿", "朱砂", "丹砂", "水晶", "玉石", "宝石", "珍珠",
        "矿物",
        "有色土", "涂饰的.*?土", "博戏.*?石头",
        "丹类物质", "铅汞", "红土",
        "美玉", "美石", "似玉", "玉屑", "磨刀石", "磨石",
        "粗的磨刀石",
        "黑色的磨刀石",
        "软体动物",  # 珧 etc.
    ]),
    # ── geography ─────────────────────────────────────────────────
    ("mountain", [
        "山名", "山系名", "山也", "山，", "山丘", "山陵", "山岗",
        "传说中的山", "即.*?山$", "即今.*?山", "山峰",
    ]),
    ("river", [
        "水名", "川名", "河名", "水也", "水泽", "泽名", "渊名",
        "池名", "潭名", "泉名", "海名", "海也", "水名，",
        "传说中的水", "即今.*?水", "即今.*?河", "即今.*?江",
        "即今.*?湖", "即今.*?泽", "水名。",
        "支流", "上游", "下游", "源出",
        "指.{0,3}(?:江|河|水|溪)", "即.{0,3}(?:江|河|水|溪)",
        r"[一-鿿]水[、，,].{0,6}[一-鿿]水",  # 沅水、湘水
        "流入洞庭", "流入长江", "流入黄河",
    ]),
    # State is checked before place: an annotation like "古国名，在今..."
    # names a polity, even though it also carries a "在今" locational clue.
    ("state", [
        "国名", "国号", "诸侯国", "部落名", "氏族名", "部落",
        "古代国名", "传说中的国",
        "古族名", "民族名", "部族", "种族", "古国名", "诸侯国名",
        "古代对.*?族", "古代对.*?各族", "东方各族", "西方各族",
        "南方各族", "北方各族", "四夷", "九黎", "三苗",
        "即.*?国$",
        "泛称北方边地", "西域的民族", "胡人", "东边的胡人",
        "周初封为", "封为子国",
    ]),
    ("place", [
        "地名", "邑名", "城名", "台名", "宫名", "殿名", "建筑",
        "古地名", "处所", "地方", "区域名",
        "古县名", "县名", "郡名", "州名", "府名", "治今",
        "古邑名", "古城名", "古台名", "古宫名", "古地名",
        "泽薮名", "湖名", "沼泽名",
        "旧址", "遗址", "在今",
        "古代指日本", "古代对.*?的称呼", "古称", "今.*?一带",
        "幽渺之地", "水边之地", "水涯", "水北", "水南",
        "所居之地", "所居之处", "居住的地方", "异族所居", "所居之区",
        "位于今", "在湖南", "在湖北", "朝鲜半岛",
        "谷名", "林名", "之野", "行宫", "秘密居住",
        "山名",  # some places are mountains
        "城门名", "苏州城门", "天门",
        "湖泽", "生长着很多草的湖",
        "沙洲", "环翠谷",
        "地区名", "齐地",
        "幽.*?内室", "幽暗",
        "黄河的.*?发源地", "九条支流",
        "分布十分广泛的树林",
        "夹在.*?之间",
        "海市", "集市",
        "聚集之地", "群鸟栖止",
    ]),
    # ── astronomy / calendar ──────────────────────────────────────
    ("star", [
        "星名", "星宿", "星座", "星辰", "行星", "岁星", "荧惑",
        "镇星", "太白", "辰星", "恒星", "彗星", "虹", "霓",
        "风名", "节气", "历法",
        "纪年法", "星岁", "太岁", "摄提",
        "北斗", "牵牛", "织女", "太一", "天一",
    ]),
    # ── objects / artifacts ───────────────────────────────────────
    ("object", [
        "器物", "器具", "兵器", "乐器", "礼器", "玉器", "工具",
        "车名", "船名", "剑名", "琴名", "瑟名", "鼓名", "钟名",
        "礼帽", "帽子", "冠冕", "佩囊", "内衣", "衣裳", "衣服",
        "鼎", "璧", "圭", "璋", "琮", "琥", "璜",
        "古代的一种.*?(?:车|船|剑|弓|琴|鼓|钟|镜|印|玺|瓦器|簪|箱|刀|斧)",
        "传说中的.*?(?:宝|珠|玉|剑|弓|镜|药)",
        "脚镣", "手铐", "桎梏",
        "车毂", "冒盖", "印绶", "箱子",
        "乐名", "乐曲", "乐舞", "舜之乐",
        "大锅", "刑具", "烹煮", "锅", "瓦器", "蒸饭", "蒸食",
        "古代蒸.*?器", "炊具",
        "束发的头巾", "草鞋", "丝织品", "精米", "祭神用",
        "一种簪子",
        "盛.*?的",
        "花萼",
        "系在箭上的丝绳", "捕鸟的网", "华盖",
        "刹住车轮", "车辕", "有帷盖的车子",
        "戴在头上的一种饰物",
        "隆起的饰物",
        "彩色花纹的丝织物",
        "用蕙草编缀的带子",
        "江米.*?做成的食品", "糯米.*?食品",
        "矮墙", "屏障",
        "箭杆",
        "小桌", "凭依", "搁置物件",
        "堵水的土坝", "土坝",
    ]),
    # ── measurement units ────────────────────────────────────────
    ("unit", [
        "古代以.*?为一", "长度单位", "重量单位", "面积单位",
        "容量单位", "计量单位", "古时.*?单位", "地积单位",
        "量器名", "量器，", "粮食量器",
        "脚步测量", "以.*?亩",
    ]),
    # ── concepts / cosmology ─────────────────────────────────────
    ("concept", [
        "古说天有", "上古行政区划", "指天地及",
        "春、夏、秋、冬", "四季", "四方", "八极", "八纮",
        "祭祀时用作祭品", "供祭祀用", "祭品", "带毛的纯色",
        "筑坛祭天", "祭祀", "封禅",
        "干支纪日", "干支纪年", "申时", "午后",
        "五行", "五常", "五音", "五味", "五色", "五藏", "五种山经",
        "卦", "爻",
        "传说中一种能自己生长",
        "能自己生长", "永不耗减",
        "宇宙", "混沌", "元气",
        "忠", "孝", "仁", "义", "礼", "智", "信",
        "道", "德", "理", "气",
        "是谓", "称为", "统称", "总称",
        "不祥之兆", "预示着", "古时认为",
        "一种仪仗", "呈盖状的云",
        "去皮壳后",
        "太阳西落",
        "成约", "彼此说定",
        "适中", "不偏",
        "全牲", "纯色",
        "请.*?风雨",
        "九州之地", "怪火", "日影", "指太阳",
        "刮来的风", "俊风",
        "养生术", "呼吸吐纳", "导引", "方术", "法术", "巫术",
    ]),
    # ── concepts / abstract ───────────────────────────────────────
    ("concept", [
        "概念", "哲学术语", "道家术语", "儒家术语", "学说",
        "道德概念", "哲学概念", "抽象概念",
    ]),
]

# Terms that are linguistic/grammar and should NOT be entities
GRAMMAR_INDICATORS = [
    "助词", "语气词", "语气助词", "介词", "连词", "副词",
    "代词", "句首语词", "句末语气", "结构助词", "指示代词",
    "疑问代词", "形容词词尾", "动词后缀", "名词词头",
    "发语词", "语助词", "衬字", "无实义", "无实意",
    "虚字", "音助", "表示修饰", "表示顺承", "表示转折",
    "表示并列", "表示递进", "表示假设", "表示因果",
]

# Terms that are annotation commentary, not actual entity names
NON_ENTITY_PREFIXES = [
    "一说", "或说", "另说", "应作", "疑为", "疑是",
    "当为", "当作", "此指", "这里指", "此处指",
    "一说指", "一说应", "一说当", "一说此",
]

# Single-character terms that are common function words / not entities.
# These are ONLY grammar particles, pronouns, and common abstract verbs/adjectives
# that appear in annotations explaining classical Chinese usage — NOT content words.
# (Only single characters matter here; the filter checks len(clean) == 1.)
SINGLE_CHAR_STOPWORDS = set(
    # 代词 / pronouns
    "之其此彼尔汝我吾他它焉爰"
    # 语气词 / modal particles
    "乎者也矣焉哉兮欤耶夫盖"
    # 介词连词 / prepositions & conjunctions (single char)
    "于以与为因由自从及至到往向在当方将乃遂则辄故"
    "而且虽若如苟倘使令纵即"
    # 副词 / adverbs (single char)
    "不亦尝既已将方正适会辄卒终竟"
    "俱皆咸尽悉毕率举凡诸众群"
    "独唯特直仅才徒"
    "尚犹仍还且又亦复更"
    "甚极殊孔至尤最绝颇差少稍略"
    "凡可宜当应须合"
    "勿毋莫非无弗不未没"
    "皆俱并共相"
    "即良实信诚确真"
    "亦反更却顾"
    # 数词 / numbers
    "一二三四五六七八九十百千万亿兆两双"
    # 方位 / directions
    "上下左右外内中旁侧前后"
    # 其他单字虚词
    "已尝当应宜合始初终末竟卒故斯兹彼夫何曷胡盍奚孰谁莫罔苟"
)


def is_valid_entity_term(term, explanation=""):
    """
    Check if an annotation term is a plausible entity name.
    Filters out grammar, commentary, pinyin-only, and function-word terms.
    """
    # Must contain at least one Chinese character
    if not re.search(r'[一-鿿]', term):
        return False

    # Must not start with commentary phrases
    for prefix in NON_ENTITY_PREFIXES:
        if term.startswith(prefix):
            return False

    # Strip a single outer wrapping pair of book-title / quotation brackets
    # (e.g. "《九招》" is the work title 九招, not a phrase). Internal brackets
    # after this mean multiple titles were joined — reject those below.
    bare = term
    for left, right in ("《》", "〈〉", "「」", "“”", '""', "''"):
        if bare.startswith(left) and bare.endswith(right) and len(bare) >= 3:
            bare = bare[1:-1]
            break

    # Must not contain certain patterns. A title wrapped in ONE pair of
    # brackets ("《九招》") is fine; brackets left over after unwrapping mean
    # several titles were run together (e.g. "《九辩》与《九歌》").
    if re.search(r'[，。；！？、《》〈〉]', bare):
        return False
    # Two names/titles joined by a conjunction is a phrase, but a conjunction
    # can be part of a genuine place name ("女和月母之国", "胡不与之国"). Only
    # reject when the term does NOT end in a place-name suffix.
    if (
        re.search(r'[与和及]', bare)
        and len(bare) >= 4
        and not re.search(r'(之国|国|山|水|河|江|海|泽|渊|湖|池|丘|陵|野|谷)$', bare)
    ):
        return False
    term = bare
    if re.search(r'(当断句|为衍文|系衍文|应作|疑为|一说)', term):
        return False
    # Unclosed parenthesis = parsing artifact
    if term.count("(") != term.count(")"):
        return False

    # A pinyin parenthetical appearing before the first Chinese character
    # means the CJK glyph itself was lost in scraping (e.g. "(bèi)山").
    # recover_term_from_explanation() has already run by this point; if it
    # could not restore the glyph, the name cannot be trusted — skip it.
    first_cjk = re.search(r'[一-鿿]', term)
    first_paren = term.find("(")
    if first_paren != -1 and (first_cjk is None or first_paren < first_cjk.start()):
        return False

    # Strip pinyin for length checks
    clean = re.sub(r'\([^)]*\)', '', term).strip()
    if not clean:
        return False

    # Too short: single char must not be a stopword
    if len(clean) == 1 and clean in SINGLE_CHAR_STOPWORDS:
        return False

    # Too long: likely a phrase, not a name
    if len(clean) > 12:
        return False

    # Contains verb/particle patterns typical of commentary
    if re.match(r'^(此|这|那|其|该)', clean) and len(clean) <= 2:
        return False
    # A demonstrative pronoun mid-term (此/这/其 followed by a noun) means the
    # captured term is a clause fragment, not a name (e.g. 司此玄蛇).
    if len(clean) >= 3 and re.search(r'[此这那]', clean):
        return False

    # Phrase detection: multi-character terms that start with verbs or
    # contain sentence-like patterns are usually not entity names.
    if len(clean) >= 3:
        # Starts with a common verb / negative
        if re.match(r'^(不|无|有|为|曰|言|云|谓|号|见|观|视|望|顾|入|出|'
                    r'来|去|至|到|取|予|求|与|使|令|教|遣|知|识|思|念|'
                    r'喜|乐|怒|哀|爱|敬|恭|食|饮|立|住|举|握|变|改|始|'
                    r'终|成|如|似|能|可|足|得|行|走|奔|赴|离|还|归|'
                    r'动|入|反|内|外|上|下|前|后|左|右|东|西|南|北)', clean):
            # But allow known proper nouns that happen to start with these chars
            if clean not in KNOWN_MYTHOLOGY_TERMS and not re.search(
                r'(山|水|河|海|泽|国|丘|台|宫|星|神|帝|仙|氏|鸟|兽|鱼|龙|蛇)$',
                clean
            ):
                return False

        # Contains action/description patterns (verb + object)
        if re.search(r'(天地|责己|抚膺|不顾|所指|所.)', clean):
            return False

    # Terms that are annotation artifacts (start with 名曰, 有神 etc.)
    if re.match(r'^(名曰|有神|有兽|有鸟|有鱼|有草|有木|有人|见则|名曰)', clean):
        return False

    # Onomatopoeia (repeated characters)
    if len(clean) >= 2 and len(clean) % 2 == 0:
        half = len(clean) // 2
        if clean[:half] == clean[half:] and re.match(r'^[一-鿿]+$', clean):
            # Check that it's actually onomatopoeia in explanation
            if "声" in (explanation or "") or "象声" in (explanation or ""):
                return False

    return True


def recover_term_from_explanation(term, explanation):
    """
    Some scraped terms lost their Chinese characters (rare CJK glyphs) and
    only pinyin remains, e.g. '(bì)' instead of '鷩(bì)'. Try to recover
    the actual name from patterns in the explanation:
      同"X" / 即"X" / 又名X / 亦名X / 一名X
    Returns recovered name or None.
    """
    # If term already has Chinese chars, no recovery needed
    clean = re.sub(r'\([^)]*\)', '', term).strip()
    if clean and re.search(r'[一-鿿]', clean):
        return None

    # Try 同"X" / 即"X" patterns (variant character explanations)
    m = re.search(r'[同即]["“”]([^"“”]+)["“”]', explanation)
    if m:
        candidate = m.group(1).strip()
        # Strip any pinyin from the recovered name
        candidate = re.sub(r'\([^)]*\)', '', candidate).strip()
        if candidate and re.search(r'[一-鿿]', candidate) and len(candidate) <= 8:
            return candidate

    return None

# ── Markdown parsing ───────────────────────────────────────────────────────

def parse_chapter_md(md_text):
    """
    Parse a chapter Markdown file into structured entries.

    Returns: (book_title, chapter_title, entries)
    Each entry has: index, title, originalText, translation, annotations
    """
    lines = md_text.split("\n")

    book_title = ""
    chapter_title = ""
    for line in lines:
        if line.startswith("# "):
            parts = line[2:].split("·", 1)
            if len(parts) == 2:
                book_title = parts[0].strip()
                chapter_title = parts[1].strip()
            else:
                chapter_title = parts[0].strip()
            break

    entries = []
    current_entry = None
    current_section = None
    section_lines = []
    pending_title = None
    body_started = False

    def flush_section():
        nonlocal section_lines, current_section, current_entry
        if current_section and current_entry is not None:
            text = "\n".join(section_lines).strip()
            if current_section == "annotations":
                current_entry["annotations"] = parse_annotations(text)
            else:
                current_entry[current_section] = text
        section_lines = []

    def start_entry(title=None):
        nonlocal current_entry, current_section, pending_title
        flush_section()
        if current_entry is not None:
            entries.append(current_entry)
        current_entry = {
            "title": title or "",
            "originalText": "",
            "annotations": [],
            "translation": "",
        }
        current_section = None
        pending_title = None

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("## 原文"):
            body_started = True
            if current_entry is None:
                start_entry(pending_title)
            elif pending_title and not current_entry.get("originalText"):
                current_entry["title"] = pending_title
            elif current_entry.get("originalText"):
                start_entry(pending_title)
            current_section = "originalText"
            section_lines = []
            continue
        if stripped.startswith("## 注释"):
            flush_section()
            current_section = "annotations"
            section_lines = []
            continue
        if stripped.startswith("## 译文"):
            flush_section()
            current_section = "translation"
            section_lines = []
            continue
        if stripped.startswith("## ") or stripped.startswith("# "):
            flush_section()
            current_section = None
            section_lines = []
            continue
        if not body_started:
            continue

        # Detect a sub-title sitting between entries. In 搜神记/山海经 a short
        # standalone line between 译文 and the next 原文 is the next story or
        # mountain name (e.g. "徐登与赵昞", "堂庭山"). But in verse such as
        # 楚辞, every translation line is itself short (e.g. "我是古帝高阳氏的
        # 远末子孙啊，"), so we must NOT treat those as titles. Genuine titles
        # never end in sentence/verse punctuation; translation lines do.
        if (
            stripped
            and current_section == "translation"
            and len(stripped) < 40
            and not stripped.startswith("|")
            and not stripped.endswith(
                ("。", "，", "！", "？", "；", "：", "、", ",", ".",
                 "!", "?", ";", ":", "兮", "也", "矣", "哉", "乎", "焉")
            )
        ):
            flush_section()
            pending_title = stripped
            current_section = None
            continue

        if current_section:
            section_lines.append(line)

    flush_section()
    if current_entry is not None:
        entries.append(current_entry)

    # Auto-title unnamed entries
    for i, entry in enumerate(entries):
        if not entry["title"]:
            entry["title"] = "" if len(entries) == 1 else f"其{cn_numeral(i + 1)}"
        entry["index"] = i + 1

    return book_title, chapter_title, entries


def cn_numeral(n):
    digits = "零一二三四五六七八九"
    if n <= 10:
        return digits[n] if n < 10 else "十"
    if n < 20:
        return "十" + digits[n - 10]
    tens, ones = divmod(n, 10)
    result = digits[tens] + "十"
    if ones:
        result += digits[ones]
    return result


def parse_annotations(text):
    """Parse annotation text into {term, explanation} pairs."""
    if not text.strip():
        return []
    annotations = []
    for paragraph in text.split("\n"):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        for term, explanation in split_annotations(paragraph):
            term = term.strip()
            explanation = explanation.strip()
            if term and explanation:
                annotations.append({"term": term, "explanation": explanation})
    return annotations


def split_annotations(text):
    """Split a paragraph into (term, explanation) pairs."""
    pattern = re.compile(r'(?:^|。)\s*([^：。\n]{1,20}?)：')
    matches = list(pattern.finditer(text))
    results = []
    for i, match in enumerate(matches):
        term = match.group(1).strip()
        exp_start = match.end()
        exp_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        explanation = text[exp_start:exp_end].strip()
        if explanation.endswith("。"):
            explanation = explanation[:-1]
        if term and explanation:
            results.append((term, explanation))
    return results


# ── Entity extraction ──────────────────────────────────────────────────────

def is_grammar_term(explanation):
    """Check if an annotation explains a grammar/function word."""
    for indicator in GRAMMAR_INDICATORS:
        if indicator in explanation:
            return True
    return False


def classify_entity(term, explanation):
    """
    Classify an entity based on its term and annotation explanation.
    Returns type string.
    """
    # Strongest signal first: an explicit "<category>名" label in the
    # annotation (国名、山名、水名、兽名、鸟名、草名、木名、星名、神名…).
    # These are authoritative and must win over incidental name-substrings
    # elsewhere in the explanation (e.g. 楚 is a state even though its note
    # mentions 楚文王; 燕 is a state even though 燕 is also a bird name).
    explicit = [
        ("state", r"古国名|诸侯国名|国名|国号|古族名|民族名|部落名|氏族名"),
        ("mountain", r"山系名|山名|山岳"),
        ("river", r"水名|川名|河名|泉名|潭名|江名"),
        ("place", r"地名|邑名|城名|古地名|古邑名|县名|郡名|州名|府名|泽名|渊名|池名|湖名|海名|泽薮名|沼泽名"),
        ("creature", r"兽名|动物名|哺乳动物|马名|牛名|羊名|犬名|豕名|鹿名|鼠名|虫名|昆虫"),
        ("bird", r"鸟名|禽名|凤名"),
        ("fish", r"鱼名|龟名|鳖名|贝名|蛤名"),
        ("serpent", r"蛇名|龙名"),
        ("plant", r"草名|植物名|草药名|竹名|香草名"),
        ("tree", r"木名|树名|乔木|果木名"),
        ("mineral", r"矿物名|玉名|石名|金属名"),
        ("star", r"星名|星宿名|星座名|风名"),
        ("deity", r"神名|仙名"),
        ("person", r"古人名|人名|姓名"),
        ("object", r"器物名|器具名|兵器名|乐器名|礼器名|车名|船名|剑名|琴名|瑟名|鼓名|钟名|瓦器|玉器名"),
    ]
    for etype, pat in explicit:
        if re.search(pat, explanation):
            return etype

    # A term that itself ends in a geographic suffix, with an explanation
    # pointing at a place ("…的地方", "在今…", "山名"…), is a place even if
    # the explanation incidentally contains person keywords like "之臣"
    # (e.g. "禹攻共工国山：指禹杀共工之臣相柳的地方").
    if re.search(r'的地方|处所|所在|在今|位于今|山名|地名', explanation):
        if re.search(r'(山|丘|陵)$', term):
            return "mountain"
        if re.search(r'(水|河|江|泽|渊|湖|池|海)$', term):
            return "river"
        if re.search(r'国$', term):
            return "state"

    # Single-character keywords (汤, 禹, 凤, 气 ...) are too short to match
    # as bare substrings: "汤谷" is not the person 汤, "香气" is not the
    # concept 气. For these, require either an exact match on the term, or a
    # token boundary in the explanation (adjacent to punctuation, a particle,
    # or non-CJK text). Multi-char keywords match normally.
    BOUNDARY = r'[，。；：、！？“”"\'\'（）()\s之乎者也于以而及其曰为则与和乃则即至在]'
    for entity_type, keywords in ENTITY_TYPE_RULES:
        for kw in keywords:
            if re.fullmatch(r'[一-鿿]', kw):
                in_term = (term == kw)
                in_explanation = re.search(
                    r'(?:(?:^|' + BOUNDARY + r')' + re.escape(kw) + r')|(?:' +
                    re.escape(kw) + r'(?=' + BOUNDARY + r'|$))', explanation)
            else:
                in_term = re.search(kw, term)
                in_explanation = re.search(kw, explanation)
            if in_term or in_explanation:
                return entity_type

    # Secondary pass: pattern-based classification for explanations
    # that don't use explicit "X名" keywords.

    # "传说中的一种兽/鸟/鱼/草/木/蛇/龙/马..."
    m = re.search(r'传说中的[^，。；]{0,8}?([兽鸟鱼蛇龙龟鳖贝草木马牛犬羊鹿])', explanation)
    if m:
        ch = m.group(1)
        if ch in "兽马牛犬羊鹿":
            return "creature"
        if ch == "鸟":
            return "bird"
        if ch in "鱼龟鳖贝":
            return "fish"
        if ch in "蛇龙":
            return "serpent"
        if ch == "草":
            return "plant"
        if ch == "木":
            return "tree"

    # "X的一种" patterns
    if re.search(r'(?:兽|哺乳动物|牛|马|羊|犬)的一种', explanation):
        return "creature"
    if re.search(r'鸟的一种|禽的一种', explanation):
        return "bird"
    if re.search(r'鱼的一种|龟的一种|水生动物', explanation):
        return "fish"
    if re.search(r'蛇的一种|龙的一种', explanation):
        return "serpent"
    if re.search(r'草(?:本)?(?:植物)?的一种|草本', explanation):
        return "plant"
    if re.search(r'木(?:本)?(?:植物)?的一种|乔木', explanation):
        return "tree"

    # "X名" suffix patterns (more general)
    m = re.search(r'(?:即|一?名|叫|又称|亦称)([^，。；、]{1,8}?)(?:的|之|也|$)', explanation)

    # Known deity/person name patterns
    if re.search(r'(?:帝|王|后|妃|子|公|侯|伯|男|氏)$', term) and len(term) <= 4:
        return "person"
    if re.search(r'^(?:帝|王|后|妃)', term) and len(term) <= 4:
        return "deity" if any(d in term for d in "神帝俊喾尧舜颛顼皞昊炎黄") else "person"

    # Religious / professional roles (巫, 祝, 史, 卜 etc.)
    if len(term) == 1 and term in "巫祝史卜医":
        return "person"

    # Fallback heuristics based on term characters
    if term.endswith("山") or term.endswith("丘"):
        return "mountain"
    if term.endswith("水") or term.endswith("川") or term.endswith("河") or term.endswith("泽"):
        return "river"
    if term.endswith("海") or term.endswith("渊") or term.endswith("池") or term.endswith("湖"):
        return "river"
    if term.endswith("草"):
        return "plant"
    if term.endswith("木") or term.endswith("树"):
        return "tree"
    if term.endswith("鸟") or term.endswith("雀") or term.endswith("凤") or term.endswith("鸾"):
        return "bird"
    if term.endswith("鱼") or term.endswith("龟") or term.endswith("鳖") or term.endswith("贝"):
        return "fish"
    if term.endswith("兽") or term.endswith("马") or term.endswith("牛") or term.endswith("羊"):
        return "creature"
    if term.endswith("蛇") or term.endswith("龙"):
        return "serpent"
    if term.endswith("国"):
        return "state"
    # 山海经 pattern: "X之民" = a people group / state
    if term.endswith("之民") or term.endswith("民"):
        if re.search(r'(?:国|族|部落|人|民|身材|传说)', explanation) or term.endswith("之民"):
            return "state"
    if term.endswith("星") or term.endswith("宿") or term.endswith("风") or term.endswith("云"):
        return "star"
    if term.endswith("神") or term.endswith("帝") or term.endswith("仙"):
        return "deity"
    if term.endswith("氏"):
        return "person"
    if term.endswith("玉") or term.endswith("石"):
        return "mineral"
    # furniture / structural objects
    if re.search(r'(?:桌|椅|床|榻|案|几|柜|架|坝|堤|堰|塘)', term):
        return "object"

    return "unknown"


def extract_pinyin(term):
    """
    Extract pinyin from a term and return (clean_name, pinyin). Pinyin may be
    trailing (狌狌(xīnɡ xīnɡ)) or inline (会(kuài)稽山, 三天子鄣(zhānɡ)山).
    All parenthetical pinyin is stripped from the clean name; multiple pinyin
    fragments are joined with spaces.
    """
    pinyin_parts = re.findall(r'\(([^)]+)\)', term)
    clean = re.sub(r'\([^)]*\)', '', term).strip()
    pinyin = " ".join(p.strip() for p in pinyin_parts if p.strip()) or None
    return clean, pinyin


def normalize_term(term):
    """
    Canonicalize a term for entity matching / dedup.

    In addition to stripping pinyin and book-title punctuation, this folds
    the classical Chinese X之山 / X之水 forms to their modern X山 / X水
    forms so that (e.g.) "招摇之山" and "招摇山" merge into one entity.
    Leading narrative prefixes such as "其首曰" / "名曰" are also removed.
    """
    name, _ = extract_pinyin(term)
    name = name.strip("《》""''()（） \t")
    # Strip leading narrative prefixes that sometimes get captured as the name
    name = re.sub(r'^(其[一二三四五]?[首山]?曰|名曰|名曰|名日|其名日|其名曰|有神|有鸟|有兽|有鱼|有草|有木)', '', name)
    # The "凡X山之首，自Y之山至于Z之山" tally lines occasionally capture a
    # leading 自/至 with the mountain name. Text scans of "曰/有/其X之山" can
    # also grab the leading particle (and the 8bei8 source sometimes mis-types
    # 曰 as 日).
    name = re.sub(r'^[自至曰日有其]', '', name)
    # A few 8bei8 annotation terms pick up a section heading prefix, e.g.
    # "东山神樕𧑤之山" for 樕𧑤之山, "中山神共水" for 共水. Drop the
    # "<direction>山[经]神" prefix when the rest is itself a place name.
    m = re.match(r'^[東东南西北中]山(?:经|經)?神(.+)$', name)
    if m and re.search(r'(山|水|河|江|泽|渊|丘|陵)$', m.group(1)):
        name = m.group(1)
    name = name.strip()
    # Fold X之山 → X山, X之水 → X水, X之泽 → X泽, etc.
    name = re.sub(r'^(.+?)之(山|水|河|江|海|泽|渊|湖|池|溪|谷|野|丘|陵)$', r'\1\2', name)
    return name


def name_variants(name):
    """
    Return common spelling variants of a place/entity name that should all
    resolve to the same entity. E.g. 招摇山 ↔ 招摇之山.
    """
    variants = {name}
    m = re.match(r'^(.+?)(山|水|河|江|海|泽|渊|湖|池|溪|谷|野|丘|陵)$', name)
    if m:
        base, suffix = m.group(1), m.group(2)
        variants.add(f"{base}之{suffix}")
    m2 = re.match(r'^(.+?)之(山|水|河|江|海|泽|渊|湖|池|溪|谷|野|丘|陵)$', name)
    if m2:
        variants.add(f"{m2.group(1)}{m2.group(2)}")
    return variants


def extract_aliases(explanation):
    """Extract aliases from annotation explanation."""
    aliases = []
    # Each pattern captures a proper-name alias. Bound the match so we don't
    # grab following verbs/particles (e.g. "即位" in "他死后，他的儿子启即位").
    patterns = [
        r'又名[叫做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'亦名[叫做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'一名[叫做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'亦称[做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'又叫[做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'也叫[做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'也叫[做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        r'又称[做]?([一-鿿A-Za-z0-9（）()]{1,10}?)(?=[，。；、的"“”]|$)',
        # 即X — only treat as an alias when X is a quoted name or a name-like
        # token (2+ chars ending in a name suffix); avoid 即位/即刻/即善 etc.
        # A negative lookbehind skips speculative "一说即X" / "或说即X", which
        # is a theory, not a definite alias (merging it would conflate places).
        r'(?<![说或])即[“"]([^”"]{1,10})[”"]',
        r'(?<![说或])即([一-鿿]{2,10}?(?:山|水|河|江|国|海|泽|渊|湖|州|邑|城|台|宫|子|氏|帝|王|神|仙|鸟|兽|鱼|蛇|龙|草|木|树|玉|石|星|风))(?=[，。；、的"“”]|$)',
    ]
    # Common verb/particle continuations that mean "即..." is NOT an alias
    alias_blacklist = {
        "位", "位，", "刻", "将", "使", "是", "为", "以", "有", "此",
        "今", "其", "之", "于", "与", "和", "同", "跟", "被", "把",
        "善", "恶", "吉", "凶", "兴", "衰", "治", "乱",
    }
    for pat in patterns:
        for m in re.finditer(pat, explanation):
            alias = m.group(1).strip()
            if alias and len(alias) <= 10 and alias not in alias_blacklist:
                # Aliases should contain at least one Chinese character and
                # not be a verb phrase or a location gloss ("今东岳泰山").
                if re.search(r'[一-鿿]', alias) and alias[0] not in "今在位于":
                    aliases.append(alias)
    return aliases


def _is_name_like(token):
    """
    A cross-reference target must look like a proper name: it ends in a
    name suffix (山/水/国/兽/鸟/王…), is a known mythology term, or is a short
    concrete noun without descriptive particles (的/所/地/方/人/东西…). This
    keeps "指昆仑山" / "指开明兽" but rejects description glosses such as
    "指为国所用", "指像三个重叠的坛", "指海内东经所记载的地方".
    """
    if not token or len(token) < 2:
        return False
    # A location gloss ("即今东岳泰山", "在今山东…") is not an identity target.
    if token[0] in "今在这那此其":
        return False
    if token in KNOWN_MYTHOLOGY_TERMS:
        return True
    if re.search(
        r'[的所]|地方|东西|呼叫|吼叫|品质|信札|理想|家眷|时光|党人|贤人|仕进|天下|格式|装饰|羽毛|蛀虫|雄鸡|泉水|象骨|树林|矮小|凸出|交替',
        token,
    ):
        return False
    if re.search(
        r'(山|水|河|江|海|泽|渊|湖|池|溪|谷|野|丘|陵|国|州|邑|城|台|宫|殿|门|关|星|神|帝|仙|王|公|侯|鸟|兽|鱼|蛇|龙|凤|凰|草|木|树|玉|石|砂|民|兽|人)$',
        token,
    ):
        return True
    # Short concrete synonym (蝌蚪, 水晶) — accept if no descriptive particle.
    return len(token) <= 4


def extract_cross_reference(explanation):
    """
    Detect an annotation whose ENTIRE content is an identity statement pointing
    at another named entity, e.g. "即昆仑山" or '一作“昆仑之墟”，即昆仑山'.
    Only "即X" is treated as a cross-reference. "指X" is deliberately excluded:
    it is a context-specific gloss ("此处指…") rather than a statement that the
    two names are identical, and merging it globally conflates distinct entities
    (e.g. 青丘之山 the mountain vs 青丘国 the state).
    """
    if not explanation:
        return None
    text = explanation.strip().rstrip("。").strip()
    # Pure "即X" / "即X也" identity statement.
    m = re.match(r'^即([一-鿿]{2,12}?)(?:也)?$', text)
    if m and _is_name_like(m.group(1)):
        return m.group(1)
    # "一作/亦作/或作 Y，即 X" — a spelling variant followed by identity.
    m = re.match(
        r'^[一亦或]?作[“"]?[一-鿿]{1,12}[”"]?[，,]\s*即([一-鿿]{2,12}?)(?:也)?$',
        text,
    )
    if m and _is_name_like(m.group(1)):
        return m.group(1)
    return None


def extract_text_entities(original_text, context_type=None):
    """
    Extract named entities directly from original text using classical Chinese patterns.
    This catches entities that may not have explicit annotations.

    Returns list of {name, type, context}
    """
    entities = []
    seen = set()

    # Dictionary scan: known mythology proper nouns (2+ chars) appearing
    # in the original text. These may not have a dedicated annotation in
    # every chapter (e.g. 黄帝 in 淮南子·览冥训), but their mention in
    # the source is still traceable. No external explanation is added;
    # description stays null unless an annotation supplies one.
    for name, etype in TYPED_KNOWN_TERMS.items():
        if len(name) < 2:
            continue  # skip single-char names — too ambiguous
        if name in original_text:
            if name not in seen:
                seen.add(name)
                # Find a short context snippet around the first occurrence
                idx = original_text.find(name)
                start = max(0, idx - 15)
                end = min(len(original_text), idx + len(name) + 15)
                entities.append({
                    "name": name,
                    "type": etype,
                    "context": original_text[start:end],
                })

    # 山海经 patterns
    # "有兽焉...其名曰X" — creature
    for m in re.finditer(
        r'有兽焉[，,].{0,80}?其名[曰叫]([^，。,；]+)',
        original_text
    ):
        name = m.group(1).strip()
        if name and len(name) <= 8 and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "creature", "context": m.group(0)[:100]})

    # "有鸟焉...其名曰X" — bird
    for m in re.finditer(
        r'有鸟焉[，,].{0,80}?其名[曰叫]([^，。,；]+)',
        original_text
    ):
        name = m.group(1).strip()
        if name and len(name) <= 8 and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "bird", "context": m.group(0)[:100]})

    # "有鱼焉...其名曰X" — fish
    for m in re.finditer(
        r'有鱼焉[，,].{0,80}?其名[曰叫]([^，。,；]+)',
        original_text
    ):
        name = m.group(1).strip()
        if name and len(name) <= 8 and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "fish", "context": m.group(0)[:100]})

    # "有草焉...其名曰X" — plant
    for m in re.finditer(
        r'有草焉[，,].{0,80}?其名[曰叫]([^，。,；]+)',
        original_text
    ):
        name = m.group(1).strip()
        if name and len(name) <= 8 and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "plant", "context": m.group(0)[:100]})

    # "有木焉...其名曰X" — tree
    for m in re.finditer(
        r'有木焉[，,].{0,80}?其名[曰叫]([^，。,；]+)',
        original_text
    ):
        name = m.group(1).strip()
        if name and len(name) <= 8 and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "tree", "context": m.group(0)[:100]})

    # "X之山" — mountain. Require a boundary before X (曰/至/望/登/于/之/
    # punctuation/start) so we don't swallow preceding verbs like "汉水出".
    for m in re.finditer(r'(?:^|[曰日有其至望登于，,。；;：:\s])([一-鿿]{2,5}之山)', original_text):
        name = normalize_term(m.group(1))
        # Reject over-captured narrative fragments. Clause-marking characters
        # (曰/望/出/至/登/入/注/于/在/从/有/而) never occur inside a real
        # toponym — their presence means the regex swallowed part of the
        # preceding clause (e.g. "东方曰东极山", "汉水出鲋鱼山", "东望谷城山").
        # We do NOT ban 攻/伐 unconditionally: event-named mountains such as
        # "鲧攻程州之山" / "禹攻共工国山" legitimately contain them after the
        # actor's name. We only reject when such a verb *starts* the capture
        # (e.g. fragment "触不周山" from "怒而触不周之山").
        if (
            name
            and len(name) <= 8
            and not re.search(r'[曰日望出至登入注于在从有而]', name)
            and not re.match(r'^[触怒杀伐攻流]', name)
            and name not in seen
        ):
            seen.add(name)
            entities.append({"name": name, "type": "mountain", "context": m.group(0)[:50]})

    # "X之水" / "X水出焉" — river
    for m in re.finditer(r'([一-鿿]{1,6}之水|[一-鿿]{1,4}水)出焉', original_text):
        name = m.group(1).replace("之水", "水").strip()
        if name and len(name) <= 8 and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "river", "context": m.group(0)[:50]})

    # "多X" — minerals/metals (common in 山海经)
    for m in re.finditer(r'多(金玉|黄金|赤金|白金|金|银|铜|铁|玉|白玉|青玉|美玉|丹粟|青雘|丹雘|水晶|水玉|石|文石)', original_text):
        name = m.group(1).strip()
        if name and name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "mineral", "context": m.group(0)[:50]})

    # Water bodies named as flow/destination targets ("注于河", "入于江",
    # "注于泑泽", "南流注于洛"). Register them so relations don't dangle.
    for m in re.finditer(
        r'(?:注?于|入于|至于|会于|归于)([一-鿿]{1,8}?(?:水|河|江|海|泽|渊|湖|池|溪|沟))',
        original_text,
    ):
        name = normalize_term(m.group(1))
        if name and len(name) <= 8 and name not in seen and not re.search(r'[出至望登曰在于从流注入]', name):
            seen.add(name)
            t = "river" if not name.endswith(("泽", "渊", "湖", "池", "海")) else "place"
            entities.append({"name": name, "type": t, "context": m.group(0)[:50]})
    # Also register the single-char water names 河/江/洛/渭/汉/淮/泗 when they
    # appear as a flow target (classical shorthand for the full river name).
    for m in re.finditer(
        r'(?:注?于|入于|至于|会于)([河洛渭汉淮泗济汝漳淇汾泾渭])',
        original_text,
    ):
        name = m.group(1)
        if name not in seen:
            seen.add(name)
            entities.append({"name": name, "type": "river", "context": m.group(0)[:50]})

    return entities


# ── Relationship extraction ────────────────────────────────────────────────

def extract_entry_relations(entry, entry_id, book_id, chapter_index, entities_in_entry):
    """
    Extract relationships between entities within an entry.
    Returns list of relation dicts.
    """
    relations = []
    original = entry.get("originalText", "")
    # Map normalized name -> type for entities in this entry
    name_to_type = {}
    for e in entities_in_entry:
        nm = normalize_term(e["name"])
        if nm:
            name_to_type[nm] = e.get("type") or e.get("resolvedType") or "unknown"
    # Also accept name variants (X之山 ↔ X山) as present in the entry
    present_variants = set()
    for nm in name_to_type:
        present_variants.update(name_variants(nm))
    entity_names = set(name_to_type.keys()) | present_variants

    water_suffixes = ("水", "河", "江", "海", "泽", "渊", "湖", "池", "溪", "沟")

    # ── River source/flow: "X水出焉...流注于Y" ──────────────────
    for m in re.finditer(
        r'([一-鿿]{1,6}之水|[一-鿿]{1,4}水)出焉[，,].{0,40}?[东南西北]?流注?于([^，。,；\s]{1,10})',
        original
    ):
        river = normalize_term(m.group(1).replace("之水", "水").strip())
        target = normalize_term(m.group(2).strip().rstrip("也"))
        # Target must be a recognized water entity or a water-name-like token
        target_ok = (
            target in entity_names
            or (len(target) >= 2 and target.endswith(water_suffixes))
        )
        if river in entity_names and target_ok and target != river:
            relations.append({
                "source": river,
                "target": target,
                "type": "flows_into",
                "description": f"{river}流注于{target}",
                "entryId": entry_id,
                "bookId": book_id,
                "chapterIndex": chapter_index,
            })

    # ── Mountain contains creatures/plants ───────────────────────
    # Find the entry's subject mountain ("曰X之山" near the start), then
    # relate it to every named thing introduced by "有Y焉...其名曰Z".
    subject_mountain = None
    sm = re.search(r'[曰至]([一-鿿]{2,5}之山)', original[:80])
    if sm:
        candidate = normalize_term(sm.group(1))
        if candidate in entity_names:
            subject_mountain = candidate

    if subject_mountain:
        for m in re.finditer(
            r'有([草鸟兽木鱼蛇虫])焉.{0,200}?其名[曰叫]([^，。,；\s]{1,8})',
            original
        ):
            thing_name = normalize_term(m.group(2).strip())
            if (thing_name in entity_names
                    and thing_name != subject_mountain):
                relations.append({
                    "source": subject_mountain,
                    "target": thing_name,
                    "type": "contains",
                    "description": f"{subject_mountain}有{m.group(1)}焉，其名曰{thing_name}",
                    "entryId": entry_id,
                    "bookId": book_id,
                    "chapterIndex": chapter_index,
                })

    # ── Narrative co-occurrence ─────────────────────────────────
    # Record co-occurrence for named actors (deities, people, states,
    # places, mountains, rivers) so the website can show "related figures".
    # Only multi-character proper names qualify; single-character tokens
    # are too ambiguous to link meaningfully.
    actor_types = {"deity", "person", "state", "place", "mountain", "river"}
    actors = []
    seen_actors = set()
    for e in entities_in_entry:
        # Prefer the resolved primary name so spelling variants of the same
        # entity don't produce a self-loop (青丘 ↔ 青丘 etc.).
        nm = normalize_term(e.get("primaryName") or e["name"])
        etype = e.get("type") or e.get("resolvedType") or "unknown"
        if (etype in actor_types and len(nm) >= 2 and nm not in seen_actors):
            seen_actors.add(nm)
            actors.append(nm)
    if 2 <= len(actors) <= 12:
        for i, name1 in enumerate(actors):
            for name2 in actors[i + 1:]:
                if name1 == name2:
                    continue
                relations.append({
                    "source": name1,
                    "target": name2,
                    "type": "appears_with",
                    "description": f"{name1}与{name2}同见于此条",
                    "entryId": entry_id,
                    "bookId": book_id,
                    "chapterIndex": chapter_index,
                })

    return relations


# ── Entity catalog (cross-book merging) ────────────────────────────────────

class EntityCatalog:
    """Collects and merges entities across all books/chapters."""

    def __init__(self):
        self.entities = {}  # normalized name -> entity dict
        self._name_index = {}  # alias -> primary name
        self._merges = []  # deferred cross-reference merge edges

    def register_cross_reference(self, alias_name, target_name,
                                 book_id, chapter_index, entry_id,
                                 explanation=None):
        """
        Record that `alias_name` is purely a cross-reference to `target_name`
        (e.g. 昆仑之虚 → 昆仑山). The actual merge is deferred to finalize(),
        after every entity has been created, so build ordering cannot produce
        a dangling target.
        """
        self._merges.append({
            "alias": alias_name,
            "target": target_name,
            "bookId": book_id,
            "chapterIndex": chapter_index,
            "entryId": entry_id,
            "explanation": explanation,
        })

    def finalize(self):
        """Apply all deferred cross-reference merges."""
        for edge in self._merges:
            target_primary = self._resolve_name(edge["target"])
            alias_primary = self._resolve_name(edge["alias"])
            alias_norm = normalize_term(edge["alias"])
            target = self.entities.get(target_primary)
            if target is None:
                # Target never became an entity on its own. Promote the target
                # name to an entity (seeded from the alias entity if present,
                # otherwise a minimal unknown record) so references resolve.
                if alias_primary in self.entities:
                    src = self.entities.pop(alias_primary)
                    src["name"] = target_primary
                    src["id"] = self._make_id(target_primary)
                    if alias_norm and alias_norm != target_primary:
                        src["aliases"].append(alias_norm)
                    if alias_primary and alias_primary != target_primary:
                        src["aliases"].append(alias_primary)
                    self.entities[target_primary] = src
                    self._register_variants(target_primary)
                    for a in set(src["aliases"]):
                        self._name_index[a] = target_primary
                    target = self.entities[target_primary]
                else:
                    self.entities[target_primary] = {
                        "id": self._make_id(target_primary),
                        "name": target_primary,
                        "pinyin": "",
                        "aliases": [alias_norm] if alias_norm and alias_norm != target_primary else [],
                        "type": "unknown",
                        "typeConfidence": "low",
                        "description": None,
                        "mentions": [],
                        "firstSeen": {
                            "bookId": edge["bookId"],
                            "chapterIndex": edge["chapterIndex"],
                        },
                    }
                    target = self.entities[target_primary]
                    self._register_variants(target_primary)
                    if alias_norm and alias_norm != target_primary:
                        self._name_index[alias_norm] = target_primary
            # Map every form of the alias to the target.
            for a in {alias_norm, alias_primary}:
                if a and a != target_primary:
                    if a not in target["aliases"]:
                        target["aliases"].append(a)
                    self._name_index[a] = target_primary
            # Fold the alias entity into the target if it exists separately.
            if alias_primary in self.entities and alias_primary != target_primary:
                src = self.entities.pop(alias_primary)
                for m in src.get("mentions", []):
                    target["mentions"].append(m)
                if not target["description"] and src.get("description"):
                    target["description"] = src["description"]
                if not target["pinyin"] and src.get("pinyin"):
                    target["pinyin"] = src["pinyin"]
                for a in src.get("aliases", []):
                    if a != target_primary and a not in target["aliases"]:
                        target["aliases"].append(a)
                    self._name_index[a] = target_primary
            # Record the cross-reference itself as a source mention.
            target["mentions"].append({
                "bookId": edge["bookId"],
                "chapterIndex": edge["chapterIndex"],
                "entryId": edge["entryId"],
                "type": "annotation",
                "annotationExplanation": edge["explanation"],
                "crossReference": True,
            })
        self._merges = []

    def _resolve_name(self, name):
        """Resolve a name to its primary entity name, following aliases."""
        n = normalize_term(name)
        if n in self.entities:
            return n
        if n in self._name_index:
            return self._name_index[n]
        # Try spelling variants (X之山 ↔ X山)
        for v in name_variants(n):
            if v in self.entities:
                return v
            if v in self._name_index:
                return self._name_index[v]
        return n

    def _register_variants(self, primary):
        """Register name variants (X之山 ↔ X山) so future mentions merge."""
        for v in name_variants(primary):
            if v != primary:
                self._name_index[v] = primary
                if v not in self.entities[primary]["aliases"]:
                    self.entities[primary]["aliases"].append(v)

    def add_mention(self, name, entity_type, explanation, book_id,
                    chapter_index, entry_id, pinyin=None, is_annotation=True):
        """Add an entity mention, creating or updating the entity record."""
        primary = self._resolve_name(name)
        normalized = normalize_term(name)

        if primary not in self.entities:
            self.entities[primary] = {
                "id": self._make_id(primary),
                "name": primary,
                "pinyin": pinyin or "",
                "aliases": [],
                "type": entity_type if entity_type != "unknown" else "unknown",
                "typeConfidence": "high" if entity_type != "unknown" else "low",
                "description": explanation if explanation else None,
                "mentions": [],
                "firstSeen": {"bookId": book_id, "chapterIndex": chapter_index},
            }
            self._register_variants(primary)

        entity = self.entities[primary]

        # If the incoming name differs from primary, record it as an alias
        if normalized != primary and normalized not in entity["aliases"]:
            entity["aliases"].append(normalized)
            self._name_index[normalized] = primary

        # Update pinyin if newly found
        if pinyin and not entity["pinyin"]:
            entity["pinyin"] = pinyin

        # Improve type if previously unknown
        if entity["type"] == "unknown" and entity_type != "unknown":
            entity["type"] = entity_type
            entity["typeConfidence"] = "high"

        # Update description from annotation if not already set
        if is_annotation and explanation and not entity["description"]:
            entity["description"] = explanation

        # Add aliases
        if explanation:
            for alias in extract_aliases(explanation):
                norm_alias = normalize_term(alias)
                if norm_alias and norm_alias != primary and norm_alias not in entity["aliases"]:
                    entity["aliases"].append(norm_alias)
                    self._name_index[norm_alias] = primary

        # Add mention
        mention = {
            "bookId": book_id,
            "chapterIndex": chapter_index,
            "entryId": entry_id,
            "type": "annotation" if is_annotation else "text",
        }
        if explanation and is_annotation:
            mention["annotationExplanation"] = explanation
        entity["mentions"].append(mention)

        return primary

    def add_text_entity(self, name, entity_type, context, book_id,
                        chapter_index, entry_id):
        """Add an entity found in original text (not from annotation)."""
        primary = self._resolve_name(name)
        normalized = normalize_term(name)

        if primary not in self.entities:
            self.entities[primary] = {
                "id": self._make_id(primary),
                "name": primary,
                "pinyin": "",
                "aliases": [],
                "type": entity_type,
                "typeConfidence": "medium",
                "description": None,
                "mentions": [],
                "firstSeen": {"bookId": book_id, "chapterIndex": chapter_index},
            }
            self._register_variants(primary)

        entity = self.entities[primary]
        # If incoming name differs from primary, record as alias
        if normalized != primary and normalized not in entity["aliases"]:
            entity["aliases"].append(normalized)
            self._name_index[normalized] = primary
        if entity["type"] == "unknown":
            entity["type"] = entity_type
            entity["typeConfidence"] = "medium"

        entity["mentions"].append({
            "bookId": book_id,
            "chapterIndex": chapter_index,
            "entryId": entry_id,
            "type": "text",
            "context": context[:200] if context else "",
        })
        return primary

    def _make_id(self, name):
        """Generate a URL-safe entity ID from name."""
        # Use the name directly; Chinese chars are valid in URLs/JSON
        return re.sub(r'[^\w一-鿿]', '_', name)

    def get_summary(self):
        """Return a summary list of all entities."""
        result = []
        for name, entity in sorted(self.entities.items()):
            # Count books and chapters
            books = set()
            chapters = set()
            for m in entity["mentions"]:
                books.add(m["bookId"])
                chapters.add(f"{m['bookId']}:{m['chapterIndex']}")

            result.append({
                "id": entity["id"],
                "name": entity["name"],
                "pinyin": entity["pinyin"],
                "aliases": entity["aliases"],
                "type": entity["type"],
                "typeConfidence": entity["typeConfidence"],
                "description": entity["description"],
                "bookCount": len(books),
                "mentionCount": len(entity["mentions"]),
                "books": sorted(books),
            })
        return result

    def get_all(self):
        return list(self.entities.values())


# ── Main build process ─────────────────────────────────────────────────────

def build():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    CHAPTER_DIR.mkdir(parents=True, exist_ok=True)

    # Clear previous generated detail/chapter files so removed entities or
    # chapters don't leave stale JSON behind.
    entities_detail_dir = DATA_DIR / "entities"
    if entities_detail_dir.exists():
        for old in entities_detail_dir.glob("*.json"):
            old.unlink()
    for old_book in CHAPTER_DIR.glob("*"):
        if old_book.is_dir():
            for old in old_book.glob("*.json"):
                old.unlink()

    catalog = EntityCatalog()
    all_relations = []
    books_output = []
    chapter_files = []
    pending_chapters = []  # (out_path, chapter_data) — written after finalize
    total_entries = 0
    total_chapters = 0

    for book_meta in BOOKS_META:
        book_id = book_meta["id"]
        dir_name = book_meta["dirName"]
        source_book_dir = SOURCE_DIR / dir_name
        output_book_dir = CHAPTER_DIR / book_id
        output_book_dir.mkdir(parents=True, exist_ok=True)

        print(f"\nProcessing 《{book_meta['title']}》...")

        chapters_index = []
        book_entry_count = 0

        for md_file in sorted(source_book_dir.glob("*.md")):
            if md_file.name == "README.md":
                continue

            m = re.match(r"(\d+)_(.+)\.md", md_file.name)
            if not m:
                continue
            page_num = int(m.group(1))
            fallback_title = m.group(2)

            md_text = md_file.read_text(encoding="utf-8")
            parsed_book, chapter_title, entries = parse_chapter_md(md_text)

            if not chapter_title:
                chapter_title = fallback_title

            # Introductory essays (e.g. 《淮南子》导读) have no 原文/注释/译文
            # structure and parse to zero entries. They are modern editorial
            # front matter, not chapters of the corpus — skip them rather than
            # emit an empty chapter page. A real chapter that fails to parse
            # will also surface here so the build log flags the regression.
            if not entries:
                print(
                    f"  skip {md_file.name}: 0 entries "
                    f"(intro/front matter or parse failure)"
                )
                continue

            total_chapters += 1
            book_entry_count += len(entries)

            # Process each entry
            chapter_entity_refs = []
            for entry in entries:
                entry_id = f"{book_id}-{page_num:02d}-{entry['index']:02d}"

                # Extract entities from annotations
                entities_in_entry = []
                for ann in entry.get("annotations", []):
                    term = ann["term"]
                    explanation = ann["explanation"]

                    if is_grammar_term(explanation):
                        continue

                    # Try to recover lost Chinese characters from explanation
                    recovered = recover_term_from_explanation(term, explanation)
                    if recovered:
                        _, orig_pinyin = extract_pinyin(term)
                        term = recovered + (f"({orig_pinyin})" if orig_pinyin else "")

                    # Some 8bei8 annotation terms are several names run together
                    # (e.g. "毛民国玄股国玄股之国：即玄股国，传说中的国名…").
                    # When the explanation starts with "即X<suffix>", use X.
                    ct, _ = extract_pinyin(term)
                    if len(re.findall(r'[国山水河江泽丘陵]', ct)) >= 2:
                        mm = re.match(
                            r'^即([一-鿿]{1,10}?(?:国|山|水|河|江|泽|渊|丘|陵))',
                            explanation,
                        )
                        if mm:
                            term = mm.group(1)

                    # A handful of 8bei8 annotation terms garble a creature/
                    # person name together with a place name (e.g. "夔流波山"
                    # for 流波山, where 夔 is the beast on it). When the full
                    # term is absent from the original text but a trailing
                    # X山/X水/... substring is present, use that substring.
                    ct2, _ = extract_pinyin(term)
                    if len(ct2) >= 4 and ct2 not in entry.get("originalText", ""):
                        _orig = entry.get("originalText", "")
                        for i in range(1, len(ct2) - 1):
                            suffix = ct2[i:]
                            if (re.search(r'(山|水|河|江|海|泽|渊|丘|陵|国)$', suffix)
                                    and suffix in _orig):
                                term = term.replace(ct2, suffix)
                                break

                    # "二山：指举山和玄扈山" — a phrase ("the two mountains"),
                    # not a named entity. Skip enumeration glosses.
                    if re.match(r'^指[^，。；]{1,8}(?:和|与|及|、)[^，。；]{1,8}', explanation):
                        continue

                    if not is_valid_entity_term(term, explanation):
                        continue

                    # A pure cross-reference (e.g. "即昆仑山" or
                    # '一作"昆仑之墟"，指昆仑山') does not define a new entity;
                    # merge the alias into its target and move on. We only do
                    # this for multi-character alias names: a single-char term
                    # like "海：指黄海" is a context-specific gloss (in that one
                    # passage "海" means the Yellow Sea), not a global alias —
                    # merging it would wrongly redirect every "注于海" relation.
                    clean_name, pinyin = extract_pinyin(term)
                    xref_target = (
                        extract_cross_reference(explanation)
                        if len(clean_name) >= 2 else None
                    )
                    if xref_target:
                        catalog.register_cross_reference(
                            alias_name=term,
                            target_name=xref_target,
                            book_id=book_id,
                            chapter_index=page_num,
                            entry_id=entry_id,
                            explanation=explanation,
                        )
                        entities_in_entry.append({
                            "name": clean_name,
                            "primaryName": catalog._resolve_name(xref_target),
                            "type": "unknown",
                        })
                        chapter_entity_refs.append({
                            "entityName": catalog._resolve_name(xref_target),
                            "entryId": entry_id,
                            "entryTitle": entry["title"],
                            "term": clean_name,
                        })
                        continue

                    # Skip non-entity word glosses (common word definitions,
                    # textual criticism notes, etc.)
                    if not is_entity_annotation(term, explanation):
                        continue

                    clean_name, pinyin = extract_pinyin(term)
                    entity_type = classify_entity(term, explanation)

                    primary = catalog.add_mention(
                        name=term,
                        entity_type=entity_type,
                        explanation=explanation,
                        book_id=book_id,
                        chapter_index=page_num,
                        entry_id=entry_id,
                        pinyin=pinyin,
                        is_annotation=True,
                    )
                    entities_in_entry.append({
                        "name": clean_name,
                        "primaryName": primary,
                        "type": entity_type,
                    })
                    chapter_entity_refs.append({
                        "entityName": primary,
                        "entryId": entry_id,
                        "entryTitle": entry["title"],
                        "term": clean_name,
                    })

                # Extract entities from original text patterns
                text_ents = extract_text_entities(entry.get("originalText", ""))
                for te in text_ents:
                    primary = catalog.add_text_entity(
                        name=te["name"],
                        entity_type=te["type"],
                        context=te.get("context", ""),
                        book_id=book_id,
                        chapter_index=page_num,
                        entry_id=entry_id,
                    )
                    entities_in_entry.append({
                        "name": te["name"],
                        "primaryName": primary,
                        "type": te["type"],
                    })
                    chapter_entity_refs.append({
                        "entityName": primary,
                        "entryId": entry_id,
                        "entryTitle": entry["title"],
                        "term": te["name"],
                    })

                # Extract relationships
                rels = extract_entry_relations(
                    entry, entry_id, book_id, page_num, entities_in_entry
                )
                all_relations.extend(rels)

            # Build chapter output
            chapter_data = {
                "id": f"{book_id}-{page_num:02d}",
                "bookId": book_id,
                "bookTitle": book_meta["title"],
                "chapterIndex": page_num,
                "chapterTitle": chapter_title,
                "entryCount": len(entries),
                "entries": entries,
                "entityRefs": chapter_entity_refs,
                "source": {
                    "website": SOURCE_SITE,
                    "url": f"{BASE_URL}/{book_id}_{page_num}.html",
                    "scrapedAt": SCRAPE_DATE,
                },
            }

            out_file = output_book_dir / f"{page_num:02d}.json"
            pending_chapters.append((out_file, chapter_data))
            chapter_files.append(str(out_file.relative_to(DATA_DIR)))

            chapters_index.append({
                "index": page_num,
                "title": chapter_title,
                "entryCount": len(entries),
                "entityCount": len(chapter_entity_refs),
                "file": f"chapters/{book_id}/{page_num:02d}.json",
                "sourceUrl": f"{BASE_URL}/{book_id}_{page_num}.html",
            })

        total_entries += book_entry_count
        book_output = {k: v for k, v in book_meta.items() if k != "dirName"}
        book_output["chapters"] = chapters_index
        book_output["totalEntries"] = book_entry_count
        books_output.append(book_output)
        print(f"  {len(chapters_index)} chapters, {book_entry_count} entries")

    # ── Write books.json ──────────────────────────────────────────
    # Apply deferred cross-reference merges now that all entities exist.
    catalog.finalize()
    # Remap any relation endpoints that pointed at a merged-away alias.
    remap = {a: t for t in catalog.entities for a in catalog.entities[t]["aliases"]}
    # Also include the canonical alias index (covers X之山 ↔ X山 and xref targets).
    for alias, primary in catalog._name_index.items():
        remap.setdefault(alias, primary)
    for rel in all_relations:
        if rel.get("source") in remap:
            rel["source"] = remap[rel["source"]]
        if rel.get("target") in remap:
            rel["target"] = remap[rel["target"]]

    # Now that all merges are settled, remap chapter entityRefs to final
    # primary names and write the chapter JSON.
    for out_file, chapter_data in pending_chapters:
        for ref in chapter_data["entityRefs"]:
            nm = normalize_term(ref["entityName"])
            if nm in remap:
                ref["entityName"] = remap[nm]
        out_file.write_text(
            json.dumps(chapter_data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    entities_summary = catalog.get_summary()
    type_counts = defaultdict(int)
    for e in entities_summary:
        type_counts[e["type"]] += 1

    # ── Deduplicate relations before counting ─────────────────────
    rel_by_key = defaultdict(list)
    for rel in all_relations:
        # Merges can collapse both endpoints onto the same primary name
        # (柔利国 → 留利之国); those are no longer real relations.
        if rel["source"] == rel["target"]:
            continue
        key = (rel["source"], rel["target"], rel["type"])
        rel_by_key[key].append(rel)

    unique_relations = []
    for (source, target, rel_type), occurrences in rel_by_key.items():
        unique_relations.append({
            "source": source,
            "target": target,
            "type": rel_type,
            "description": occurrences[0]["description"],
            "occurrenceCount": len(occurrences),
            "occurrences": [
                {
                    "bookId": o["bookId"],
                    "chapterIndex": o["chapterIndex"],
                    "entryId": o["entryId"],
                }
                for o in occurrences
            ],
        })

    books_index = {
        "generatedAt": SCRAPE_DATE,
        "source": SOURCE_SITE,
        "bookCount": len(books_output),
        "totalChapters": total_chapters,
        "totalEntries": total_entries,
        "entityCount": len(entities_summary),
        "relationCount": len(unique_relations),
        "entityTypes": dict(sorted(type_counts.items(), key=lambda x: -x[1])),
        "books": books_output,
    }
    (DATA_DIR / "books.json").write_text(
        json.dumps(books_index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # ── Write entities.json ───────────────────────────────────────
    entities_data = {
        "generatedAt": SCRAPE_DATE,
        "source": SOURCE_SITE,
        "count": len(entities_summary),
        "types": dict(type_counts),
        "entities": entities_summary,
    }
    (DATA_DIR / "entities.json").write_text(
        json.dumps(entities_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # ── Write detailed entity files ───────────────────────────────
    entities_detail_dir = DATA_DIR / "entities"
    entities_detail_dir.mkdir(exist_ok=True)
    for entity in catalog.get_all():
        entity_file = entities_detail_dir / f"{entity['id']}.json"
        entity_file.write_text(
            json.dumps(entity, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    # ── Write relations.json ──────────────────────────────────────
    # (unique_relations was deduplicated above, before counting)
    relations_data = {
        "generatedAt": SCRAPE_DATE,
        "source": SOURCE_SITE,
        "count": len(unique_relations),
        "relations": unique_relations,
    }
    (DATA_DIR / "relations.json").write_text(
        json.dumps(relations_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # ── Summary ───────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"Knowledge base built successfully!")
    print(f"{'='*60}")
    print(f"  Books:       {len(books_output)}")
    print(f"  Chapters:    {total_chapters}")
    print(f"  Entries:     {total_entries}")
    print(f"  Entities:    {len(entities_summary)}")
    print(f"  Relations:   {len(unique_relations)}")
    print(f"  Entity types:")
    for etype, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"    {etype:12s} {count}")
    print(f"\n  Output: {DATA_DIR}")
    print(f"    books.json     — book/chapter index")
    print(f"    entities.json  — entity catalog ({len(entities_summary)} entities)")
    print(f"    relations.json — relationships ({len(unique_relations)} relations)")
    print(f"    chapters/      — {total_chapters} chapter JSON files")
    print(f"    entities/      — {len(entities_summary)} detailed entity files")


if __name__ == "__main__":
    build()
