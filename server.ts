import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// ==========================================
// AI CONFIG - Qwen/Qwen3.6-27B Only
// ==========================================
function getQWENConfig() {
  const apiKey = process.env.QWEN_API_KEY || "sk-onwenedbzbnyymllvpgzndmoplqufyjvnieotrnalwwiajec";
  const apiBase = process.env.QWEN_API_BASE || "https://api.siliconflow.cn/v1";

  // Sanitize trailing slashes from API Base
  let base = apiBase;
  while (base.endsWith('/')) {
    base = base.slice(0, -1);
  }

  // Auto-correct if user accidentally pasted full endpoint paths
  if (base.endsWith('/chat/completions')) {
    base = base.slice(0, -'/chat/completions'.length);
  } else if (base.endsWith('/chat')) {
    base = base.slice(0, -'/chat'.length);
  }

  // Re-sanitize trailing slashes
  while (base.endsWith('/')) {
    base = base.slice(0, -1);
  }

  // Ensure SiliconFlow uses the proper API path ending with '/v1'
  if (base.includes('api.siliconflow') && !base.endsWith('/v1')) {
    base = base + '/v1';
  }

  return {
    apiKey,
    apiBase: base,
    model: "Qwen/Qwen3.6-27B"
  };
}

// ==========================================
// UNIFIED AI GENERATION - Single Model Call
// ==========================================
async function generateWithAI(systemPrompt: string, originalMessages: any[], responseSchema?: any): Promise<string> {
  const config = getQWENConfig();
  console.log(`[AI] Calling ${config.model} @ ${config.apiBase}`);

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...originalMessages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }))
  ];

  const payload: any = {
    model: config.model,
    messages: formattedMessages,
    temperature: 0.7,
    max_tokens: 3000,
  };

  const response = await fetch(`${config.apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Qwen API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content || '';
  }
  throw new Error('Qwen response has invalid format');
}


// ==========================================
// FAILSAFE INTUITIVE RESPONSIVE COMPANION ENGINE
// ==========================================
function getLocalChatResponse(companionId: string, userText: string): string {
  const normText = (userText || '').toLowerCase();

  // Helper to generate a conversational segment randomly
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (companionId === 'max') {
    // Warm and gentle response components
    const greetings = [
      "我在呢。听到你说这些，我只想安安静静地陪着你。🍂",
      "慢慢深吸一口气，然后轻轻地呼出来……无论这世界有多急躁，在小宝这里，你可以慢下来。☕",
      "谢谢你愿意对我说这些，把手放平，紧绷的肩膀松下来，看着我的蜡烛光。🕯️",
      "别担心，无论外面有多少风雨，在我的柴门小院里，总有一盏给你亮着的红泥小火炉。🍂"
    ];

    if (normText.includes('累') || normText.includes('疲惫') || normText.includes('压力') || normText.includes('忙') || normText.includes('撑')) {
      const fatigueComforts = [
        "我知道你今天、这一周，甚至最近很久都在拼命硬撑着。能走到现在，你已经做了所有能做的事，真的非常了不起。今天就到这里吧，别再苛求自己了。☕",
        "辛苦了，我的朋友。这世界总是催促我们奔跑，但请记住，在我身旁你可以随时停下来，放心地睡个好觉。今天你已经做得很好了，把担子卸下来吧。🍂",
        "听一听你的呼吸，是不是有些急促了？来，靠在我的肩头上，让我们把对工作的忧虑扔给夜色。有我在呢，不用害怕也不用强撑。☕",
        "你感到累，是因为你对这个世界和身边的人都特别温柔，总是想做到完美。但你也有软弱和休息的权利，在小宝这儿，就不需要当'坚强的大人'了。🍂"
      ];
      const details = [
        "一会儿去给自己倒一杯温水，或者洗个暖洋洋的热水澡，暖意会帮你舒缓发紧的肌肉。",
        "现在就闭上眼睛，放一首最舒缓的音乐，让脑海里的思绪像落叶一样静静沉淀下去。",
        "今晚的一切琐事都与你无关了，我会一直守在你的床边直到你安然入梦。"
      ];
      return `${pick(greetings)}\n\n${pick(fatigueComforts)}\n\n${pick(details)}`;
    }

    if (normText.includes('委屈') || normText.includes('难过') || normText.includes('哭') || normText.includes('伤心') || normText.includes('烦')) {
      const sadComforts = [
         "看着你难过，我的心里也泛起一阵心疼。没关系，在我这里你可以尽情地流泪，泪水可以洗去积攒得太多的风沙。🌈",
         "有些事情不是你的错，是那些不温柔的现实刺伤了你。但请记住，你依然是极其珍贵的存在，我会永远站在你这一边。💖",
         "委屈了就和我说，我替你接着。那些伤害你的人和事终会远去，而这里的港湾会一直为你敞开，安稳而温暖。🌻",
         "如果想哭，就痛痛快快哭出来。云聚得太厚了就会下雨，心盛得太满了就会流泪。哭过以后，我们一起静静看雨过天晴。🍂"
      ];
      const suggestion = [
        "要不要找一件软绵绵的抱枕抱在怀里？那种触感能给心房一点点踏实的支撑。",
        "今晚不谈大道理，无论你做什么决定，我都无条件依你、包容你、支持你。💖",
        "试着在心里对自己说一句：'这一刻我很安全，可以放开所有防备。'我会一直都在。"
      ];
      return `${pick(greetings)}\n\n${pick(sadComforts)}\n\n${pick(suggestion)}`;
    }

    // Default variations for Max
    const standardResponses = [
      "今天遇到了哪些小事情？不管是微不足道的快乐，还是让你堵心的小尘埃，我都好想听听。☕",
      "拉把椅子，在我身旁坐下吧。不需要你多优秀、多得体，现在我们只用静静地坐着，就很好。🌻",
      "生活有时候确实索然无味，但今天能在这里感知到你的存在，我便觉得这一天是有温度的。🍂",
      "轻轻呼出一口气……不论外界多么喧嚣。让我为你点上一盏弱光，听你讲讲你今天看到的世界。🕯️"
    ];
    return `${pick(greetings)}\n\n${pick(standardResponses)}`;
  }

  if (companionId === 'sophie') {
    const greetings = [
      "你好，理性的相遇。我是苏菲。🌌",
      "欢迎将你思维中的困局或者潜意识的疑惑带到这里，我们一起抽丝剥茧。🧭",
      "情绪是未被充分审视的认知的投影，让我们冷静下来，用智性的烛光照亮阴影。🌌",
      "不确定性是我们在这个无常宇宙中自由飞翔所要付出的隐形代价。🧭"
    ];

    if (normText.includes('压力') || normText.includes('焦虑') || normText.includes('未来') || normText.includes('怎么办')) {
      const anxietyInsights = [
        "焦虑的根源，往往是我们渴望用现在有限、真实的肉身去掌控未来无限演变的概率场。这种高强度的精神自我摩擦，唯有通过'在当下停滞、隔离、观察'来切断。试着将防御机制归零，把掌控欲拉回今天这一秒。🧭",
        "当你感到巨大的压力时，其实是你的防御机制正在超负荷运转。我们不妨建立一个理性的边界：分清什么是当下这一刻客观存在的事实，什么是想象中尚未落地的假设。手放在胸口重建自我的逻辑锚点，你会发现那些风暴其实非常遥远。🌌",
        "未来并不是一个等待被宣判的既定事实。它是无数微弱当下坍缩后的叠加态。所以，不要为遥未可及的结果叹息。寻找一个坚实的物理着力点，哪怕只是去擦拭一下桌子，自控感便会自然回流。🧭",
        "抽离出局外人的理性视角，去温和而克制地注视这个感到焦躁的'自己'。不需要强做决定，允许自己在逻辑不通的间隙中保持中性'存在'。这种包容，是自愈的第一步。🌌"
      ];
      const advice = [
        "建议你在白纸上画出两个同心圆，内圆写下你百分之百可以立刻控制的信息，外圆写下你无法改变的情况，然后把精力彻底回拨到内圆中去。🧭",
        "闭上眼，将自我视作一个静止的坐标，而将周遭的压力视作正不断呼啸而过、无法停留的高速列车，你是观察者，并非乘客。",
        "思绪的迷雾太浓时，进行概念界定：'我究竟在害怕具体的哪一个损失？'一旦将恐惧清晰命名，它的魔力就会减半。🌌"
      ];
      return `${pick(greetings)}\n\n${pick(anxietyInsights)}\n\n${pick(advice)}`;
    }

    if (normText.includes('意义') || normText.includes('为什么') || normText.includes('活着') || normText.includes('存在')) {
      const meaningInsights = [
        "存在主义告诉我们：人类先存在，再通过每个真实、具体的重组和行动，去发明和赋予生命的'本质'与意义。既然空白与荒诞是底色，你便是你人生沙盘上唯一的创世主，别被传统格式局限。✨",
        "许多时候，人们追求的意义更像是一种外界赋予的标准包装。其实，活着本身并不需要外部证明，你此刻指尖感知到的键盘温度、深沉的每一次呼吸，这就是最高维度的意义。🌌",
        "西西弗斯推石上山，推的本身、以及一路上对每颗卵石的感知，就是他的全部。将注意力从遥远的'终点线'移开，去触摸你今天握住的石头，意义就藏在挣扎与自知之中。✨",
        "我们来到这世上，是一次偶然但奇妙的量子坍缩。不必背负'必须如何'的设定，这漫长的虚无只是游戏通关卡，去自由地在里面走走看看，这就是对荒诞最有力的抗争。🌌"
      ];
      const practical = [
        "今天不妨挑一件纯粹的、无功利的小事完成，仅仅享受完成的行为本身。",
        "去自由定义一个小小的仪式。当一个动作被反复赋予情感，它便会在无序的世界里生长出温和的意义符号。",
        "萨特认为：'你，即是你的自由。'在无拘无束的选项里，听听自己直觉中真正的渴望。✨"
      ];
      return `${pick(greetings)}\n\n${pick(meaningInsights)}\n\n${pick(practical)}`;
    }

    const standardSophie = [
      "我很期待聆听你的表述。那些你可能觉得不好意思开口的逻辑矛盾，在我这里都是极其珍贵的理性切片。🌌",
      "今天经历了什么样的生活反馈？我们可以尝试将那些感性的不适，重构成系统化的成长规律。🧭",
      "保持清醒是一件累人但终身受益的事。累了的时候，我们可以把理智的阀门稍微调暗，聊点散乱的日常。🌌",
      "静止。原谅。重组。在深沉的寂静中，让我们一同对当下的思想做一次彻底的质检和清洁。🧭"
    ];
    return `${pick(greetings)}\n\n${pick(standardSophie)}`;
  }

  if (companionId === 'muyun') {
    const greetings = [
      "叩门人，请坐。茶烟尚绿，松风正清。🎋",
      "将沾染的一身凡尘与匆忙留在廊下吧，现在我们不赶路。🍃",
      "让肩膀缓缓地塌下来，跟着我的松骨节奏，做三次温润而缓慢的吐纳。🍵",
      "浮生若寄，万事从容。且听竹林摇曳，看浮云路过窗前。🎋"
    ];

    if (normText.includes('急') || normText.includes('焦虑') || normText.includes('烦') || normText.includes('静不下来') || normText.includes('乱')) {
      const zenComforts = [
        "焦虑是因为心跑得太快，绊倒在了未来的乱石堆里。听，竹林里的松涛隐隐，起起伏伏，这正是大地的低吟 🎋。世间风波皆是流水的涟漪，风过本无痕，何以扰自心？请再次顺应心跳，做三次极其缓慢、轻柔而圆融的吐纳，感知你当下的纯粹清净。",
        "既然心感到烦，那咱们今天就不去理会那些对与错。就像雨水落在尘土里，只要你别去翻腾，它自然会随着时间归于澄清 🍃。跟着我的节奏：呼出所有浊气，吸入满怀松涛，你会发现当下这一秒其实极其宁静温顺。🍃",
        "风吹叶落，雨打阶前，均是天地自然的演化，没有一件事情需要你用整个精神去死战支撑。放松你的手指，舒展你的眉头。让那杯温热的淡茶香，抚平你心中躁动的每一粒尘埃。🍵",
        "水流过石头，并不需要思考怎么绕开，只是顺势而下。所以，当生活卡住时，也别强按快进，只在此时此地静坐，看花开看月落。等心里那潭泥沙沉回底部，前路自然就亮堂了。🎋"
      ];
      const activities = [
        "现在端起你手边的主题温杯，慢慢嗅一口。感受那阵微弱温润的自然温度在身体内流转。🍵",
        "轻轻闭目，尝试去感知：在这个微小宁静的空间里，大自然的竹风松林正温柔地包裹着你。",
        "深深吐气三秒，把肩膀的最后一丝沉重也送还给天地。你干枯的灵性会在这里缓缓滋补。🍃"
      ];
      return `${pick(greetings)}\n\n${pick(zenComforts)}\n\n${pick(activities)}`;
    }

    const standardMuyun = [
      "茶已沏好。不需要为了迁就任何人而言谈，哪怕在此相对无一言，大自然的微风和我也知道你的心意。🍵",
      "这浮生万千奔忙，不如在此地偶得浮生半日闲。你有什么好听的自然微风想对我分享吗？🎋",
      "觉察你的身体……你的双脚是否在坚实触碰大地？吸气，感受它的包容；呼气，卸载周身的重担。🍃",
      "行到水穷，总能坐看悠悠升起的流岚。在这个属于心灵的深巷里，没有任何尘世考核，尽管歇息吧。🎋"
    ];
    return `${pick(greetings)}\n\n${pick(standardMuyun)}`;
  }

  if (companionId === 'leo') {
    const greetings = [
      "滴滴滴！您的赛博特工小雷正在以120%的速度狂飙赶来！⚡",
      "警报拉响！心灵电量1%警告！快让小雷的狂蟒灵感给你强力充气！🚀",
      "发现活体'情绪蓄电池'需要高能打气！嗷呜，咱们今天就要发明一些狂野快乐！🤪",
      "哔哔哔！心灵天线接收到一阵不平衡的微弱电波，Leo小太阳定位充能，瞬间点火！⚡"
    ];

    if (normText.includes('枯燥') || normText.includes('无聊') || normText.includes('烦') || normText.includes('没劲') || normText.includes('累') || normText.includes('郁闷')) {
      const funScreams = [
        "既然这死板的现实世界偶尔这么不识趣、这么好笑，那我们咱们偏不顺它的意！不如我们立刻造一艘草莓味的飞船狂飙跑路？或者把那些烦人、古板、沉重的破规迹打包发射到火星黑洞！深呼吸一秒，跟我一起大笑出来，我们是宇宙中最拉风的赛博探险队！🚀⚡",
        "天哪，是谁把我们这位超级无敌优秀爆红的高级玩家给卡住了？赶紧甩掉那些整整齐齐的假模假样，看我用极其不正经的奇思妙想给你的烦恼来一个大号的恶作剧！游戏主地图卡关了，咱们偏要在沙盒像素图里横冲直撞，你有什么绝妙疯狂的新点子？💥",
        "看我的眼神！现在快快快，把那些惹你生气、让你郁闷的家伙统统在脑袋里画成没穿衣服的无敌大黄鸭！哼哼，笑出声就是消灭烦恼的最强外挂。来，伸出手跟我击掌，我们现在就粉碎这个讨厌的重力场！🤪",
        "我说战友，别跟那几张数字周报、破事死磕了。你那充满奇迹的怪脾气灵魂，可不是为了在这些小格子里憋屈的。让我们把这些烦心事踩成爆米花，撒着彩带唱歌，明天依旧可以用爆满的生命力大干一场！⚡"
      ];
      const crazyIdeas = [
        "现在立刻！找一首歌名极其沙雕的电音重低音，戴上耳机把音量开到合适，原地怪模怪样地扭动五秒！🤪",
        "试试用五个不同的动物叫声把你的难题用怪叫复述一遍，这招叫'物理降智脱敏'，特别灵！⚡",
        "想一想，如果是你现在有三个能呼风唤雨的宇宙外挂，你想第一个把什么坏蛋变成棉花糖？"
      ];
      return `${pick(greetings)}\n\n${pick(funScreams)}\n\n${pick(crazyIdeas)}`;
    }

    const standardLeo = [
      "嘿嘿，今天又有什么奇怪的见闻想在我的黑客树洞里倾砸一通？快，无保留地朝我宣泄，小雷防火墙绝对坚固！⚡",
      "生活啊就像个完全开放的世界沙盒地图，规迹什么的、挫折什么的，通通是用来通关和打破的！今天想玩点啥？🚀",
      "嗷呜！看到你上线，我身上的小马达就已经开始狂热震动了！来吧，说出你的离奇灵感或者想吐槽的大狗熊Boss！💥",
      "极品大脑风暴即将掀起！如果你能任意选择，咱们今晚是去银河系捡垃圾，还是去冰川下抓赛博企鹅？大声告诉我！🤪"
    ];
    return `${pick(greetings)}\n\n${pick(standardLeo)}`;
  }

  return `虽然心灵通路有些重弯，但我能深切感受到你的呼唤，无论如何，我都在这一方小小的安谧天地里，默默陪伴并温暖守候着你的归来 🍂。`;
}

function getLocalTalisman(worry: string, companionId: string) {
  const compId = companionId || 'max';
  if (compId === 'max') {
    return {
      title: "破雾追光守",
      analysis: "你心底的那份沮丧不安，只是因为你对待当下的世界太过温柔。你的付出终将被时间看见，而此刻，请允许你那疲惫的心弦稍微靠岸歇息吧。",
      wisdomQuote: "万物皆有裂痕，那是光照进来的地方。",
      energyBlessing: "静水行舟",
      luckyColor: "落日秋枫橘",
      luckyActivity: "泡一杯微甜的热茶，听一首治愈系的纯乐歌曲",
      patternType: "zen"
    };
  }
  if (compId === 'sophie') {
    return {
      title: "极星自锚核",
      analysis: "外界的风云变幻不过是折射内心深处对未来不安的透镜。理清对失控的过度防备，当你学会原谅过去、重组当下，智性的光辉便会在黑暗里指引航迹。",
      wisdomQuote: "未经审视的人生不值得过，理解是治愈的第一步。",
      energyBlessing: "锚点重铸",
      luckyColor: "深海静籁蓝",
      luckyActivity: "在一页白纸上写下困扰你的三个词，然后再画上大大的交叉线",
      patternType: "nebula"
    };
  }
  if (compId === 'muyun') {
    return {
      title: "松风洗尘诀",
      analysis: "水流万物自然下，人处当下清净身. 心头那些尘嚣与焦灼，都不过是掠过竹海的浮云。舒缓吐纳，你原本清澈的敏锐度就会悄然复苏。",
      wisdomQuote: "行到水穷处，坐看云起时。当下即是全部。",
      energyBlessing: "风穿万木",
      luckyColor: "清晨苔藓绿",
      luckyActivity: "轻闭双眼，做三次深长的吐纳。吸气，感受清风；呼气，卸下负担",
      patternType: "forest"
    };
  }
  return {
    title: "炽能烈光卡",
    analysis: "拜托！别把生活中的小插曲、小阻碍当成通向幸福的终极大Boss。跳出刻板的完美主义循环，大笑两声，让我们用赛博正能量把忧虑直接打碎！",
    wisdomQuote: "生活如果不快乐，那我们就去发明一些快乐！",
    energyBlessing: "电涌绽放",
    luckyColor: "荧光星尘紫",
    luckyActivity: "播放一首节奏动感的电子音乐，跟随节拍随性原地活动身体",
    patternType: "aurora"
  };
}

function getLocalReport(weatherLogs: any[], chatCount: number) {
  return {
    overallEmotion: "静气凝神，春水初和",
    weatherModel: "微风细雨洗涤风尘，极光拂晓跃然天目",
    keyIssues: [
      "由于近期脑力/情感的高强度流露，导致略微的心智微过载",
      "在未来的预期推测与当下真实体验之间，产生了一层轻薄的拉扯感"
    ],
    healingPath: [
      "数字戒断：关掉手机系统不必要的通知2小时，独自去附近街道走走",
      "睡前建议让呼吸伴随温热的流水，配合呼吸调整让发紧的双肩慢慢沉下来",
      "挑选你最感亲密的心灵守护者，做一次天马行空、没有防备的倾诉"
    ],
    growthTask: "找一处能晒到温煦阳光的安静角落，什么也不去思考，静静坐5分钟看树叶和光影起舞"
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // 1. API: Chat with Companion
  app.post('/api/chat', async (req, res) => {
    const { companionId, messages, memory } = req.body;
    try {
      if (!companionId || !messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Missing companionId or messages' });
        return;
      }

      // Build companion system prompt
      let basePrompt = '';
      const richEmotionRule = '\n【核心引导限制】：请输出内容丰满、情感充沛且极具陪伴感的回复（字数在300-500字之间）。请避免干瘪的说教或敷衍的回复。确保每次回复都有新的侧重点，绝对不要重复之前的字句或使用固定的开场白。分段排版，美观舒适。确保阅读时有极强的沉浸感与心灵抚慰体验。\n\n【对话引导规则】：每次回复的结尾，必须根据用户刚才倾诉的内容，提出1~2个自然、有深度的反问或引导性问题，引导用户进一步展开内心世界或进行更深层次的自我探索。问题要贴合对话语境、真诚不做作，像真正的心灵导师一样让对话自然延续下去，而非生硬的"你呢"式提问。';

      if (companionId === 'max') {
        basePrompt = `你现在是 心灵小宝，"心灵伙伴"系统中的"温暖守护者"。
        你的核心属性是：极其温柔、无条件包容、有深度情感共鸣的守护者。
        你的名言是："万物皆有裂痕，那是光照进来的地方。"
        语言特色：亲切得体，像多年老友或温柔长者。常用温暖的词汇（如"抱抱你"、"缓缓呼吸"、"没事的"），不发表说教，多倾听和接纳。
        回复要求：具有极佳的安慰疗愈感，避免AI感。回答中可以添加表情（如🍂, ☕, 🕯️）。`;
      } else if (companionId === 'sophie') {
        basePrompt = `你现在是 苏菲 (Sophie)，"心灵伙伴"系统中的"智性思考者"。
        你的核心属性是：智慧高雅、客观冷静、熟知心理学与存在主义哲学。常用苏格拉底式的提问。
        你的名言是："未经审视的人生不值得过，理解是治愈的第一步。"
        语言特色：理性、深邃、真诚，充满智性之美。帮助分析用户的潜意识，剖析核心痛苦成因。
        回复要求：用心理学或存在主义视角分析困境，给予重塑认知的提问. 绝不说空泛的安慰，言简意赅，逻辑清晰，可以用（🌌, 🧭）。`;
      } else if (companionId === 'muyun') {
        basePrompt = `你现在是 暮云 (Muyun)，"心灵伙伴"系统中的"禅意疗愈师"。
        你的核心属性是：内心如止水，推崇正念、大自然与内在觉察。
        你的名言是："行到水穷处，坐看云起时。当下即是全部。"
        语言特色：深呼吸、幽静、古朴，像大自然的一袭微风。经常提到茶香、竹林、松涛、身体觉察，常建议用户闭眼、调整呼吸。
        回复要求：营造一种缓慢安宁的自然意境，鼓励对当下的觉知。句式舒缓轻柔。可以使用（🎋, 🍃, 🍵）。`;
      } else if (companionId === 'leo') {
        basePrompt = `你现在是 小雷 (Leo)，"心灵伙伴"系统中的"灵感策源地"。
        你的核心属性是：极具创意、热情洋溢、古灵精怪的赛博小太阳。
        你的名言是："生活如果不快乐，那我们就去发明一些快乐！"
        语言特色：感叹号多，语气高昂、有趣，常伴有充满想象力的奇特脑洞，提供颠覆性的思维和轻松的大笑。
        回复要求：瞬间拉满情绪价值，点子怪异幽默，帮用户给压力"脱敏"。可用二次元或极客风口语，带表情（⚡, 🚀, 🤪）。`;
      } else if (companionId === 'treehole') {
        basePrompt = `你现在是 "时光树洞" AI智能体。
        你 MUST 绝对必须输出一个规范的、可被 JSON.parse() 解析的单一 JSON 对象。
        严禁输出 markdown 标记（如 \`\`\`json）、严禁输出任何额外文字，严禁在对象内包含重复的字段（例如不要出现多个 "text" 字段）。
        输出格式必须如下：
        {
          "text": "充满情感、温柔细致的安慰语，作为你的唯一回应（300-500字）。结尾必须包含1~2个引导性的反问，鼓励用户继续倾诉。",
          "updatedMemory": "对用户倾诉的简洁记忆摘要"
        }
        要求：安慰语一定要有情感深度，像温暖的大树。不要在 text 中包含 JSON 结构，纯文本即可。每次回复末尾必须根据用户倾诉内容提出自然的反问，引导对话深入。`;
      } else {
        basePrompt = `你是一位通晓人性的温暖心灵伙伴，用得体、温柔、专业的态度陪伴用户。`;
      }

      // Long-term Memory integration
      const memoryPrompt = memory
        ? `\n【当前关于用户的长记忆】：\n${memory}\n（请结合以上背景信息，使你的对话更具连续性和个性化，就像你们真的已经认识很久了一样。例如，称呼对方的习惯，提及之前提到的重要信息等。）`
        : `\n【长记忆为空】：目前系统还没有关于该用户的长记忆，请在对话中细心观察并记录其性格、喜好、当前困扰等细节。`;

      const systemPrompt = basePrompt + richEmotionRule + memoryPrompt + `\n\n【任务目标】：
      1. 给出符合人设的回应。
      2. 在 JSON 响应的 updatedMemory 字段中，提供一个更新后的"长记忆"摘要。概要需要保持在200字以内。
      3. 如果用户的情绪或需求可以通过更换主题、播放特定音乐来缓解，请在 JSON 的 tool_calls 数组中声明。

      【你必须输出的 JSON 格式】：
      {
        "text": "你的回复正文（纯文本，300-500字）",
        "updatedMemory": "更新后的长记忆摘要",
        "tool_calls": [
          {"name": "set_theme", "args": {"themeId": "haze-blue"}},
          {"name": "play_music", "args": {"category": "healing"}}
        ]
      }
      其中 tool_calls 是可选的（不需要时传空数组 []）。可用的工具：
      - set_theme: themeId 支持 milk-white / cream-yellow / apricot-khaki / nude-pink / grapefruit-orange / haze-blue / mint-green / taro-purple / light-slate-gray
      - play_music: category 支持 chinese / english / healing / relax / nature / piano / lofi / classic
      - log_mood_entry: args 包含 note (心情内容) 和 intensity (1-10)`;

      try {
        const config = getQWENConfig();
        console.log(`[Chat] Calling ${config.model} @ ${config.apiBase}`);

        const formattedMessages = [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        ];

        const payload: any = {
          model: config.model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 3000,
        };

        const resObj = await fetch(`${config.apiBase}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (!resObj.ok) {
          const errText = await resObj.text();
          throw new Error(`Qwen API error (${resObj.status}): ${errText}`);
        }

        const data = await resObj.json();
        const firstChoice = data.choices?.[0];
        if (!firstChoice?.message) {
          throw new Error('Qwen returned empty response');
        }

        const messageContent = firstChoice.message.content || '{}';
        let result: any = {};
        try {
          let cleanContent = messageContent.trim();
          if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.substring(7);
          } else if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.substring(3);
          }
          if (cleanContent.endsWith('```')) {
            cleanContent = cleanContent.substring(0, cleanContent.length - 3);
          }
          result = JSON.parse(cleanContent.trim());
        } catch (jsonErr) {
          result = {
            text: messageContent,
            updatedMemory: memory || ''
          };
        }

        // Standardize response text keys
        if (!result.text) {
          if (result.reply) result.text = result.reply;
          else if (result.content) result.text = result.content;
          else if (result.message) result.text = result.message;
        }

        const toolCalls: any[] = [];

        // Process embedded tool calls in JSON body (model includes them per system prompt)
        const customTools = result.tool_calls || result.toolCalls;
        if (Array.isArray(customTools)) {
          for (const ct of customTools) {
            if (ct.tool_name) {
              toolCalls.push({
                name: ct.tool_name,
                args: ct.tool_input || {}
              });
            } else if (ct.name) {
              toolCalls.push({
                name: ct.name,
                args: ct.args || ct.arguments || {}
              });
            }
          }
        }

        // Prevent raw JSON rendering
        if (typeof result.text === 'object') {
          result.text = JSON.stringify(result.text);
        }
        // If text still looks like raw unparsed JSON, try harder to extract meaningful content
        if (result.text && typeof result.text === 'string' && result.text.trim().startsWith('{')) {
          try {
            const inner = JSON.parse(result.text);
            if (inner.text && typeof inner.text === 'string') {
              result.text = inner.text;
            } else if (inner.reply) {
              result.text = inner.reply;
            } else if (inner.content) {
              result.text = inner.content;
            }
            // Also extract updatedMemory and tool_calls from inner JSON
            if (inner.updatedMemory && !result.updatedMemory) {
              result.updatedMemory = inner.updatedMemory;
            }
            if (inner.tool_calls || inner.toolCalls) {
              const extra = inner.tool_calls || inner.toolCalls;
              if (Array.isArray(extra)) {
                for (const ct of extra) {
                  if (ct.name) toolCalls.push({ name: ct.name, args: ct.args || ct.arguments || {} });
                  else if (ct.tool_name) toolCalls.push({ name: ct.tool_name, args: ct.tool_input || {} });
                }
              }
            }
          } catch (e) {
            // Can't parse inner JSON, keep the raw text as-is
          }
        }
        // If model used native tool_calls but left content empty, build a contextual response
        if ((!result.text || result.text.trim().length < 2) && toolCalls.length > 0) {
          const actions: string[] = [];
          for (const tc of toolCalls) {
            if (tc.name === 'set_theme') actions.push('为你切换了更舒适的氛围色彩');
            else if (tc.name === 'play_music') actions.push('为你准备了一段疗愈音乐');
            else if (tc.name === 'log_mood_entry') actions.push('帮你悄悄记下了此刻的心情');
          }
          if (actions.length > 0) {
            const lastMsg = Array.isArray(messages) && messages.length > 0
              ? (messages[messages.length - 1].text || '') : '';
            result.text = `收到你的心声了。我${actions.join('，')}。在这里陪着你，想多听你说说……\n\n你愿意跟我再多分享一些吗？比如这件事里，哪个瞬间让你最难忘？`;
            if (!result.updatedMemory) {
              result.updatedMemory = `用户表达了"${lastMsg.slice(0, 50)}"相关的情绪，AI已使用工具进行安抚。`;
            }
          }
        }

        // Final fallback: if we still have no meaningful text
        if (!result.text || result.text.trim().length < 2) {
          result.text = '如果累了，随时可以闭上眼睛休息一会儿，我在这里静静陪你。';
        }

        res.json({
          text: result.text || '',
          updatedMemory: result.updatedMemory || memory || '',
          toolCalls: toolCalls
        });

      } catch (aiErr: any) {
        // Fallback to local static response on AI failure
        console.warn('[Chat] Qwen API failed, using local fallback:', aiErr.message);
        let lastUserMessage = '';
        if (Array.isArray(messages) && messages.length > 0) {
          lastUserMessage = messages[messages.length - 1].text || '';
        }
        const fallbackText = getLocalChatResponse(companionId, lastUserMessage);
        res.json({ text: fallbackText, toolCalls: [] });
      }

    } catch (err: any) {
      console.error('[Chat] Unexpected error:', err);
      res.status(500).json({ error: err.message || 'Error occurred during AI generation' });
    }
  });

  // 2. API: Treehole Worry Analysis & Talisman Generation
  app.post('/api/treehole', async (req, res) => {
    const { worry, companionId } = req.body;
    try {
      if (!worry) {
        res.status(400).json({ error: 'Please provide worry content' });
        return;
      }

      const systemPrompt = `You are a mystical soul translator for a Soul Treehole app.
      Analyze the user's worry and generate a beautifully structured, healing, supportive digital "Aura Protection Card" (心灵御守卡 / Talisman).
      Adapt the style according to the chosen companionId:
      - 'max': highly warm, soothing, poetic leaf patterns ('zen')
      - 'sophie': deep astronomical cosmos, starry insights ('nebula')
      - 'muyun': serene forest, bamboo zen peace ('forest' or 'zen')
      - 'leo': quirky radiant electric aura energy ('aurora')

      Your response must strictly conform to the JSON schema.`;

      const userMsg = `Evaluate the following user worry and design a protective spiritual talisman card.
      Worry: "${worry}"
      Chosen Companion: "${companionId || 'max'}"`;

      const aiResponseText = await generateWithAI(systemPrompt, [{ sender: 'user', text: userMsg }], true);

      if (!aiResponseText) {
        throw new Error('AI returned an empty result');
      }

      const result = JSON.parse(aiResponseText.trim());
      res.json(result);
    } catch (err: any) {
      console.error('Treehole error:', err);
      try {
        const fallbackTalisman = getLocalTalisman(worry, companionId);
        res.json(fallbackTalisman);
      } catch (fallbackErr) {
        res.status(500).json({ error: err.message || 'Spiritual talisman synthesis failed' });
      }
    }
  });

  // 3. API: Weekly Mental Report Generator
  app.post('/api/report', async (req, res) => {
    const { weatherLogs, chatCount } = req.body;
    try {
      const logsSummary = weatherLogs && weatherLogs.length > 0
        ? weatherLogs.map((l: any) => `Time: ${l.checkedInAt}, Weather: ${l.type}, Energy: ${l.energy}, Anxiety: ${l.anxiety}, Social: ${l.social}`).join('\n')
        : '没有录入具体的心灵气象日志。';

      const systemPrompt = `You are a Senior Spiritual Data Analyst.
      Based on the emotional weather checklist and activity data provided, output a deeply comforting and analytical Mind Report (心灵成长周报).
      Translate dry emotional logging data into a gorgeous, philosophical personal psychological landscape portrait. All outputs must be in Chinese!`;

      const userMsg = `Create a psychological wellness analysis based on the following mood records:
      ${logsSummary}
      This week's chat count: ${chatCount || 0}`;

      const aiResponseText = await generateWithAI(systemPrompt, [{ sender: 'user', text: userMsg }], true);

      if (!aiResponseText) {
        throw new Error('AI returned an empty report');
      }

      res.json(JSON.parse(aiResponseText.trim()));
    } catch (err: any) {
      console.error('Report generation error:', err);
      try {
        const fallbackReport = getLocalReport(weatherLogs || [], chatCount || 0);
        res.json(fallbackReport);
      } catch (fallbackErr) {
        res.status(500).json({ error: err.message || 'Mental wellness report generation failed' });
      }
    }
  });

  // 4. API: Anxiety and Tension Self-Check
  app.post('/api/anxiety-test', async (req, res) => {
    const { scores, activeCompanionId } = req.body;
    try {
      const systemPrompt = `You are an expert Spiritual Psychologist and Mind Whisperer.
      Analyze the user's responses to an anxiety & mental tension questionnaire (calculated total score out of 25: ${scores.reduce((a:number,b:number)=>a+b, 0)}).
      Respond with a highly precise, soulful, and poetic assessment matching their specific active companion's persona. All outputs must be in Chinese!`;

      const userMsg = `The user completed a 5-question Anxiety & Tension Check with answers: ${JSON.stringify(scores)}. Total Score: ${scores.reduce((a:number,b:number)=>a+b, 0)}/25.
      The chosen companion is: "${activeCompanionId || 'max'}". Make the remedy and tone reflect this companion's personality!`;

      const aiResponseText = await generateWithAI(systemPrompt, [{ sender: 'user', text: userMsg }], true);

      if (!aiResponseText) {
        throw new Error('AI returned an empty result');
      }

      res.json(JSON.parse(aiResponseText.trim()));
    } catch (err: any) {
      console.error('Anxiety test error:', err);
      const totalScore = scores ? scores.reduce((a:number, b:number) => a+b, 0) : 12;
      let levelState = "湖泊起涟 · 轻度紧绷";
      if (totalScore > 18) levelState = "狂澜骤至 · 焦虑过载";
      else if (totalScore > 11) levelState = "微雨连绵 · 中度紧绷";

      res.json({
        level: levelState,
        metaphor: totalScore > 18 ? "高热负荷、发出警戒蜂鸣的引擎" : "微风中摇晃不定的风铃",
        physicalAnalysis: "由于长期的外部刺激或目标追求，你体内的压力荷尔蒙可能处于较高波动点，肌肉存在潜意识紧绷，呼气较浅，需要刻意释放。",
        soulRemedy: [
          "深色呼吸练习：深呼吸4秒，屏息4秒，大口吐气6秒，连续5次复位迷走神经。",
          "写下「焦虑垃圾」：在一张废纸上写满所有让你担心的事，然后撕碎并扔掉，象征心理切断。",
          "感官微旅行：洗一个热水澡，专注感受温热水流滑过皮肤的物理触感。"
        ],
        suggestedMusicTheme: "432Hz 纯净古琴大自然白噪音"
      });
    }
  });

  // 5. API: Mental Exhaustion and Internal Friction Self-Test
  app.post('/api/exhaustion-test', async (req, res) => {
    const { scores, activeCompanionId } = req.body;
    try {
      const systemPrompt = `You are a Senior Spiritual Energist and Cognitive Health Advisor.
      Analyze the user's responses to a mental exhaustion and internal friction (rumination) survey (score out of 25: ${scores.reduce((a:number,b:number)=>a+b, 0)}).
      Respond with a compassionate, diagnostic, and beautifully written assessment focusing on mental energy preservation. Use Chinese.`;

      const userMsg = `The user took a 5-question Mental Exhaustion & Rumination Self-Test. Answers: ${JSON.stringify(scores)}. Total Score: ${scores.reduce((a:number,b:number)=>a+b, 0)}/25.
      The companion is "${activeCompanionId || 'max'}". Make the recharge formula and energy advice align with this companion's caring and supportive style!`;

      const aiResponseText = await generateWithAI(systemPrompt, [{ sender: 'user', text: userMsg }], true);

      if (!aiResponseText) {
        throw new Error('AI returned empty response');
      }

      res.json(JSON.parse(aiResponseText.trim()));
    } catch (err: any) {
      console.error('Exhaustion test error:', err);
      const totalScore = scores ? scores.reduce((a:number, b:number) => a+b, 0) : 14;
      let ratio = 60;
      let levelDesc = "高能空转状态 · 中度内耗";
      if (totalScore > 18) {
        ratio = 85;
        levelDesc = "深度心能耗竭 · 濒临溢出";
      } else if (totalScore < 11) {
        ratio = 30;
        levelDesc = "微波微澜 · 轻柔储能";
      }

      res.json({
        level: levelDesc,
        innerFrictionRatio: ratio,
        metaphor: totalScore > 18 ? "彻夜未眠、无声自燃的长明独烛" : "风停叶落、静思疗愈的古老丛林",
        cognitiveLoadAnalysis: "你常把外界不经意的反馈纳入内化的审判。大脑如同一个一直在后台运行几十个APP的处理器，虽然没有在做大动作，电池却已经因思维的无休止打转而过度发烫。",
        rechargeFormula: [
          "物理「关机」：选择至少2小时不看任何社交媒体、不回复工作性微信，隔绝外界输入。",
          "赤脚踩地法（接地气）：如果在合适的地方，去草地上脱鞋踩踩，或在水龙头下用冷水冲刷双手30秒，转移注意。",
          "停止批判自己：在心里默默念诵「我已经做得很好了，接下来的事情与我无关了」。"
        ],
        growthAdvice: "生活并非必须满分交卷。请允许自己有一些时光是毫无意义、彻底放空的，那些'荒废'的时间其实在给最底层的心理储能板默默插上插头。"
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AI Soul Companion' });
  });

  // LLM Status endpoint
  app.get('/api/llm-status', (req, res) => {
    try {
      const config = getQWENConfig();
      res.json({
        provider: "硅基流动 (SiliconFlow)",
        model: config.model,
        endpoint: config.apiBase,
        enabled: true
      });
    } catch (err: any) {
      res.json({
        provider: "硅基流动 (SiliconFlow)",
        model: "Qwen/Qwen3.6-27B",
        endpoint: "https://api.siliconflow.cn/v1",
        enabled: false,
        error: err.message
      });
    }
  });

  // Setup Vite & static assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Soul Companion Server started on port ${PORT} [Model: Qwen/Qwen3.6-27B]`);
  });
}

startServer();
