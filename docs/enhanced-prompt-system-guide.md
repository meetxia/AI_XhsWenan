# 增强版提示词系统使用指南

## 🎯 系统概述

我们为你的小红书文案生成器升级了全新的智能提示词系统，让生成的文案更加真诚、直接、有温度，并且支持多维度参数调节。

## ✨ 核心特性

### 1. **个性化风格系统**
- **5种预设个性**：谨慎理性型、热情分享型、真实体验型、专业测评型、闺蜜聊天型
- **自动适配**：根据产品类型和受众年龄智能推荐最佳个性
- **风格一致性检查**：确保生成内容符合所选个性特征

### 2. **情感温度控制**
- **温度调节（1-10）**：从冷静客观到热情洋溢
- **真实度控制（1-10）**：从完美无缺到坦露缺点  
- **兴奋度调节（1-10）**：从平静叙述到激动分享
- **动态表达库**：根据参数自动匹配合适的表达方式

### 3. **智能个性推荐**
- **产品类型适配**：教育类→理性谨慎，生活类→热情分享
- **受众年龄优化**：18-25岁→活泼时尚，36+→稳重专业
- **内容目标匹配**：信任建立→真实体验，互动参与→闺蜜聊天

## 🛠️ 使用方法

### 基础调用
```javascript
import { generateEnhancedCopy } from './backend/src/generate.js'

const result = generateEnhancedCopy(product, {
  personality: 'authentic_experiencer',  // 个性类型
  warmth: 7,                            // 情感温度
  vulnerability: 6,                     // 真实度
  excitement: 6,                        // 兴奋度
  audienceAge: '26-35',                 // 目标年龄
  contentGoal: 'engagement'             // 内容目标
})
```

### 预设风格快速使用
```javascript
// 使用预设配置
const presets = {
  "cautious_education": "谨慎教育风格",
  "enthusiastic_lifestyle": "热情生活风格", 
  "authentic_review": "真实测评风格",
  "professional_analysis": "专业分析风格",
  "bestie_recommendation": "闺蜜推荐风格"
}
```

## 📊 参数详解

### 情感温度 (warmth: 1-10)
| 级别 | 描述 | 表达示例 |
|------|------|----------|
| 1-3 | 冷静客观 | "确实"、"还行"、"客观来说" |
| 4-6 | 温和友好 | "真的不错"、"我觉得很棒" |
| 7-8 | 热情推荐 | "我真的爱了"、"太惊艳了" |
| 9-10 | 狂热安利 | "我要疯了"、"姐妹们冲鸭" |

### 真实度 (vulnerability: 1-10)
| 级别 | 描述 | 表达示例 |
|------|------|----------|
| 1-3 | 完美体验 | "一切都很完美"、"没有任何问题" |
| 4-6 | 小瑕疵 | "虽然有小瑕疵"、"说实话确实有点小问题" |
| 7-8 | 承认错误 | "我承认我之前想错了"、"老实说我也踩过坑" |
| 9-10 | 坦露脆弱 | "我当时真的很焦虑"、"说出来不怕你们笑话" |

## 🎨 个性类型详解

### 1. 谨慎理性型 (cautious_rational)
- **适用场景**：教育产品、专业工具、高价值产品
- **语言特征**：深思熟虑、数据支撑、权衡利弊
- **推荐参数**：warmth: 5, vulnerability: 4, excitement: 4

### 2. 热情分享型 (enthusiastic_sharer)  
- **适用场景**：生活用品、美妆护肤、娱乐产品
- **语言特征**：热情洋溢、强烈推荐、感染力强
- **推荐参数**：warmth: 8, vulnerability: 7, excitement: 8

### 3. 真实体验型 (authentic_experiencer)
- **适用场景**：产品测评、使用心得、对比分析
- **语言特征**：坦诚分享、真实感受、包含缺点
- **推荐参数**：warmth: 7, vulnerability: 8, excitement: 6

### 4. 专业测评型 (professional_reviewer)
- **适用场景**：技术产品、专业服务、B端产品  
- **语言特征**：客观分析、数据导向、专业术语
- **推荐参数**：warmth: 4, vulnerability: 3, excitement: 4

### 5. 闺蜜聊天型 (bestie_chat)
- **适用场景**：个人推荐、私人定制、亲密分享
- **语言特征**：亲密自然、口语化强、互动频繁
- **推荐参数**：warmth: 9, vulnerability: 8, excitement: 9

## 🔧 高级功能

### 自动个性推荐
```javascript
import PersonalityConfig from './backend/src/personality-config.js'

const config = new PersonalityConfig()
const recommendation = config.recommendPersonality({
  productType: 'education',
  audienceAge: '26-35', 
  contentGoal: 'trust_building',
  brandTone: 'professional'
})

console.log(recommendation.recommended) // 推荐的个性类型
console.log(recommendation.explanation) // 推荐理由
```

### 情感表达生成
```javascript
import EmotionController from './backend/src/emotion-controller.js'

const emotion = new EmotionController()
const expressions = emotion.generateEmotionalExpression(7, 6, 'product_review')

// 获取建议的开场、高潮、结尾表达
console.log(expressions.suggestions)
```

## 📈 质量指标

系统会自动评估生成内容的质量：

- **真实度得分**：个人体验(30%) + 具体细节(25%) + 情感诚实(25%) + 脆弱承认(20%)
- **互动度得分**：互动元素(40%) + 情感连接(30%) + 行动召唤(30%)  
- **可读性得分**：句子长度(25%) + 段落结构(25%) + 流畅过渡(25%) + Emoji使用(25%)

## 🚀 实际效果对比

### 原版生成（模板化）
```
【引入】从尝试到上手：产品名称真实体验
【主体】
· 选择它的原因：卖点1
· 选择它的原因：卖点2
【总结】改变来自理解，目标用户可以更稳健地迈出第一步
#故事向 #真实体验
```

### 增强版生成（个性化）
```
说个真心话，产品名称真的让我印象深刻 😊

最让我心动的几个点：
· 卖点1（这个真的戳中我了）
· 卖点2（完全超出预期）
· 卖点3（细节处理很用心）

我承认我之前也踩过坑，没想到这次效果这么好。

真的值得试试！有问题随时问我！ ✨

#真实感受 #踩坑心得 #个人体验
```

## 💡 使用建议

1. **根据产品选择个性**：教育类选择谨慎理性，生活类选择热情分享
2. **调节情感温度**：年轻受众提高温度，成熟受众降低温度
3. **平衡真实度**：适度的脆弱性增加可信度，但不要过度
4. **测试不同组合**：同一产品尝试不同参数组合，找到最佳效果
5. **保持一致性**：选定风格后，在系列内容中保持参数相对稳定

现在你的小红书文案生成器具备了强大的个性化和情感控制能力，可以生成更加真诚、直接、有温度的高质量文案！
