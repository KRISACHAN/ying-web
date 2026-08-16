# 把四部中国古籍塞进 1M 上下文：Seed-Evolving 能自己构建一个神话世界吗？

> * 作者：陈大鱼头
> * github：[https://github.com/KRISACHAN](https://github.com/KRISACHAN)
> * 邮箱：[chenjinwen77@gmail.com](mailto:chenjinwen77@gmail.com)
> * 项目地址：https://github.com/KRISACHAN/ying-myth-engine
> * 在线版本：https://myth.krissarea.com/

## 前言

最近身边有些高考刚毕业的弟弟妹妹们喜欢上了研究神话故事。
本来想在网上找些资源来辅助他们学习。
在找资料的时候发现字节的 [Seed-Evolving](https://ark.volcengine.com/region:cn-beijing/promotion/model?modelName=doubao-seed-evolving) 又更新了，这次号称提升了三大能力：

1️⃣ Coding 工程能力大幅提升：复杂仓库修复、跨文件修改和长程工程任务更稳，适合代码修复生成与仓库级开发；
2️⃣ Agent 检索能力显著增强：信息检索、缺失召回和结果整合更好，多工具并行调用与结果回传更稳定，适合深度调研与自动化工作流；
3️⃣ 幻觉控制能力明显改善：更少基于错误检索结果或错误工具调用继续作答，交付结果更真实可追溯。

在了解的过程中给了我一个新的想法，那就是：**不如我用 AI 给弟弟妹妹们做一个神话元素知识库吧？**

于是有了以下的计划：

```mermaid
flowchart LR
    A["🔍 搜索资料"] --> B["📥 爬取资料"]
    B --> C["🗂️ 结构化数据"]
    C --> D["🔎 数据校验"]
    D --> E["💻 网站开发"]
```



## 搜索资料

我打算给他们整理这四部著作：

1. [《山海经》](https://www.8bei8.com/book/shanhaijing.html)
2. [《搜神记》](https://www.8bei8.com/book/soushenji.html)
3. [《楚辞》](https://www.8bei8.com/book/chuci.html)
4. [《淮南子》](https://www.8bei8.com/book/huainanzi.html)

为此我找了 2 个靠谱的数据源：

1. [维基文库](https://zh.wikisource.org/wiki/Wikisource:%E9%A6%96%E9%A1%B5)
2. [太极书馆](https://www.8bei8.com/)

最终因为觉得 **太极书馆** 的界面好看：

![](https://bucket.krissarea.com/blog/seed-evolving2/1.png)

并且内容还有注释：

![](https://bucket.krissarea.com/blog/seed-evolving2/2.png)

所以选择使用他们家的书籍作为主要数据源。

不过由于 **Wikisource** 也有相对完整的原典文本，因此我会把 Wikisource 作为第二套独立数据源，用来做后面的数据校验。



## 爬取资料

因为使用的是第三方网站整理的数据，即使这些古籍原文本身早已进入公有领域，为了避免后续产生不必要的问题与纠纷，我还是提前联系了站长，申请爬取相关页面。

![](https://bucket.krissarea.com/blog/seed-evolving2/3.png)

征得同意之后，我就新建了一个 GitHub 仓库来承载这次的项目：

[https://github.com/KRISACHAN/ying-myth-engine](https://github.com/KRISACHAN/ying-myth-engine)

然后我对 Seed-Evolving 说：

```markdown
我已经征得了 https://www.8bei8.com/ 网站站长的同意，可以去爬取它们家的网站内容。
我需要爬取网站里的这四本书的数据：

1. [《山海经》](https://www.8bei8.com/book/shanhaijing.html)
2. [《搜神记》](https://www.8bei8.com/book/soushenji.html)
3. [《楚辞》](https://www.8bei8.com/book/chuci.html)
4. [《淮南子》](https://www.8bei8.com/book/huainanzi.html)

你帮我把这四部书的内容全部爬取到 @sources/8bei8 文件夹里。
```

上面贴出的链接是书的目录页，我没有告诉它要读取目录链接，再根据链接爬取内容，我认为按着官网的介绍，Seed-Evolving 应该知道自己要做什么才对，故此我只是简洁地把需求喂给它。

**最终结果**

![](https://bucket.krissarea.com/blog/seed-evolving2/4.png)

从结果来看，这一步基本没什么问题。
它能够自行分析页面结构、找到具体内容，再编写脚本完成批量抓取。
但大多数模型都能做到这种程度，所以算是中规中矩吧。



## 结构化数据

数据源有了，接下来就要让 **Seed-Evolving** 把这些内容整理成可以被网站真正使用的数据。

这里才是我觉得这次实验比较有意思的地方。

HTML 转 Markdown、JSON 其实不难，写个脚本就行。

真正难的是：**四部书里面哪些内容值得提取？应该怎么分类？同一个人物在不同典籍中出现怎么办？注释、原文、译文要怎么区分？**

这些问题已经不是简单的字符串处理了，而需要模型真正去理解内容。

所以我依旧没有告诉它实现方案，只给了一个产品层面的目标：

```txt
分析 @sources/8bei8/ 中的四部古籍，提取其中有价值的中国神话知识，并生成适合后续网站开发使用的结构化数据到 @data/。
我希望在后续网站中，可以清楚地了解不同人物、事物、概念的出处、原文解释及相互关联。
所有内容必须以提供的资料为依据；资料中没有解释的内容请保留未知，不要使用外部知识自行补充。具体如何实现，你自行判断。
```

这里我特意加了一条：**不要使用外部知识自行补充。**

因为像《山海经》《楚辞》这种内容，模型训练数据里本身就可能已经见过。

如果资料没有写，但是模型自己“知道”，然后顺手补进去，那我根本无法判断最终知识库里的内容到底来自原始资料，还是来自模型自己的记忆。

所以这里我希望它做到的是：**资料有依据就写，没有依据就承认不知道。**

**最终结果**

![](https://bucket.krissarea.com/blog/seed-evolving2/5.png)

最终 Seed-Evolving 自己完成了数据结构设计，并生成了后续网站可以直接消费的知识数据。

不过问题也来了：**这些数据到底靠不靠谱？**

毕竟第一轮结构化依旧是模型自己生成的。

所以我决定再给它一次机会，让它回过头来审查自己。



## 数据校验

结构化数据有了，接下来就是数据校验了。

这一阶段，我会引入 Wikisource 作为独立原典来源，让 Seed-Evolving 对上一阶段生成的数据进行二次审查：
一方面交叉验证知识内容的准确性；
另一方面重新审视它自己设计的数据结构，看看是不是适合后续网站开发。

因此有：

```txt
这是 Wikisource 中的四本书籍：

1. [《山海经》](https://zh.wikisource.org/zh-hans/%E5%B1%B1%E6%B5%B7%E7%B6%93)
2. [《搜神记》](https://zh.wikisource.org/zh-hans/%E6%90%9C%E7%A5%9E%E8%A8%98)
3. [《楚辞》](https://zh.wikisource.org/wiki/%E6%A5%9A%E8%BE%AD)
4. [《淮南子》](https://zh.wikisource.org/wiki/%E6%B7%AE%E5%8D%97%E5%AD%90)

将这四部书的内容完整爬取并保存到 @sources/wikisource/。

然后以 Wikisource 原典为参考，对 @data/ 中你上一阶段生成的数据进行全面校验，包括内容准确性与数据结构合理性。

发现问题请自行判断并修正，同时输出一份校验报告，记录发现的问题和修改结果。
```

输入 -> 回车 -> 等待结果。

**最终结果**

![](https://bucket.krissarea.com/blog/seed-evolving2/6.png)

在这一阶段里， Seed-Evolving 并不是简单地把两个数据源做字符串 Diff，而是真的在检查：**自己上一阶段生成的数据有没有问题。**

**校验规模**

它最终从 Wikisource 获取了四部书共 **78 篇原典**：

* 《山海经》18 篇
* 《搜神记》21 篇
* 《楚辞》17 篇
* 《淮南子》22 篇

然后对上一阶段生成的数据进行了完整性检查。

最终的数据规模是：

| 数据 |       数量 |
| -- | -------: |
| 实体 | **1441** |
| 关系 | **1572** |
| 章节 |   **86** |
| 条目 | **1057** |

最终结构完整性检查结果：**0 error / 0 warning**

包括：

* 实体摘要与详情文件数量一致；
* 所有关系端点都指向有效实体；
* 没有悬空引用；
* 没有实体自环关系；
* 章节中的实体引用全部有效；
* 所有引用都可以定位回对应章节。

但是，比这些数字更有价值的是：**它真的发现了自己第一次抽取数据时犯的错误。**

至于数据检验报告，大家可以看 [数据校验报告（Wikisource 原典对照）](https://github.com/KRISACHAN/ying-myth-engine/blob/prod/data/VALIDATION_REPORT.md)

所以说它检索能力还是很强的，在大量复杂的数据中能够正确解构，建立结构化数据以及自我省察。



## 网站开发

数据准备完成之后，终于到了最后一步：**把前面整理出来的数据真正用起来。**

这一阶段我依旧不准备告诉 Seed-Evolving 应该使用什么页面结构、组件库或者交互方案。

因为如果连页面应该怎么设计、数据应该怎么展示都由我提前规定好，那么它的能力就跟不上官网的介绍了。

所以这次我只告诉它：

```txt
基于前面生成并校验后的 @data/ 数据，开发一个中国神话知识网站。

目标：
让用户可以浏览不同人物、异兽、地点、事件等内容，并清晰了解它们的来源、原文依据、解释以及与其他内容的关联。

网站展示的所有内容必须来自 @data/，禁止自行编造知识。

项目最终需要部署到 Vercel，请确保能够正常构建和部署。

你自行分析数据结构并完成网站开发。
```

输入 -> 回车 -> 等待结果。

就是让人无法理解，明明最终选择技术栈是 next.js，有生成项目架构的 `create-next-app`，非要自己一个一个地手敲。

让人忍不住要骂一句 XXX。

算了，只能说经验还有待提升吧。

![](https://bucket.krissarea.com/blog/seed-evolving2/7.png)

后面生成结果之后由于又多了一些灵感，所以又对话了几回，但是都是属于功能新增，就不在文章中展示出来了。

**最终结果**

![](https://bucket.krissarea.com/blog/seed-evolving2/8.png)

![](https://bucket.krissarea.com/blog/seed-evolving2/9.png)

从 UI 上看，效果我觉得还算不错。

虽然依旧脱不掉一点 AI 味，但至少已经没有那种非常典型的“AI 紫 + 发光渐变”。

看得出来，**Seed-Evolving 在审美上应该也是比以前有些进步的。**

**注：**

我已经部署到 Vercel 了，想体验的童鞋可以直接访问：

[https://myth.krissarea.com/](https://myth.krissarea.com/)

项目地址是：

https://github.com/KRISACHAN/ying-myth-engine

如果发现有什么问题，也欢迎随时反馈。



## 后记

回到文章最开始的问题：**把四部中国古籍塞进 1M 上下文，Seed-Evolving 能自己构建一个神话世界吗？**

我的答案是：**可以，但经验来有点不够。**

我没有提前告诉它数据应该怎么建模，也没有规定网站应该怎么设计，更没有把每一步任务拆好之后再让它照着执行。

我更多只是告诉它：**我想得到什么。**

然后观察它能不能自己把这件事往下推进。

最终，这条链路确实被完整跑通了：

```mermaid
flowchart LR
    A["🔍 搜索资料"] --> B["📥 爬取资料"]
    B --> C["🗂️ 结构化数据"]
    C --> D["🔎 数据校验"]
    D --> E["💻 网站开发"]
```

当然，从编码的角度来看，它还是有小瑕疵；数据处理也无法再一次里完成。

但它能在大量数据的前提下进行二次校验，并修复问题，这点还是比较不错的，没有一条路走到黑，死不认错。

最后再说一句：

Coding 能把工程做完，Agent 能把任务跑通，幻觉控制能让结果有据可查——这次 Seed-Evolving 的三项升级，至少在这个项目里，我都看到了。

这件事还是让我觉得很惊喜的。