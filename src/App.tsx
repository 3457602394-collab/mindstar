import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Brain, MessagesSquare, Smile, Moon, 
  RefreshCw, Send, HelpCircle, FileText, ChevronRight, Info,
  Compass, ShieldCheck, Star, Activity, User, BookOpen, Home,
  Music, Pause, Play, Plus, SkipBack, SkipForward
} from 'lucide-react';
import { COMPANIONS } from './utils/companions';
import { CompanionId, Message, SoulCard, MindReport, EmotionalWeather, AnxietyResult, ExhaustionResult } from './types';
import MentalWeather from './components/MentalWeather';

interface HealingTheme {
  id: string;
  name: string;
  desc: string;
  bgClass: string;
  gradientTopLeft: string;
  gradientBottomRight: string;
  gradientCenterLeft: string;
  cardClass: string;
  accentText: string;
  accentBorder: string;
  icon: string;
  isLight?: boolean;
  category: 'warm' | 'cool';
}

const HEALING_THEMES: HealingTheme[] = [
  {
    id: 'milk-white',
    name: '奶白色 / 米白',
    desc: '柔和不刺眼，自带干净松弛感，抚平焦躁',
    bgClass: 'bg-[#f7f5f0]',
    gradientTopLeft: 'from-orange-100/40',
    gradientBottomRight: 'to-stone-200/40',
    gradientCenterLeft: 'via-yellow-105/20',
    cardClass: 'bg-white/80 border-stone-200 shadow-sm text-black',
    accentText: 'text-[#8b7a66]',
    accentBorder: 'border-stone-250',
    icon: '🥛',
    isLight: true,
    category: 'warm'
  },
  {
    id: 'cream-yellow',
    name: '奶油黄 / 鹅黄',
    desc: '像暖阳，轻快温暖，驱散低落情绪',
    bgClass: 'bg-[#fefae8]',
    gradientTopLeft: 'from-yellow-200/40',
    gradientBottomRight: 'to-amber-100/40',
    gradientCenterLeft: 'via-yellow-105/30',
    cardClass: 'bg-white/80 border-amber-150 shadow-sm text-black',
    accentText: 'text-[#ab7e1b]',
    accentBorder: 'border-amber-200/50',
    icon: '🍯',
    isLight: true,
    category: 'warm'
  },
  {
    id: 'apricot-khaki',
    name: '浅杏色 / 卡其',
    desc: '质朴柔和，营造慵懒居家的舒适感',
    bgClass: 'bg-[#f4efe3]',
    gradientTopLeft: 'from-orange-100/45 border-orange-200/20',
    gradientBottomRight: 'to-stone-300/45',
    gradientCenterLeft: 'via-amber-100/25',
    cardClass: 'bg-white/80 border-stone-300 shadow-sm text-black',
    accentText: 'text-[#7c5b3e]',
    accentBorder: 'border-stone-200',
    icon: '🥖',
    isLight: true,
    category: 'warm'
  },
  {
    id: 'nude-pink',
    name: '裸粉色 / 豆沙粉',
    desc: '温柔甜美，柔和不甜腻，舒缓心情',
    bgClass: 'bg-[#faf0f2]',
    gradientTopLeft: 'from-pink-100/50',
    gradientBottomRight: 'to-rose-100/40',
    gradientCenterLeft: 'via-orange-50/25',
    cardClass: 'bg-white/85 border-pink-100 shadow-sm text-black',
    accentText: 'text-rose-600',
    accentBorder: 'border-pink-200/40',
    icon: '🌸',
    isLight: true,
    category: 'warm'
  },
  {
    id: 'grapefruit-orange',
    name: '浅橘 / 蜜柚色',
    desc: '暖而不艳，元气又温柔，氛围感拉满',
    bgClass: 'bg-[#fdf3ec]',
    gradientTopLeft: 'from-orange-100/55',
    gradientBottomRight: 'to-amber-100/40',
    gradientCenterLeft: 'via-pink-100/20',
    cardClass: 'bg-white/85 border-orange-100 shadow-sm text-black',
    accentText: 'text-orange-600',
    accentBorder: 'border-orange-200/40',
    icon: '🍊',
    isLight: true,
    category: 'warm'
  },
  {
    id: 'haze-blue',
    name: '雾霾蓝 / 浅天蓝',
    desc: '像晴空湖水，沉静舒缓，缓解压力',
    bgClass: 'bg-[#ebf3f7]',
    gradientTopLeft: 'from-blue-100/40',
    gradientBottomRight: 'to-cyan-100/40',
    gradientCenterLeft: 'via-sky-100/20',
    cardClass: 'bg-white/80 border-blue-200 shadow-sm text-black',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-200/50',
    icon: '☁️',
    isLight: true,
    category: 'cool'
  },
  {
    id: 'mint-green',
    name: '薄荷绿 / 豆绿',
    desc: '清新自然，自带清新感，抚平烦躁',
    bgClass: 'bg-[#ecf7f1]',
    gradientTopLeft: 'from-emerald-100/40',
    gradientBottomRight: 'to-teal-100/40',
    gradientCenterLeft: 'via-green-100/20',
    cardClass: 'bg-white/80 border-emerald-200 shadow-sm text-black',
    accentText: 'text-[#065f46]',
    accentBorder: 'border-emerald-250',
    icon: '🌿',
    isLight: true,
    category: 'cool'
  },
  {
    id: 'taro-purple',
    name: '芋泥紫 / 淡香芋紫',
    desc: '软糯温柔，梦幻又平和，安抚情绪',
    bgClass: 'bg-[#f4eff9]',
    gradientTopLeft: 'from-purple-100/40',
    gradientBottomRight: 'to-fuchsia-100/40',
    gradientCenterLeft: 'via-indigo-100/20',
    cardClass: 'bg-white/80 border-purple-200 shadow-sm text-black',
    accentText: 'text-[#6b21a8]',
    accentBorder: 'border-purple-250',
    icon: '🍇',
    isLight: true,
    category: 'cool'
  },
  {
    id: 'light-slate-gray',
    name: '浅青灰',
    desc: '低饱和高级，静谧安稳，让人内心沉静',
    bgClass: 'bg-[#eef1f2]',
    gradientTopLeft: 'from-slate-100/40',
    gradientBottomRight: 'to-zinc-200/40',
    gradientCenterLeft: 'via-blue-50/20',
    cardClass: 'bg-[#fafafc]/80 border-slate-200 shadow-sm text-black',
    accentText: 'text-[#334155]',
    accentBorder: 'border-slate-250',
    icon: '🫧',
    isLight: true,
    category: 'cool'
  }
];

interface MoodRecord {
  id: string;
  timestamp: string;
  companionName: string;
  userQuery: string;
  aiAnalysis: string;
  moodTag?: string;
}

type MusicCategory = 'healing' | 'relax' | 'nature' | 'chinese' | 'english' | 'piano' | 'lofi' | 'classic';

export default function App() {
  // Core user state
  const [activeCompanionId, setActiveCompanionId] = useState<CompanionId>('max');
  const [activeTab, setActiveTab] = useState<'home' | 'soul' | 'chat' | 'records'>('home');
  
  // Mood Records state
  const [moodRecords, setMoodRecords] = useState<MoodRecord[]>([]);
  
  // Chat thread states for each partner
  const [chats, setChats] = useState<Record<CompanionId, Message[]>>({
    max: [],
    sophie: [],
    muyun: [],
    leo: []
  });
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mindful coaching states
  const [isAmbientSparkleActive, setIsAmbientSparkleActive] = useState<boolean>(true);

  // Daily Soul Notes state
  const SOUL_NOTES = [
    "今天的你已经很努力了，先休息一下吧。",
    "慢慢来，比较快。",
    "你值得拥有一切美好的事物。",
    "给自己一点时间，去发呆，去流浪。",
    "世界很喧嚣，但你可以在内心修篱种菊。",
    "每朵花都有自己的花期，你也一样。",
    "不完美的你，才是最真实的你。",
    "把心情寄托在微风里，带走所有的烦恼。",
    "所有的失去，都会以另一种方式回来。",
    "光终会照进你的生活。"
  ];

  const [memories, setMemories] = useState<Record<CompanionId, string>>({
    max: '',
    sophie: '',
    muyun: '',
    leo: ''
  });

  const [displayedNotes, setDisplayedNotes] = useState<string[]>([]);
  
  const refreshSoulNotes = () => {
    const shuffled = [...SOUL_NOTES].sort(() => 0.5 - Math.random());
    setDisplayedNotes(shuffled.slice(0, 4));
  };

  // Soul Mindfulness & Agent Exploration states
  const [weatherUpdateTrigger, setWeatherUpdateTrigger] = useState<number>(0);
  const [mindReport, setMindReport] = useState<MindReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [talismanWorry, setTalismanWorry] = useState<string>('');
  const [activeTalisman, setActiveTalisman] = useState<SoulCard | null>(null);
  const [isGeneratingTalisman, setIsGeneratingTalisman] = useState<boolean>(false);
  const [savedTalismans, setSavedTalismans] = useState<SoulCard[]>([]);
  const [soulSpaceTab, setSoulSpaceTab] = useState<'weather' | 'talisman' | 'anxiety' | 'exhaustion'>('weather');
  const [treeHoleMessages, setTreeHoleMessages] = useState<Message[]>([]);
  const [newTreeHoleInput, setNewTreeHoleInput] = useState<string>('');
  const [isTreeHoleTyping, setIsTreeHoleTyping] = useState<boolean>(false);

  // Anxiety Self-Check states
  const [anxietyAnswers, setAnxietyAnswers] = useState<number[]>([3, 3, 3, 3, 3]);
  const [anxietyResult, setAnxietyResult] = useState<AnxietyResult | null>(null);
  const [isTestingAnxiety, setIsTestingAnxiety] = useState<boolean>(false);

  // Exhaustion Self-Test states
  const [exhaustionAnswers, setExhaustionAnswers] = useState<number[]>([3, 3, 3, 3, 3]);
  const [exhaustionResult, setExhaustionResult] = useState<ExhaustionResult | null>(null);
  const [isTestingExhaustion, setIsTestingExhaustion] = useState<boolean>(false);

  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [newRecordQuery, setNewRecordQuery] = useState<string>('');
  const [newRecordAnalysis, setNewRecordAnalysis] = useState<string>('');

  // Reset thread history
  const handleResetThread = () => {
    const updated = {
      ...chats,
      [activeCompanionId]: []
    };
    saveChatsToStorage(updated);
    setIsConfirmingReset(false);
  };
  
  const handleTreeHoleChat = async (text: string) => {
    if (!text.trim() || isTreeHoleTyping) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    const newThread = [...treeHoleMessages, userMessage];
    setTreeHoleMessages(newThread);
    setIsTreeHoleTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionId: 'treehole',
          messages: newThread.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
          memory: memories['max'] // reuse max's memory or maybe create a new one? Let's reuse for now
        })
      });

      const data = await res.json();
      let botText = data.text || '';
      
      // Defensive fix: If the response is a JSON string, try to parse it
      if (typeof botText === 'string' && botText.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(botText);
          if (typeof parsed === 'object') {
            const values = Object.values(parsed);
            if (values.length > 0) botText = String(values[0]);
          }
        } catch (e) {
          // Not valid JSON, keep original
        }
      }

      if (res.ok && botText) {
        const botMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'companion',
          text: botText,
          timestamp: new Date().toISOString()
        };
        setTreeHoleMessages([...newThread, botMessage]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTreeHoleTyping(false);
    }
  };
  const HEALING_SONGS: Record<MusicCategory, { id: string, title: string, artist: string, duration: string, icon: string }[]> = {
    healing: [
      { id: 'h1', title: '万物安生时', artist: '李荣浩', duration: '04:12', icon: '🍃' },
      { id: 'h2', title: '给你一瓶魔法药水', artist: '告五人', duration: '04:20', icon: '🪄' },
      { id: 'h3', title: '唯一', artist: '告五人', duration: '03:45', icon: '💍' },
      { id: 'h4', title: '小城夏天', artist: 'Li-2C', duration: '04:30', icon: '🍦' },
      { id: 'h5', title: '悬溺', artist: '葛东琪', duration: '03:52', icon: '🌊' },
    ],
    relax: [
      { id: 'r1', title: 'vampire', artist: 'Olivia Rodrigo', duration: '03:39', icon: '🧛' },
      { id: 'r2', title: 'bad guy', artist: 'Billie Eilish', duration: '03:14', icon: '👽' },
      { id: 'r3', title: 'Stay', artist: 'Justin Bieber', duration: '02:21', icon: '🏠' },
      { id: 'r4', title: 'Peaches', artist: 'Justin Bieber', duration: '03:18', icon: '🍑' },
      { id: 'r5', title: 'Levitating', artist: 'Dua Lipa', duration: '03:23', icon: '🌌' },
    ],
    nature: [
      { id: 'n1', title: '雨夜冥想', artist: '自然音频', duration: '05:30', icon: '🌧️' },
      { id: 'n2', title: '高山流水', artist: '禅意社', duration: '06:15', icon: '⛰️' },
      { id: 'n3', title: '林间鸟语', artist: '森系音效', duration: '04:00', icon: '🐦' },
      { id: 'n4', title: '夏夜蝉鸣', artist: '自然记录者', duration: '03:45', icon: '🦗' },
      { id: 'n5', title: '冬日壁炉', artist: '白噪音', duration: '10:00', icon: '🔥' },
    ],
    chinese: [
      { id: 'c1', title: '笼', artist: '张碧晨', duration: '04:12', icon: '🎭' },
      { id: 'c2', title: '乌梅子酱', artist: '李荣浩', duration: '03:45', icon: '🍯' },
      { id: 'c3', title: '向云端', artist: '小霞/海洋', duration: '04:20', icon: '☁️' },
      { id: 'c4', title: '如愿', artist: '王菲', duration: '04:30', icon: '🌸' },
      { id: 'c5', title: '关键词', artist: '林俊杰', duration: '03:52', icon: '🔑' },
      { id: 'c6', title: '晴天', artist: '周杰伦', duration: '04:29', icon: '☀️' },
      { id: 'c7', title: '后来', artist: '刘若英', duration: '05:41', icon: '🚉' },
      { id: 'c8', title: '想见你', artist: '八三夭', duration: '04:00', icon: '🕰️' },
      { id: 'c9', title: '七里香', artist: '周杰伦', duration: '04:59', icon: '🌻' },
      { id: 'c10', title: '小幸运', artist: '田馥甄', duration: '04:25', icon: '🍀' },
      { id: 'c11', title: '告白气球', artist: '周杰伦', duration: '03:35', icon: '🎈' },
      { id: 'c12', title: '平凡之路', artist: '朴树', duration: '05:01', icon: '🛣️' },
      { id: 'c13', title: '交换余生', artist: '林俊杰', duration: '04:35', icon: '⌛' },
      { id: 'c14', title: '如果可以', artist: '韦礼安', duration: '04:32', icon: '✨' },
      { id: 'c15', title: '想去海边', artist: '夏日入侵企画', duration: '03:55', icon: '🌊' },
    ],
    english: [
      { id: 'e1', title: 'Flowers', artist: 'Miley Cyrus', duration: '03:20', icon: '💐' },
      { id: 'e2', title: 'Cruel Summer', artist: 'Taylor Swift', duration: '02:58', icon: '☀️' },
      { id: 'e3', title: 'Seven', artist: 'Jung Kook', duration: '03:04', icon: '🍀' },
      { id: 'e4', title: 'Vampire', artist: 'Olivia Rodrigo', duration: '03:39', icon: '🧛' },
      { id: 'e5', title: 'Golden Hour', artist: 'JVKE', duration: '03:29', icon: '🌄' },
      { id: 'e6', title: 'As It Was', artist: 'Harry Styles', duration: '02:47', icon: '☎️' },
      { id: 'e7', title: 'Anti-Hero', artist: 'Taylor Swift', duration: '03:20', icon: '👻' },
      { id: 'e8', title: 'Kill Bill', artist: 'SZA', duration: '02:33', icon: '🗡️' },
      { id: 'e9', title: 'Die For You', artist: 'The Weeknd', duration: '03:52', icon: '🕯️' },
      { id: 'e10', title: 'Lover', artist: 'Taylor Swift', duration: '03:41', icon: '💗' },
      { id: 'e11', title: 'Stay', artist: 'The Kid LAROI', duration: '02:21', icon: '🏠' },
      { id: 'e12', title: 'Shape of You', artist: 'Ed Sheeran', duration: '03:53', icon: '💠' },
      { id: 'e13', title: 'Espresso', artist: 'Sabrina Carpenter', duration: '02:52', icon: '☕' },
      { id: 'e14', title: 'Cruel Summer', artist: 'Taylor Swift', duration: '02:58', icon: '💅' },
      { id: 'e15', title: 'Bad Habit', artist: 'Steve Lacy', duration: '03:52', icon: '🎸' },
    ],
    piano: [
      { id: 'p1', title: '天空之城', artist: '久石让', duration: '04:15', icon: '🏰' },
      { id: 'p2', title: '梦中的婚礼', artist: '理查德·克莱德曼', duration: '02:42', icon: '👰' },
      { id: 'p3', title: '雨的印记', artist: '李闰珉', duration: '03:50', icon: '☔' },
      { id: 'p4', title: '致爱丽丝', artist: '贝多芬', duration: '02:27', icon: '🌹' },
      { id: 'p5', title: '月光曲', artist: '贝多芬', duration: '06:30', icon: '🎹' },
      { id: 'p6', title: 'River Flows In You', artist: 'Yiruma', duration: '03:05', icon: '🌊' },
      { id: 'p7', title: 'I Giorni', artist: 'Ludovico Einaudi', duration: '05:50', icon: '📖' },
    ],
    lofi: [
      { id: 'l1', title: 'Study Session', artist: 'Lofi Girl', duration: '03:45', icon: '📖' },
      { id: 'l2', title: 'Rainy Night', artist: 'Chill Beats', duration: '04:20', icon: '☕' },
      { id: 'l3', title: 'Morning Coffee', artist: 'Sleepy Fish', duration: '03:10', icon: '🥐' },
      { id: 'l4', title: 'Sunset Glow', artist: 'Lofi Records', duration: '02:55', icon: '🌇' },
      { id: 'l5', title: 'Midnight City', artist: 'M83', duration: '04:03', icon: '🌃' },
    ],
    classic: [
      { id: 'cl1', title: 'G弦上的咏叹调', artist: '巴赫', duration: '05:20', icon: '🎻' },
      { id: 'cl2', title: '四季·春', artist: '维瓦尔第', duration: '03:40', icon: '🌱' },
      { id: 'cl3', title: '卡农', artist: '帕海贝尔', duration: '05:00', icon: '🕊️' },
      { id: 'cl4', title: '天鹅湖', artist: '柴夫斯基', duration: '03:30', icon: '🦢' },
      { id: 'cl5', title: '蓝色多瑙河', artist: '施特劳斯', duration: '09:25', icon: '🌊' },
    ]
  };

  const MUSIC_PLAYLISTS: { id: MusicCategory, title: string, desc: string, icon: string }[] = [
    { id: 'chinese', title: '华语流行', desc: '当下热门的华语金曲', icon: '🎐' },
    { id: 'english', title: '欧美流行', desc: '榜单前沿的英文旋律', icon: '🎸' },
    { id: 'healing', title: '治愈经典', desc: '温暖心灵的动人时刻', icon: '🧘' },
    { id: 'relax', title: '轻松时刻', desc: '适合发呆和休憩', icon: '🍵' },
    { id: 'nature', title: '自然音场', desc: '沉浸式的自然白噪音', icon: '🌲' },
    { id: 'piano', title: '纯净钢琴', desc: '优雅纯净的琴键旋律', icon: '🎹' },
    { id: 'lofi', title: '专注节拍', desc: '律动节拍，舒缓压力', icon: '🎧' },
    { id: 'classic', title: '古典音乐', desc: '大师们的隽永之作', icon: '🏛️' },
  ];
  
  const [activeCategory, setActiveCategory] = useState<MusicCategory>('healing');
  const [showPlaylistLibrary, setShowPlaylistLibrary] = useState<boolean>(false);
  const [showAllInActiveCategory, setShowAllInActiveCategory] = useState<boolean>(false);
  const [currentSongId, setCurrentSongId] = useState<string>('h1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initial notes setup
  useEffect(() => {
    refreshSoulNotes();
  }, []);

  // Dynamic healing theme switcher state
  const [activeThemeId, setActiveThemeId] = useState<string>('milk-white');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const [selectedThemeCategory, setSelectedThemeCategory] = useState<'warm' | 'cool' | null>(null);

  // LLM Status state to check active model backends accurately
  interface LLMStatus {
    provider: string;
    model: string;
    endpoint: string;
    enabled: boolean;
    hasGemini: boolean;
    hasSiliconFlow: boolean;
    hasQwen: boolean;
  }
  const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
  const [isLlmStatusModalOpen, setIsLlmStatusModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchLLMStatus = async () => {
      try {
        const res = await fetch('/api/llm-status');
        if (res.ok) {
          const data = await res.json();
          setLlmStatus(data);
        }
      } catch (err) {
        console.warn("Failed to fetch LLM Status", err);
      }
    };
    fetchLLMStatus();
  }, []);

  const currentTheme = HEALING_THEMES.find(t => t.id === activeThemeId) || HEALING_THEMES[0];

  const isLight = currentTheme.isLight || false;
  const textColor = 'text-black';
  const cardClass = isLight 
    ? 'bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-sm text-black' 
    : 'bg-white/[0.02] backdrop-blur-2xl border border-white/5 shadow-xl text-black';



  // Load chats and stats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('soul_companion_chats');
    if (savedChats) {
      try {
        setChats(JSON.parse(savedChats));
      } catch (e) {
        console.error('Error loading chats:', e);
      }
    }

    const savedTheme = localStorage.getItem('soul_companion_active_theme');
    if (savedTheme && HEALING_THEMES.some(t => t.id === savedTheme)) {
      setActiveThemeId(savedTheme);
    }

    const savedMemories = localStorage.getItem('soul_companion_memories');
    if (savedMemories) {
      try {
        setMemories(JSON.parse(savedMemories));
      } catch (e) {
        console.error('Error loading memories:', e);
      }
    }

    const savedRecords = localStorage.getItem('soul_companion_mood_records');
    if (savedRecords) {
      try {
        setMoodRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error('Error loading mood records:', e);
      }
    }

    const savedReport = localStorage.getItem('soul_companion_mind_report');
    if (savedReport) {
      try {
        setMindReport(JSON.parse(savedReport));
      } catch (e) {
        console.error('Error loading mind report:', e);
      }
    }

    const savedTalismanList = localStorage.getItem('soul_companion_talismans');
    if (savedTalismanList) {
      try {
        setSavedTalismans(JSON.parse(savedTalismanList));
      } catch (e) {
        console.error('Error loading talismans:', e);
      }
    }
  }, []);

  const handleAddManualRecord = () => {
    if (!newRecordQuery.trim()) return;

    const manualRecord: MoodRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      companionName: '自我对话',
      userQuery: newRecordQuery,
      aiAnalysis: newRecordAnalysis || '在这个瞬间，我选择记录下这份心情。'
    };

    saveRecordsToStorage([...moodRecords, manualRecord]);
    setNewRecordQuery('');
    setNewRecordAnalysis('');
    setIsAddingRecord(false);
  };

  // Sync records to storage
  const saveRecordsToStorage = (newRecords: MoodRecord[]) => {
    setMoodRecords(newRecords);
    localStorage.setItem('soul_companion_mood_records', JSON.stringify(newRecords));
  };

  // Sync chats inside state with localStorage
  const saveChatsToStorage = (updatedChats: Record<CompanionId, Message[]>) => {
    setChats(updatedChats);
    localStorage.setItem('soul_companion_chats', JSON.stringify(updatedChats));
  };

  const saveMemoriesToStorage = (updatedMemories: Record<CompanionId, string>) => {
    setMemories(updatedMemories);
    localStorage.setItem('soul_companion_memories', JSON.stringify(updatedMemories));
  };

  // Scroll chat to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeCompanionId]);

  // Partner metadata
  const partner = COMPANIONS.find(c => c.id === activeCompanionId) || COMPANIONS[0];
  const currentChatHistory = chats[activeCompanionId] || [];

  const handleGenerateMindReport = async () => {
    setIsGeneratingReport(true);
    try {
      const weatherSaved = localStorage.getItem('soul_companion_weather_logs');
      let logs = [];
      if (weatherSaved) {
        logs = JSON.parse(weatherSaved);
      }
      
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weatherLogs: logs,
          chatCount: currentChatHistory.length
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reportData = {
          ...data,
          reportDate: new Date().toLocaleDateString()
        };
        setMindReport(reportData);
        localStorage.setItem('soul_companion_mind_report', JSON.stringify(reportData));
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (e) {
      console.error(e);
      // fallback
      const fallbackReport = {
        overallEmotion: "静气凝神，微澜渐平",
        weatherModel: "微风细雨洗涤风尘，极光拂晓跃然天目",
        keyIssues: [
          "近期处于高强度的脑力与情感投入状态，产生了些许心智过载",
          "外界期待与当下自我疗愈节奏之间，产生了短暂的拉扯感"
        ],
        healingPath: [
          "实行数字戒断：睡前关闭手机系统提醒，静静发呆15分钟",
          "倾诉释怀：向您信任的心灵伙伴做一次没有任何防备的深入交流"
        ],
        growthTask: "找一处有阳光的地方，闭眼，感受风和叶起舞的旋律，放空自己5分钟",
        reportDate: new Date().toLocaleDateString()
      };
      setMindReport(fallbackReport as any);
      localStorage.setItem('soul_companion_mind_report', JSON.stringify(fallbackReport));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleGenerateTalisman = async () => {
    if (!talismanWorry.trim() || isGeneratingTalisman) return;
    setIsGeneratingTalisman(true);
    try {
      const response = await fetch('/api/treehole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          worry: talismanWorry.trim(),
          companionId: activeCompanionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newTalisman: SoulCard = {
          id: Math.random().toString(36).substr(2, 9),
          worry: talismanWorry.trim(),
          title: data.title,
          analysis: data.analysis,
          wisdomQuote: data.wisdomQuote,
          energyBlessing: data.energyBlessing,
          luckyColor: data.luckyColor,
          luckyActivity: data.luckyActivity,
          patternType: data.patternType || 'zen',
          companionName: partner.name,
          companionId: activeCompanionId,
          timestamp: new Date().toISOString()
        };

        const updatedList = [newTalisman, ...savedTalismans];
        setSavedTalismans(updatedList);
        localStorage.setItem('soul_companion_talismans', JSON.stringify(updatedList));
        setActiveTalisman(newTalisman);
        setTalismanWorry('');
      } else {
        throw new Error('Failed to generate talisman');
      }
    } catch (e) {
      console.error(e);
      // fallback
      const mockTalisman: SoulCard = {
        id: Math.random().toString(36).substr(2, 9),
        worry: talismanWorry.trim(),
        title: activeCompanionId === 'max' ? "破雾追光守" : activeCompanionId === 'sophie' ? "极星自锚核" : activeCompanionId === 'muyun' ? "松风洗尘诀" : "炽能烈光卡",
        analysis: "外界喧嚣并不影响你内心的坚定。当你有勇气面对困局并试图寻求安宁，治愈的奇迹就已经在发生。",
        wisdomQuote: "万物皆有裂痕，那是光照进来的地方。",
        energyBlessing: activeCompanionId === 'max' ? "静水行舟" : activeCompanionId === 'sophie' ? "锚点重铸" : activeCompanionId === 'muyun' ? "风穿万木" : "电涌绽放",
        luckyColor: activeCompanionId === 'max' ? "落日秋枫橘" : activeCompanionId === 'sophie' ? "深海静籁蓝" : activeCompanionId === 'muyun' ? "清晨苔藓绿" : "荧光星尘紫",
        luckyActivity: "给自已一个长达15秒的双臂环抱，闭目深呼吸，跟自我和解",
        patternType: activeCompanionId === 'max' ? 'zen' : activeCompanionId === 'sophie' ? 'nebula' : activeCompanionId === 'muyun' ? 'forest' : 'aurora',
        companionName: partner.name,
        companionId: activeCompanionId,
        timestamp: new Date().toISOString()
      };
      const updatedList = [mockTalisman, ...savedTalismans];
      setSavedTalismans(updatedList);
      localStorage.setItem('soul_companion_talismans', JSON.stringify(updatedList));
      setActiveTalisman(mockTalisman);
      setTalismanWorry('');
    } finally {
      setIsGeneratingTalisman(false);
    }
  };

  const handleRunAnxietyTest = async () => {
    setIsTestingAnxiety(true);
    try {
      const response = await fetch('/api/anxiety-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scores: anxietyAnswers,
          activeCompanionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnxietyResult(data);
      } else {
        throw new Error('Failed to fetch anxiety test');
      }
    } catch (e) {
      console.error(e);
      const totalScore = anxietyAnswers.reduce((a, b) => a + b, 0);
      let levelState = "湖流起涟 · 轻度紧绷";
      if (totalScore > 18) levelState = "狂澜骤至 · 焦虑过载";
      else if (totalScore > 11) levelState = "微雨连绵 · 中度紧绷";
      
      setAnxietyResult({
        level: levelState,
        metaphor: totalScore > 18 ? "高热负荷、发出警戒蜂鸣的引擎" : "微风中摇晃不定的风铃",
        physicalAnalysis: "由于外部目标的追赶或脑力高张，你体内的压力荷尔蒙可能处于较高波动点，肌肉存在潜意识紧绷，呼气较浅，需要刻意释放。",
        soulRemedy: [
          "深色呼吸练习：双目微闭，缓慢深呼吸4秒，屏息4秒，大口吐气6秒，重复5次复位迷走神经。",
          "写下「焦虑垃圾」：拿出一张废纸写满所有让你担心的事，然后撕碎并扔掉，完成心理切断。",
          "感官物理复归：闭眼，用温热双手在面部与耳后进行5次打圈抚触热敷，切断焦虑循环。"
        ],
        suggestedMusicTheme: "432Hz 绿野古琴共鸣自然白噪音"
      });
    } finally {
      setIsTestingAnxiety(false);
    }
  };

  const handleRunExhaustionTest = async () => {
    setIsTestingExhaustion(true);
    try {
      const response = await fetch('/api/exhaustion-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scores: exhaustionAnswers,
          activeCompanionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setExhaustionResult(data);
      } else {
        throw new Error('Failed to fetch exhaustion test');
      }
    } catch (e) {
      console.error(e);
      const totalScore = exhaustionAnswers.reduce((a, b) => a + b, 0);
      let ratio = 60;
      let levelDesc = "高能空转状态 · 中度内耗";
      if (totalScore > 18) {
        ratio = 88;
        levelDesc = "深度心能耗竭 · 濒临溢出";
      } else if (totalScore < 11) {
        ratio = 25;
        levelDesc = "微波微澜 · 轻柔储能";
      }

      setExhaustionResult({
        level: levelDesc,
        innerFrictionRatio: ratio,
        metaphor: totalScore > 18 ? "彻夜未眠、无声自燃的长明独烛" : "风停叶落、静思疗愈的古老丛林",
        cognitiveLoadAnalysis: "你极其敏感，常把外界的不经意信息解读为内在压力。大脑如同后台打开了无数APP未关闭的电子芯片，表面在待机，其实能量在隐秘流逝。",
        rechargeFormula: [
          "数字断舍离：选择连续3小时不看任何社交软件和动态，避免外界干扰信息的不断挤占。",
          "接地气疗法：脱下鞋子赤脚踩地板或草地5分钟，或是用冷水持续冲刷双手30秒转移中枢注意。",
          "大声呼喊许可：面向镜子，对自己说「我已经做得很好了，接下来的事情与我无关了，去睡个好觉吧」"
        ],
        growthAdvice: "生活并非一份精确完满的期末答案。请允许自己虚度一部分时光，偶尔做一点没有任何目的的闲散琐事，让灵魂重新充盈能量。"
      });
    } finally {
      setIsTestingExhaustion(false);
    }
  };
  
  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || isTyping) return;

    if (!textToSend) {
      setInputText('');
    }

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: rawText.trim(),
      timestamp: new Date().toISOString()
    };

    const threadWithUser = [...currentChatHistory, userMessage];
    const updatedChats = {
      ...chats,
      [activeCompanionId]: threadWithUser
    };
    saveChatsToStorage(updatedChats);

    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companionId: activeCompanionId,
          messages: threadWithUser.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
          memory: memories[activeCompanionId]
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const botMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'companion',
          text: data.text,
          timestamp: new Date().toISOString()
        };
        saveChatsToStorage({
          ...chats,
          [activeCompanionId]: [...threadWithUser, botMessage]
        });

        // Update long-term memory if returned
        if (data.updatedMemory) {
          saveMemoriesToStorage({
            ...memories,
            [activeCompanionId]: data.updatedMemory
          });
        }

        // Handle tool calls (Skills)
        if (data.toolCalls && Array.isArray(data.toolCalls)) {
          data.toolCalls.forEach((call: any) => {
            const { name, args } = call;
            if (name === 'set_theme' && args.themeId) {
              if (HEALING_THEMES.some(t => t.id === args.themeId)) {
                setActiveThemeId(args.themeId);
                localStorage.setItem('soul_companion_active_theme', args.themeId);
              }
            } else if (name === 'play_music' && args.category) {
              setActiveCategory(args.category as any);
              if (args.songId) {
                setCurrentSongId(args.songId);
              } else {
                const firstSong = HEALING_SONGS[args.category as MusicCategory]?.[0];
                if (firstSong) setCurrentSongId(firstSong.id);
              }
              setIsPlaying(true);
            } else if (name === 'log_mood_entry' && args.note) {
              const newRecord: MoodRecord = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                companionName: partner.name,
                userQuery: "由伙伴记录",
                aiAnalysis: args.note,
                moodTag: args.intensity ? `强度 ${args.intensity}` : undefined
              };
              saveRecordsToStorage([...moodRecords, newRecord]);
            }
          });
        }

        if (data.text.length > 80 && !data.toolCalls?.some((c: any) => c.name === 'log_mood_entry')) {
          const newRecord: MoodRecord = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            companionName: partner.name,
            userQuery: rawText.substring(0, 50) + (rawText.length > 50 ? '...' : ''),
            aiAnalysis: data.text
          };
          saveRecordsToStorage([...moodRecords, newRecord]);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`w-full h-screen h-[100dvh] overflow-hidden ${currentTheme.bgClass} ${textColor} flex flex-col relative font-sans transition-colors duration-1000`}>
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-15%] w-[55%] h-[55%] bg-gradient-to-br ${currentTheme.gradientTopLeft} rounded-full blur-[140px] transition-all duration-1000`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr ${currentTheme.gradientBottomRight} rounded-full blur-[140px] transition-all duration-1000`}></div>
      </div>

      {/* Ambient Sparkles */}
      {isAmbientSparkleActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-amber-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-[8%] left-[45%] w-2 h-2 bg-indigo-500/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-[25%] left-[80%] w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-pulse delay-500"></div>
        </div>
      )}

      {/* Header */}
      <nav className={`relative z-50 w-full border-b ${isLight ? 'border-stone-200' : 'border-white/10'} bg-transparent`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 flex flex-row justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 via-rose-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              心
            </div>
            <span className={`text-sm font-bold tracking-[0.2em] uppercase block ${isLight ? 'text-stone-800' : 'text-white'}`}>心灵伙伴</span>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-300 font-medium text-xs select-none cursor-pointer ${
                  isLight 
                    ? 'bg-white/80 border-stone-200 text-stone-800 shadow-sm' 
                    : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                <span>{currentTheme.icon}</span>
                <span>主题色</span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>

            {isThemeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => { setIsThemeDropdownOpen(false); setSelectedThemeCategory(null); }} />
                <div className={`absolute right-0 mt-2 w-72 rounded-2xl p-2.5 shadow-xl border z-50 ${
                  isLight ? 'bg-white border-stone-200 text-stone-800' : 'bg-[#1a111a] border-white/10 text-white'
                }`}>
                  {selectedThemeCategory === null ? (
                    <div className="space-y-1.5">
                      <button onClick={() => setSelectedThemeCategory('warm')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:bg-stone-50 transition-all">
                        <span className="text-xl">🍂</span>
                        <div className="text-left">
                          <span className="text-xs font-bold block">暖调温柔系</span>
                          <span className="text-[9px] opacity-50 block leading-tight">质朴、元气、舒适</span>
                        </div>
                      </button>
                      <button onClick={() => setSelectedThemeCategory('cool')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:bg-stone-50 transition-all">
                        <span className="text-xl">❄️</span>
                        <div className="text-left">
                          <span className="text-xs font-bold block">冷调治愈系</span>
                          <span className="text-[9px] opacity-50 block leading-tight">沉静、低饱和、舒缓</span>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setSelectedThemeCategory(null)} className="text-[10px] opacity-40 px-2 py-1 mb-2 hover:opacity-100 transition-all">← 返回分类</button>
                      <div className="space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
                        {HEALING_THEMES.filter(t => t.category === selectedThemeCategory).map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => { setActiveThemeId(theme.id); setIsThemeDropdownOpen(false); localStorage.setItem('soul_companion_active_theme', theme.id); }}
                            className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${theme.id === activeThemeId ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
                          >
                            <span className="text-lg">{theme.icon}</span>
                            <div>
                              <span className="text-[11px] font-bold block">{theme.name}</span>
                              <span className="text-[9px] opacity-50 block leading-tight">{theme.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full overflow-hidden flex flex-col relative z-20">
        {(activeTab === 'home' || activeTab === 'soul') ? (
          <section className="flex-1 overflow-y-auto no-scrollbar animate-fade-in px-4 py-8 sm:px-8">
            <div className="max-w-4xl mx-auto w-full pb-32 space-y-10">
              
              {/* Agent Greeting */}
              {activeTab === 'home' && (
                <>
                <div className={`${cardClass} rounded-[2.5rem] p-8 flex items-center gap-6 animate-fade-in`}>
                  <div className="w-16 h-16 rounded-[2rem] bg-stone-100 flex items-center justify-center text-4xl shadow-inner shrink-0 transition-transform duration-500 hover:scale-110">
                    {partner.avatar}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-black tracking-tight text-black">你好，我是 {partner.name}</h3>
                      <p className="text-sm opacity-95 leading-relaxed max-w-sm text-black font-medium">
                        今天我也在这里陪着你。有什么我可以帮你的，或者只是想聊聊吗？
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 text-white rounded-full text-sm font-bold shadow-lg hover:bg-stone-700 transition-all active:scale-95 group"
                    >
                      <span>开启与 {partner.name} 的对话</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes */}
                <div className={`${cardClass} rounded-[2.5rem] p-8 space-y-6`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-black opacity-95">每日灵感</h3>
                    <button onClick={refreshSoulNotes} className="p-1 opacity-60 hover:opacity-100 text-black"><RefreshCw className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4">
                    {displayedNotes.map((note, i) => (
                      <div key={i} className="flex gap-3 text-sm leading-relaxed border-l-2 border-stone-500 pl-4 py-1">
                        <p className="text-black font-semibold">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Playlist Summary */}
                <div className={`${cardClass} rounded-[2.5rem] p-8 space-y-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Music className="w-4 h-4 text-emerald-500" />
                       <h3 className="text-xs font-extrabold uppercase tracking-widest text-black opacity-95">治愈歌单</h3>
                    </div>
                    <button onClick={() => setShowPlaylistLibrary(true)} className="text-[10px] font-black text-black hover:underline">更多音乐 ➔</button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {MUSIC_LIST.map((song, i) => (
                      <div 
                        key={song.id} 
                        onClick={() => { 
                          setCurrentSongId(song.id); 
                          setIsPlaying(true);
                          // Determine category for the player to find it
                          const catList: MusicCategory[] = ['healing', 'relax', 'nature', 'chinese', 'english', 'piano', 'lofi', 'classic'];
                          const cat = catList.find(c => HEALING_SONGS[c].some(s => s.id === song.id));
                          if (cat) setActiveCategory(cat);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                          currentSongId === song.id && isPlaying ? 'bg-indigo-50 border border-indigo-100/50' : 'bg-stone-100 hover:bg-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{song.icon}</span>
                          <div>
                            <p className={`text-[11px] font-black text-black ${currentSongId === song.id && isPlaying ? 'text-black' : ''}`}>{song.title}</p>
                            <p className="text-[9px] font-bold text-black opacity-80">{song.artist}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </>
              )}



              {/* Soul Space: Weather & Talisman Bento Block */}
              {activeTab === 'soul' && (
                <div className={`${cardClass} rounded-[2.5rem] p-8 space-y-6 animate-fade-in`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/20 pb-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-serif font-bold tracking-tight flex items-center gap-2 text-black">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-pulse animate-duration-1000" />
                      心灵体察空间
                    </h2>
                    <p className="text-xs opacity-95 font-semibold text-black">通过情绪对齐与心流御守，寻找专属于你的内心秩序</p>
                  </div>
                  <div className="flex flex-wrap gap-1 bg-stone-100 dark:bg-white/10 p-1 rounded-2xl border border-stone-200/20 self-start">
                    <button 
                      onClick={() => setSoulSpaceTab('weather')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        soulSpaceTab === 'weather'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-black opacity-90 hover:opacity-100'
                      }`}
                    >
                      🌟 心灵探针
                    </button>
                    <button 
                      onClick={() => setSoulSpaceTab('talisman')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        soulSpaceTab === 'talisman'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-black opacity-90 hover:opacity-100'
                      }`}
                    >
                      🏮 树洞御守
                    </button>
                    <button 
                      onClick={() => setSoulSpaceTab('anxiety')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        soulSpaceTab === 'anxiety'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-black opacity-90 hover:opacity-100'
                      }`}
                    >
                      🧠 紧张自检
                    </button>
                    <button 
                      onClick={() => setSoulSpaceTab('exhaustion')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        soulSpaceTab === 'exhaustion'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-black opacity-90 hover:opacity-100'
                      }`}
                    >
                      🍂 内耗自测
                    </button>
                  </div>
                </div>

                {soulSpaceTab === 'weather' && (
                  <div className="space-y-6">
                    {/* Setup mental weather view with brightened text styles */}
                    <MentalWeather 
                      key={weatherUpdateTrigger} 
                      activeCompanionId={activeCompanionId}
                      onCheckIn={() => setWeatherUpdateTrigger(prev => prev + 1)}
                    />

                    <div className="pt-4 border-t border-dashed border-stone-200/20">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/10 dark:bg-amber-500/20 p-6 rounded-3xl border border-amber-500/20">
                        <div className="space-y-1.5 max-w-xl">
                          <h4 className="text-sm font-serif font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                            <Brain className="w-4 h-4 text-amber-500" />
                            智能体·心灵体察报告
                          </h4>
                          <p className="text-xs opacity-95 text-stone-800 dark:text-stone-100 leading-relaxed font-medium">
                            陪伴系统将结合您的近期沟通频率和心灵气象记录下每一缕心绪的跃动，由资深心灵分析师为您绘制出一份高维立体、深刻真挚的个人心理周报与调频建议。
                          </p>
                        </div>
                        <button
                          onClick={handleGenerateMindReport}
                          disabled={isGeneratingReport}
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingReport ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              正在体察波率...
                            </>
                          ) : (
                            <>
                              <span>🔮 一键体察并生成报告</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Displaying Current report if any */}
                      {mindReport && (
                        <div className="mt-6 bg-stone-50 dark:bg-stone-900/40 rounded-3xl p-6 sm:p-8 border border-stone-200/40 dark:border-white/10 space-y-6 animate-fade-in relative overflow-hidden">
                          <div className="absolute top-4 right-4 text-[9px] font-mono opacity-80 text-stone-500 dark:text-stone-300">
                            分析时间: {mindReport.reportDate || "刚刚"}
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-xs font-black tracking-widest uppercase opacity-90 text-stone-700 dark:text-amber-200">📝 总体情绪气象</h3>
                            <p className="text-lg font-serif font-black text-stone-900 dark:text-amber-300">{mindReport.overallEmotion}</p>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xs font-black tracking-widest uppercase opacity-90 text-stone-700 dark:text-amber-200">🌌 情绪模型意象</h3>
                            <p className="text-sm opacity-100 leading-relaxed font-serif font-bold italic text-stone-800 dark:text-stone-100">“{mindReport.weatherModel}”</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-white/90 dark:bg-white/5 p-5 rounded-2xl border border-stone-200/50 dark:border-white/20">
                              <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-1.5 font-mono">
                                <span>⚡ 潜在状态体察</span>
                              </h4>
                              <ul className="space-y-1.5 text-xs opacity-100 text-stone-850 dark:text-stone-100 leading-relaxed list-disc list-inside font-medium">
                                {(mindReport.keyIssues || []).map((issue, idx) => (
                                  <li key={idx} className="marker:text-rose-500 dark:marker:text-rose-400">{issue}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white/90 dark:bg-white/5 p-5 rounded-2xl border border-stone-200/50 dark:border-white/20">
                              <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5 font-mono">
                                <span>🧭 愈合与调频路径</span>
                              </h4>
                              <ul className="space-y-1.5 text-xs opacity-100 text-stone-850 dark:text-stone-100 leading-relaxed list-disc list-inside font-medium">
                                {(mindReport.healingPath || []).map((path, idx) => (
                                  <li key={idx} className="marker:text-emerald-500 dark:marker:text-emerald-400">{path}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="bg-amber-500/10 dark:bg-amber-500/20 p-5 rounded-2xl border border-amber-500/20 space-y-1.5">
                            <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 block uppercase tracking-wider font-mono">🌱 本周成长精进小任务</span>
                            <p className="text-xs font-serif leading-relaxed font-black opacity-100 text-stone-900 dark:text-amber-100">{mindReport.growthTask}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {soulSpaceTab === 'talisman' && (
                  <div className="space-y-6">
                    {/* Treehole Chat */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-black">🏮 时光树洞 - 尽情倾诉</h4>
                      <div className="flex flex-col h-[300px] border border-stone-200 rounded-2xl p-4 bg-stone-50 overflow-y-auto no-scrollbar gap-3">
                        {treeHoleMessages.length === 0 && (
                          <p className="text-xs text-stone-500 text-center mt-20">把烦恼讲给树洞听，我会一直在这儿...</p>
                        )}
                        {treeHoleMessages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <span className={`inline-block px-4 py-2 rounded-2xl text-xs max-w-[80%] ${msg.sender === 'user' ? 'bg-amber-500 text-white' : 'bg-white text-black border border-stone-200'}`}>
                                {msg.text}
                             </span>
                          </div>
                        ))}
                        {isTreeHoleTyping && <div className="text-xs text-stone-500">树洞正在静静倾听...</div>}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newTreeHoleInput}
                          onChange={(e) => setNewTreeHoleInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { handleTreeHoleChat(newTreeHoleInput); setNewTreeHoleInput('') } } }
                          className="flex-1 p-3 border rounded-xl bg-white text-xs outline-none focus:border-amber-400" 
                          placeholder="和树洞说说你的心事..."
                        />
                        <button onClick={() => { handleTreeHoleChat(newTreeHoleInput); setNewTreeHoleInput(''); }} className="px-5 bg-stone-800 text-white rounded-xl text-xs font-black hover:bg-stone-900 transition-all">发送</button>
                      </div>
                    </div>

                    <div className="border-t border-stone-200 pt-6 space-y-4">
                        <h4 className="text-sm font-black text-black">✨ 凝炼御守</h4>
                        <p className="text-xs opacity-80 text-stone-700">或者，为你最近的忧虑凝炼一个心灵御守：</p>
                       <div className="flex gap-3">
                        <input
                          type="text"
                          value={talismanWorry}
                          onChange={(e) => setTalismanWorry(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateTalisman(); }}
                          placeholder="输入纠缠着你的担忧..."
                          className="flex-1 px-5 py-3.5 text-xs rounded-2xl outline-none border border-stone-300 bg-stone-50/80 focus:bg-white focus:border-amber-400 transition-all text-black placeholder:text-stone-500"
                        />
                        <button
                          onClick={handleGenerateTalisman}
                          disabled={!talismanWorry.trim() || isGeneratingTalisman}
                          className="px-6 py-3 bg-stone-800 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-30"
                        >
                          {isGeneratingTalisman ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>凝炼 ➔</span>
                          )}
                        </button>
                      </div>

                      {/* Rendering the active Talisman card with high-contrast UI */}
                      {activeTalisman && (
                        <div className="flex justify-center py-4 animate-fade-in">
                          {/* Interactive Digital Talisman Card Component */}
                          <div className="w-full max-w-md rounded-[2.5rem] p-8 border-2 shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.01] text-left bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300/80 text-black shadow-amber-200/20">
                            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-300/40 via-transparent" />
                            <div className="relative z-10 space-y-4">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block text-center font-mono">{activeTalisman.title}</span>
                              <p className="text-sm font-serif leading-relaxed font-black opacity-100 text-black">{activeTalisman.analysis}</p>
                              <div className="pt-2 border-t border-black/10">
                                 <p className="text-xs font-bold text-black/90">"{activeTalisman.wisdomQuote}"</p>
                              </div>
                            </div>
                          </div>
                      </div>
                      )}
                    </div>
                  </div>
                )}

                    {/* Historic Talismans Library with high-contrast style */}
                    {savedTalismans.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-dashed border-stone-200/20">
                        <h4 className="text-xs font-black text-stone-800 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                          <span>倾听树洞 · 御守保存 ({savedTalismans.length})</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {savedTalismans.map((t) => (
                            <div 
                              key={t.id}
                              onClick={() => setActiveTalisman(t)}
                              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:scale-[1.03] ${
                                activeTalisman?.id === t.id 
                                  ? 'ring-2 ring-amber-400 border-amber-400 bg-white dark:bg-white/10' 
                                  : 'hover:bg-amber-100/50 dark:hover:bg-white/10 bg-white dark:bg-white/5 border-stone-300 dark:border-white/10 text-stone-900 dark:text-stone-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                <span className="text-xs font-black font-serif block truncate">{t.title}</span>
                                <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md scale-90 shrink-0 font-black">{t.energyBlessing}</span>
                              </div>
                              <p className="text-[9px] opacity-95 text-stone-800 dark:text-stone-200 block leading-tight mb-2 truncate">担忧: {t.worry}</p>
                              <span className="text-[8px] opacity-90 font-mono block font-bold text-black">守护: {t.companionName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {soulSpaceTab === 'anxiety' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-serif font-black text-stone-950 dark:text-[#fcd34d] flex items-center gap-2">
                        🧠 焦虑与紧张度自检
                      </h3>
                      <p className="text-xs opacity-95 text-stone-800 dark:text-stone-200 mt-1 font-semibold">
                        通过测量当下的躯体化紧绷及灾难化担忧度，精确评估压力负荷，由守护者开具舒缓的「精神解药」。
                      </p>
                    </div>

                    {!anxietyResult ? (
                      <div className="space-y-6 bg-stone-50 dark:bg-stone-900/40 rounded-3xl p-6 border border-stone-300 dark:border-white/10">
                        <div className="space-y-5">
                          {[
                            { index: 0, title: "莫名惊惶与心慌", desc: "最近常感到没有来由的心慌、手抖、胸闷或坐立不安。" },
                            { index: 1, title: "肉体紧绷与胀痛", desc: "遇到突发事情极易肌肉紧拧、脖颈酸痛、甚至心率加速，极易受惊。" },
                            { index: 2, title: "灾难性幻想放映", desc: "思维自动对尚未发生的事进行最坏、最具有灾难性的设想与恐惧假设。" },
                            { index: 3, title: "入眠反复与惊醒", desc: "准备入睡常因脑内高频脑波空置不去，反复纠缠或睡眠极浅极易惊醒。" },
                            { index: 4, title: "日常专注度碎化", desc: "日常生活中注意力极易游离、记忆力明显下降，对环境声响等风吹草动极其敏感。" }
                          ].map((q) => (
                            <div key={q.index} className="space-y-2">
                              <div className="flex justify-between items-center bg-stone-100 dark:bg-white/5 p-2 rounded-xl">
                                <span className="text-xs font-black text-stone-900 dark:text-stone-100">
                                  {q.index + 1}. {q.title}
                                </span>
                                <span className="text-[10px] font-mono opacity-90 text-stone-800 dark:text-stone-200 font-extrabold">
                                  程度: {anxietyAnswers[q.index]} / 5
                                </span>
                              </div>
                              <p className="text-[10px] opacity-95 text-stone-800 dark:text-stone-200 leading-relaxed px-1 font-semibold">{q.desc}</p>
                              
                              <div className="grid grid-cols-5 gap-2 pt-1.5">
                                {[
                                  { value: 1, label: "无感" },
                                  { value: 2, label: "微弱" },
                                  { value: 3, label: "中度" },
                                  { value: 4, label: "偏重" },
                                  { value: 5, label: "严重" }
                                ].map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => {
                                      const updated = [...anxietyAnswers];
                                      updated[q.index] = opt.value;
                                      setAnxietyAnswers(updated);
                                    }}
                                    className={`py-2 rounded-xl text-[10px] font-black transition-all border cursor-pointer ${
                                      anxietyAnswers[q.index] === opt.value
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                                        : 'bg-white dark:bg-white/5 border-stone-300 hover:bg-stone-50 dark:hover:bg-white/10 text-stone-800 dark:border-white/20 dark:text-stone-250'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleRunAnxietyTest}
                          disabled={isTestingAnxiety}
                          className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                        >
                          {isTestingAnxiety ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>正在评估躯体紧绷度，开具精神药方...</span>
                            </>
                          ) : (
                            <span>🧠 启动心身压力度测评 ➔</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 bg-gradient-to-br from-amber-500/10 to-rose-500/10 rounded-[2.5rem] p-6 sm:p-8 border border-amber-500/30 animate-fade-in relative overflow-hidden text-left">
                        <div className="absolute top-4 right-4 text-[9px] font-mono opacity-80 text-stone-900 font-extrabold">
                          守护体察者: {partner.name}
                        </div>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black tracking-widest text-[#5c4014] block uppercase">
                              🧠 精神紧张度评估
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-serif font-black text-rose-800">
                                {anxietyResult.level}
                              </span>
                              <span className="text-xs text-stone-900 font-black">
                                (累计分值: {anxietyAnswers.reduce((a, b) => a + b, 0)}/25)
                              </span>
                            </div>
                          </div>

                          <div className="bg-white/90 p-5 rounded-3xl border border-stone-300 space-y-1 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950">
                              🌌 灵魂折射意象
                            </span>
                            <p className="text-sm font-serif font-black italic text-amber-950">
                              “{anxietyResult.metaphor}”
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-black text-stone-950 uppercase tracking-wider">
                              🔬 身心张力指标解析
                            </h4>
                            <p className="text-xs leading-relaxed font-bold whitespace-pre-wrap text-stone-900">
                              {anxietyResult.physicalAnalysis}
                            </p>
                          </div>

                          <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1">
                              <span>🌿 专属舒压对冲药方</span>
                            </h4>
                            <div className="space-y-2">
                              {(anxietyResult.soulRemedy || []).map((step, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start bg-emerald-100 border border-emerald-300 p-4 rounded-2xl transition-transform shadow-sm">
                                  <span className="w-5 h-5 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-[10px] font-black shrink-0 font-mono">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs leading-relaxed text-emerald-950 font-black">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white/95 p-4 rounded-2xl border border-stone-300 flex items-center justify-between gap-3 pt-3 shadow-sm">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black text-stone-950 block">🎧 深度调频推荐</span>
                              <span className="text-xs font-serif font-black text-amber-950">{anxietyResult.suggestedMusicTheme}</span>
                            </div>
                            <button
                              onClick={() => {
                                setInputText(`我刚刚做完焦虑与紧张度自测，结果显示是 [${anxietyResult.level}]，意象是 [${anxietyResult.metaphor}]。我想听听你对我的舒缓看法与拥抱。`);
                                setActiveTab('chat');
                              }}
                              className="px-4 py-2 bg-stone-900 text-white text-[10px] font-black rounded-xl hover:bg-stone-950 transition-all text-center cursor-pointer"
                            >
                              开启专属调频 ➔
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-dashed border-stone-300 font-bold">
                          <button
                            onClick={() => setAnxietyResult(null)}
                            className="flex-1 py-3 border border-stone-400 hover:bg-stone-50 text-xs text-stone-900 rounded-xl transition-all cursor-pointer text-center font-bold"
                          >
                            ← 返回重新自检
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {soulSpaceTab === 'exhaustion' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-serif font-black text-stone-950 dark:text-[#fcd34d] flex items-center gap-2">
                        🍂 精神疲惫与内耗度自测
                      </h3>
                      <p className="text-xs opacity-100 text-stone-900 dark:text-stone-100 mt-1 font-semibold">
                        精密检测思维反刍与蓄电耗干指标，评估后台无形空转引发的电能损耗指数。
                      </p>
                    </div>

                    {!exhaustionResult ? (
                      <div className="space-y-6 bg-stone-50 dark:bg-stone-900/40 rounded-3xl p-6 border border-stone-300 dark:border-white/10">
                        <div className="space-y-5">
                          {[
                            { index: 0, title: "机能蓄电空耗感", desc: "即使睡眠饱满也没做体力劳动，整天也浑身犯懒不适、精疲力竭。" },
                            { index: 1, title: "简单决定阻力阻滞", desc: "面对回复一条无关紧要的微信、挑选饭点、确定一件小事感到严重窒息与抗拒。" },
                            { index: 2, title: "后台思想死循环", desc: "神经控制不住地反复回放放大他人的一个眼神、一个语调、并无休止挑剔自己的言行。" },
                            { index: 3, title: "内在严酷自我指控", desc: "内心有个严格的自我检察官在鞭笞，对自己有极其偏执的高标完美追求。" },
                            { index: 4, title: "感知钝化神能流失", desc: "曾经极其爱抚的游戏、看剧均无法激起任何多巴胺涟漪，感觉内心生命力在一点一滴渗漏流出。" }
                          ].map((q) => (
                            <div key={q.index} className="space-y-2">
                              <div className="flex justify-between items-center bg-stone-100 dark:bg-white/5 p-2 rounded-xl">
                                <span className="text-xs font-black text-stone-900 dark:text-stone-100">
                                  {q.index + 1}. {q.title}
                                </span>
                                <span className="text-[10px] font-mono opacity-90 text-stone-800 dark:text-stone-200 font-extrabold">
                                  程度: {exhaustionAnswers[q.index]} / 5
                                </span>
                              </div>
                              <p className="text-[10px] opacity-95 text-stone-800 dark:text-stone-200 leading-relaxed px-1 font-semibold">{q.desc}</p>
                              
                              <div className="grid grid-cols-5 gap-2 pt-1.5">
                                {[
                                  { value: 1, label: "无感" },
                                  { value: 2, label: "微弱" },
                                  { value: 3, label: "中度" },
                                  { value: 4, label: "耗竭" },
                                  { value: 5, label: "燃尽" }
                                ].map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => {
                                      const updated = [...exhaustionAnswers];
                                      updated[q.index] = opt.value;
                                      setExhaustionAnswers(updated);
                                    }}
                                    className={`py-2 rounded-xl text-[10px] font-black transition-all border cursor-pointer ${
                                      exhaustionAnswers[q.index] === opt.value
                                        ? 'bg-[#5c7a67] border-[#5c7a67] text-white shadow-sm'
                                        : 'bg-white dark:bg-white/5 border-stone-300 hover:bg-stone-50 dark:hover:bg-white/10 text-stone-800 dark:border-white/20 dark:text-stone-250'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleRunExhaustionTest}
                          disabled={isTestingExhaustion}
                          className="w-full mt-6 py-4 bg-[#5c7a67] hover:bg-[#486151] text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                        >
                          {isTestingExhaustion ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>正在扫描后台消耗，计算心神能损比...</span>
                            </>
                          ) : (
                            <span>🍂 启动机能耗尽与反刍体察 ➔</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 bg-gradient-to-br from-emerald-500/10 to-slate-500/10 rounded-[2.5rem] p-6 sm:p-8 border border-emerald-500/30 animate-fade-in relative overflow-hidden text-left font-sans">
                        <div className="absolute top-4 right-4 text-[9px] font-mono opacity-80 text-stone-900 font-extrabold">
                          守护保暖官: {partner.name}
                        </div>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black tracking-widest text-[#2d4d38] block uppercase">
                              🍂 精神空耗度报告
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-serif font-black text-emerald-800">
                                {exhaustionResult.level}
                              </span>
                              <span className="text-xs text-stone-900 font-black">
                                (指标值: {exhaustionAnswers.reduce((a, b) => a + b, 0)}/25)
                              </span>
                            </div>

                            {/* Custom Gauge progress bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-black">
                                <span className="text-stone-950">后台反刍思维损能率 (Cognitive Overturn)</span>
                                <span className="text-emerald-900 font-black">{exhaustionResult.innerFrictionRatio}%</span>
                              </div>
                              <div className="h-2.5 w-full bg-stone-300 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${exhaustionResult.innerFrictionRatio}%` }}
                               />
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#5c7a67]/15 p-5 rounded-3xl border border-[#5c7a67]/35 space-y-1 shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#1d3324]">
                              🌌 心神耗散意象
                            </span>
                            <p className="text-sm font-serif font-black italic text-stone-950">
                              “{exhaustionResult.metaphor}”
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-xs font-black text-stone-950 uppercase tracking-wider">
                              🧠 心智后台驻留深度解析
                            </h4>
                            <p className="text-xs leading-relaxed font-black whitespace-pre-wrap text-stone-900">
                              {exhaustionResult.cognitiveLoadAnalysis}
                            </p>
                          </div>

                          <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-black text-[#2d4d38] flex items-center gap-1">
                              <span>🔋 快速电能蓄能配方</span>
                            </h4>
                            <div className="space-y-2">
                              {(exhaustionResult.rechargeFormula || []).map((step, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start bg-emerald-100 border border-emerald-300 p-4 rounded-2xl hover:scale-[1.01] transition-transform shadow-sm">
                                  <span className="w-5 h-5 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-[10px] font-black shrink-0 font-mono">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs leading-relaxed text-emerald-950 font-black">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-amber-500/20 p-5 rounded-2xl border border-amber-500/40 space-y-1 shadow-sm">
                            <span className="text-[10px] font-black text-amber-950 block uppercase tracking-wider font-mono">
                              🌱 守护解药密语
                            </span>
                            <p className="text-xs font-serif leading-relaxed font-black text-amber-950">
                              {exhaustionResult.growthAdvice}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-dashed border-stone-300 font-bold">
                          <button
                            onClick={() => setExhaustionResult(null)}
                            className="flex-1 py-3 border border-stone-400 hover:bg-stone-50 text-xs text-stone-900 rounded-xl transition-all cursor-pointer text-center font-bold"
                          >
                            ← 返回重新测评
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </section>
        ) : activeTab === 'records' ? (
          <section className="flex-1 overflow-y-auto no-scrollbar px-4 py-8 sm:px-8 pb-32">
            <div className="max-w-4xl mx-auto w-full space-y-10">
            <div className="flex justify-between items-end px-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold tracking-tight">心灵印记</h2>
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Healing Journey Records</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsAddingRecord(true)}
                  className="w-10 h-10 rounded-full bg-stone-800 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
                {moodRecords.length > 0 && (
                  <button 
                    onClick={() => { if(confirm('要清空所有的心灵印记吗？')) saveRecordsToStorage([]); }}
                    className="text-[10px] font-bold opacity-30 hover:opacity-100 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" /> 清空
                  </button>
                )}
              </div>
            </div>

            {/* Add Record Modal Overlay */}
            {isAddingRecord && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/5 backdrop-blur-sm p-6">
                <div className={`${cardClass} w-full max-w-sm p-8 rounded-[2.5rem] space-y-6 shadow-2xl animate-in zoom-in-95 duration-300`}>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg">新中心灵印记</h3>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest">Manual Reflection Entry</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase opacity-30 ml-1">此刻的思绪</label>
                      <textarea 
                        value={newRecordQuery}
                        onChange={(e) => setNewRecordQuery(e.target.value)}
                        placeholder="记录下你此刻的困惑、感悟或风景..."
                        className="w-full h-24 bg-stone-50/50 border border-stone-100 rounded-2xl p-4 text-xs resize-none focus:outline-none focus:border-stone-300 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase opacity-30 ml-1">给自己的回应 (可选)</label>
                      <textarea 
                        value={newRecordAnalysis}
                        onChange={(e) => setNewRecordAnalysis(e.target.value)}
                        placeholder="写下一句你对自己的安慰或总结..."
                        className="w-full h-20 bg-stone-100/30 border border-stone-100/50 rounded-2xl p-4 text-xs resize-none focus:outline-none focus:border-stone-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => { setIsAddingRecord(false); setNewRecordQuery(''); setNewRecordAnalysis(''); }}
                      className="flex-1 py-3 bg-stone-50 rounded-xl text-xs font-bold"
                    >
                      取 消
                    </button>
                    <button 
                      onClick={handleAddManualRecord}
                      className="flex-1 py-3 bg-stone-800 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all"
                    >
                      保 存
                    </button>
                  </div>
                </div>
              </div>
            )}

            {moodRecords.length === 0 ? (
              <div className={`${cardClass} p-16 text-center opacity-40 rounded-[2.5rem] italic flex flex-col items-center gap-4`}>
                <div className="w-12 h-12 rounded-full border border-dashed border-stone-300 flex items-center justify-center opacity-50">
                   <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-sm">还未留下任何心灵足迹...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {moodRecords.slice().reverse().map((record, idx) => (
                  <div key={record.id} className={`${cardClass} rounded-[2rem] overflow-hidden group hover:shadow-md transition-all duration-500`}>
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block">
                             {new Date(record.timestamp).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                           </span>
                           <h4 className="text-xs font-bold opacity-80">
                             与 <span className="text-indigo-500">{record.companionName}</span> 的深夜长谈
                           </h4>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300">
                          <MessagesSquare className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="relative pl-6">
                            <div className="absolute left-0 top-0 text-2xl font-serif opacity-10 text-stone-400">“</div>
                            <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                              {record.userQuery}
                            </p>
                         </div>
                         
                         <div className="p-5 rounded-2xl bg-stone-50/60 text-[13px] leading-relaxed text-stone-600 border border-stone-100/50 shadow-inner">
                           {record.aiAnalysis}
                         </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <div className="h-px flex-1 bg-stone-100/50"></div>
                        <span className="text-[9px] font-mono opacity-20 uppercase tracking-tighter">Verified Soul Moment</span>
                        <div className="h-px flex-1 bg-stone-100/50"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </section>
        ) : (
          <section className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Area */}
            <div className="w-full border-b border-stone-200/20">
              <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{partner.avatar}</span>
                  <div>
                    <h3 className="text-sm font-bold">{partner.name}</h3>
                    <p className="text-[10px] opacity-40">{partner.chineseTitle}</p>
                  </div>
                </div>
                <button onClick={() => setIsConfirmingReset(true)} className="p-2 opacity-20 hover:opacity-100 transition-all"><RefreshCw className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-8 space-y-3 no-scrollbar">
              <div className="max-w-4xl mx-auto space-y-3">
                {currentChatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-3 px-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      m.sender === 'user' ? 'bg-stone-800 text-white rounded-tr-none' : 'bg-white text-stone-800 rounded-tl-none border border-stone-100'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="flex justify-start"><div className="px-3 py-2 bg-stone-50 rounded-2xl animate-pulse text-[9px] opacity-40 italic">正在回应...</div></div>}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="w-full px-4 py-2 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-4 sm:px-8">
              <div className="max-w-4xl mx-auto flex gap-2 items-center">
                <div className="flex-1 relative flex items-center">
                  <input 
                    type="text" 
                    value={inputText}
                    placeholder={`和 ${partner.name} 说点什么...`}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl px-5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-200 transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => handleSendMessage()} 
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 shrink-0 ${
                    inputText.trim() ? 'bg-stone-800 text-white shadow-lg' : 'bg-stone-100 text-stone-300'
                  }`}
                  disabled={!inputText.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </section>
        )}
      </main>

      {/* Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-stone-200 flex justify-around py-1.5 px-6 pb-[env(safe-area-inset-bottom)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'home' ? 'text-stone-800' : 'text-stone-400 opacity-40'}`}>
          <Home className="w-4.5 h-4.5" /><span className="text-[9px] font-bold">主页</span>
        </button>
        <button onClick={() => setActiveTab('soul')} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'soul' ? 'text-stone-800' : 'text-stone-400 opacity-40'}`}>
          <Sparkles className="w-4.5 h-4.5" /><span className="text-[9px] font-bold">心灵空间</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'chat' ? 'text-stone-800' : 'text-stone-400 opacity-40'}`}>
          <MessagesSquare className="w-4.5 h-4.5" /><span className="text-[9px] font-bold">倾诉</span>
        </button>
        <button onClick={() => setActiveTab('records')} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'records' ? 'text-stone-800' : 'text-stone-400 opacity-40'}`}>
          <Heart className="w-4.5 h-4.5" /><span className="text-[9px] font-bold">印记</span>
        </button>
      </nav>

            {/* Music Library Overlay */}
      {showPlaylistLibrary && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white/95 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
          <header className={`border-b ${isLight ? 'border-stone-100' : 'border-white/10'}`}>
            <div className="max-w-4xl mx-auto px-4 py-6 sm:px-8 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-xl font-serif font-bold">心灵音乐库</h2>
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Healing Sound Library</p>
              </div>
              <button 
                onClick={() => setShowPlaylistLibrary(false)}
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center transition-all active:scale-90"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            <div className="max-w-4xl mx-auto">
              {/* Categories */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-6 sm:px-8 border-b border-stone-50">
                {MUSIC_PLAYLISTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActiveCategory(p.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === p.id 
                        ? 'bg-stone-800 text-white shadow-lg scale-105' 
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>

              {/* Category Banner */}
              <div className="px-4 py-8 sm:px-8">
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-stone-800 to-stone-900 text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10 space-y-2">
                      <span className="text-3xl">{MUSIC_PLAYLISTS.find(p => p.id === activeCategory)?.icon}</span>
                      <h3 className="text-2xl font-serif font-bold">{MUSIC_PLAYLISTS.find(p => p.id === activeCategory)?.title}</h3>
                      <p className="text-xs opacity-60 max-w-xs">{MUSIC_PLAYLISTS.find(p => p.id === activeCategory)?.desc}</p>
                  </div>
                  <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 blur-xl">
                    {MUSIC_PLAYLISTS.find(p => p.id === activeCategory)?.icon}
                  </div>
                </div>
              </div>

              {/* Song List */}
              <div className="px-4 sm:px-8 space-y-1">
                {HEALING_SONGS[activeCategory].map((song) => (
                  <div 
                    key={song.id} 
                    onClick={() => { setCurrentSongId(song.id); setIsPlaying(true); }}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group ${
                      currentSongId === song.id ? 'bg-indigo-50/50 border border-indigo-100' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm transition-all ${
                        currentSongId === song.id ? 'bg-indigo-600 text-white' : 'bg-white border border-stone-100'
                      }`}>
                        <span>{song.icon}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${currentSongId === song.id ? 'text-indigo-600' : ''}`}>{song.title}</p>
                        <p className="text-[10px] opacity-40">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Duration removed */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      )}

      {/* Reset Modal */}
      {isConfirmingReset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/10 backdrop-blur-sm p-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl space-y-6 text-center max-w-xs w-full">
            <h4 className="font-bold">要重置这段对话吗？</h4>
            <p className="text-xs opacity-50">重置后，本场对话的记忆将会模糊并消失。</p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirmingReset(false)} className="flex-1 py-3 bg-stone-50 rounded-xl text-xs font-bold">继续聊</button>
              <button onClick={handleResetThread} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-xs font-bold">确认清除</button>
            </div>
          </div>
        </div>
      )}

      {/* LLM Connection Status Modal */}
      {isLlmStatusModalOpen && llmStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/20 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white text-stone-800 p-8 rounded-[2rem] shadow-2xl space-y-6 text-left max-w-sm w-full border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-stone-900">大模型连接状态</h4>
                <p className="text-[10px] opacity-40">核对当前已接入的高级模型</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">接入服务商 (Provider)</span>
                  <span className="font-bold text-stone-900">{llmStatus.provider}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">当前模型 (Active Model)</span>
                  <span className="font-bold text-indigo-650 font-mono text-[11px]">{llmStatus.model}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-50">API 端点 (Base URL)</span>
                  <span className="font-bold text-stone-900 font-mono text-[10px] break-all">{llmStatus.endpoint}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-stone-200/50 pt-2">
                  <span className="opacity-50">运行状态</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    已启用
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#eef2ff]/40 rounded-xl space-y-1">
                <p className="text-[10px] text-indigo-800 font-bold">💡 核心配置说明：</p>
                <div className="text-[9px] text-indigo-700/80 leading-relaxed space-y-0.5">
                  <p>• 已经专属接入硅基流动 (SiliconFlow) 平台服务。</p>
                  <p>• 当前大语言模型被锁定在 <code>Qwen/Qwen3.6-27B</code>，为您提供精准陪伴与理解。</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsLlmStatusModalOpen(false)} 
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              了解并返回
            </button>
          </div>
        </div>
      )}

      {/* Internal Const Helpers mapping */}
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const MUSIC_LIST = [
  { id: 'c1', title: '笼', artist: '张碧晨', duration: '04:12', icon: '🎭' },
  { id: 'e1', title: 'Flowers', artist: 'Miley Cyrus', duration: '03:20', icon: '💐' },
  { id: 'c3', title: '向云端', artist: '小霞/海洋', duration: '04:20', icon: '☁️' },
  { id: 'e4', title: 'Vampire', artist: 'Olivia Rodrigo', duration: '03:39', icon: '🧛' },
  { id: 'c6', title: '晴天', artist: '周杰伦', duration: '04:29', icon: '☀️' },
  { id: 'c13', title: '交换余生', artist: '林俊杰', duration: '04:35', icon: '⌛' },
  { id: 'e13', title: 'Espresso', artist: 'Sabrina Carpenter', duration: '02:52', icon: '☕' },
  { id: 'c15', title: '想去海边', artist: '夏日入侵企画', duration: '03:55', icon: '🌊' },
];
