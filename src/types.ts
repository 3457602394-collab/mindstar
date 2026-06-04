export interface Message {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  isGenerating?: boolean;
}

export type CompanionId = 'max' | 'sophie' | 'muyun' | 'leo';

export interface Companion {
  id: CompanionId;
  name: string;
  chineseTitle: string;
  englishTitle: string;
  avatar: string; // Emoji or custom SVG representation
  color: string; // Tailwind class accent text or bg
  bgColor: string; // Tailwind background shade
  borderColor: string; // Border accent
  glowColor: string; // shadow-glow accent
  bio: string;
  philosophy: string;
  tags: string[];
  sampleQuestions: string[];
  initialGreeting: string;
}

export type WeatherType = 'sunny' | 'misty' | 'rainy' | 'windy' | 'starry' | 'aurora';

export interface EmotionalWeather {
  type: WeatherType;
  energy: number; // 0 to 100
  anxiety: number; // 0 to 100
  social: number; // 0 to 100
  checkedInAt: string;
}

export interface SoulCard {
  id: string;
  worry: string;
  title: string;
  analysis: string;
  wisdomQuote: string;
  energyBlessing: string;
  luckyColor: string;
  luckyActivity: string;
  patternType: 'zen' | 'aurora' | 'nebula' | 'forest';
  companionName: string;
  companionId: CompanionId;
  timestamp: string;
}

export interface MindReport {
  overallEmotion: string;
  weatherModel: string;
  keyIssues: string[];
  healingPath: string[];
  growthTask: string;
  reportDate: string;
}

export interface AnxietyResult {
  level: string;
  metaphor: string;
  physicalAnalysis: string;
  soulRemedy: string[];
  suggestedMusicTheme: string;
}

export interface ExhaustionResult {
  level: string;
  innerFrictionRatio: number;
  metaphor: string;
  cognitiveLoadAnalysis: string;
  rechargeFormula: string[];
  growthAdvice: string;
}
