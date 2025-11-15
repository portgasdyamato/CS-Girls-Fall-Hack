// @ts-ignore
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface EmotionAnalysis {
  emotion: string;
  sentiment: number;
  confidence: number;
  analysis: {
    sentimentScore: number;
    punctuationIntensity: number;
    emotionalKeywords: string[];
    capitalizationLevel: number;
    questionCount: number;
  };
}

// Analyze sentiment using the sentiment library
function analyzeSentiment(text: string): number {
  const result = sentiment.analyze(text);
  return result.score;
}

// Analyze punctuation intensity
function analyzePunctuation(text: string): number {
  const emotionalPunctuation = (text.match(/[!?]{2,}|[!?]/g) || []).length;
  const exclamationMarks = (text.match(/!/g) || []).length;
  const questionMarks = (text.match(/\?/g) || []).length;
  
  const intensity = (exclamationMarks * 1.5 + questionMarks * 1.2 + emotionalPunctuation * 1.3) / text.length;
  return Math.min(intensity, 1);
}

// Analyze emotional keywords
function analyzeKeywords(text: string): string[] {
  const emotionalKeywords: { [key: string]: string[] } = {
    happy: ['happy', 'joyful', 'excited', 'love', 'amazing', 'wonderful', 'great', 'awesome'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'terrible', 'awful', 'hate', 'disappointed'],
    angry: ['angry', 'furious', 'mad', 'frustrated', 'annoyed', 'irritated', 'disgusted'],
    anxious: ['anxious', 'worried', 'nervous', 'afraid', 'scared', 'stressed', 'panicked'],
    neutral: ['ok', 'fine', 'alright', 'normal', 'usual', 'regular']
  };

  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];

  for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      foundKeywords.push(emotion);
    }
  }

  return foundKeywords.length > 0 ? foundKeywords : ['neutral'];
}

// Analyze capitalization level
function analyzeCapitalization(text: string): number {
  const uppercase = (text.match(/[A-Z]/g) || []).length;
  const totalLetters = (text.match(/[a-zA-Z]/g) || []).length;
  
  if (totalLetters === 0) return 0;
  
  const capitalizationLevel = uppercase / totalLetters;
  return Math.min(capitalizationLevel, 1);
}

// Analyze question patterns
function analyzeQuestionPatterns(text: string): number {
  const questionCount = (text.match(/\?/g) || []).length;
  const totalSentences = (text.match(/[.!?]/g) || []).length || 1;
  
  return questionCount / totalSentences;
}

// Main emotion detection function
export function detectEmotion(text: string): EmotionAnalysis {
  const sentimentScore = analyzeSentiment(text);
  const punctuationIntensity = analyzePunctuation(text);
  const emotionalKeywords = analyzeKeywords(text);
  const capitalizationLevel = analyzeCapitalization(text);
  const questionCount = analyzeQuestionPatterns(text);

  // Determine dominant emotion based on keyword analysis
  let dominantEmotion = emotionalKeywords[0] || 'neutral';

  // Refine emotion based on sentiment score
  if (sentimentScore > 3) {
    dominantEmotion = 'happy';
  } else if (sentimentScore < -3) {
    dominantEmotion = 'sad';
  } else if (capitalizationLevel > 0.3 && punctuationIntensity > 0.3) {
    dominantEmotion = 'angry';
  } else if (questionCount > 0.3) {
    dominantEmotion = 'anxious';
  }

  // Calculate confidence (0-1)
  const factors = [
    Math.abs(sentimentScore) / 10, // sentiment contribution
    punctuationIntensity, // punctuation contribution
    emotionalKeywords.length > 0 ? 0.8 : 0.2, // keyword match
    capitalizationLevel > 0.2 ? 0.7 : 0.3, // capitalization
    questionCount > 0 ? 0.6 : 0.3 // question patterns
  ];
  const confidence = Math.min(factors.reduce((a, b) => a + b, 0) / factors.length, 1);

  return {
    emotion: dominantEmotion,
    sentiment: sentimentScore,
    confidence,
    analysis: {
      sentimentScore,
      punctuationIntensity,
      emotionalKeywords,
      capitalizationLevel,
      questionCount,
    },
  };
}
