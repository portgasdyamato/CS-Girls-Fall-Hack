from typing import Dict, List, Optional
from dataclasses import dataclass
import re


@dataclass
class EmotionAnalysis:
    emotion: str
    sentiment: float
    confidence: float
    analysis: Dict

# Emotional vocabulary for keyword detection
EMOTIONAL_KEYWORDS = {
    'happy': ['happy', 'joyful', 'excited', 'love', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic'],
    'sad': ['sad', 'depressed', 'unhappy', 'miserable', 'terrible', 'awful', 'hate', 'disappointed'],
    'angry': ['angry', 'furious', 'mad', 'frustrated', 'annoyed', 'irritated', 'disgusted'],
    'anxious': ['anxious', 'worried', 'nervous', 'afraid', 'scared', 'stressed', 'panicked'],
    'neutral': ['ok', 'fine', 'alright', 'normal', 'usual', 'regular']
}


def analyze_sentiment(text: str) -> float:
    positive_words = ['love', 'great', 'amazing', 'wonderful', 'excellent', 'fantastic', 'good']
    negative_words = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'disgusting', 'poor']
    
    text_lower = text.lower()
    
    positive_score = sum(1 for word in positive_words if word in text_lower)
    negative_score = sum(1 for word in negative_words if word in text_lower)
    
    # Normalize to -10 to +10 range
    sentiment = (positive_score - negative_score) * 2
    return max(-10, min(10, sentiment))


def analyze_punctuation(text: str) -> float:
    exclamation_marks = text.count('!')
    question_marks = text.count('?')
    
    # Double punctuation intensifies emotion
    double_punctuation = len(re.findall(r'[!?]{2,}', text))
    
    text_length = len(text)
    if text_length == 0:
        return 0.0
    
    intensity = (exclamation_marks * 1.5 + question_marks * 1.2 + double_punctuation * 1.3) / text_length
    return min(intensity, 1.0)


def analyze_keywords(text: str) -> List[str]:
    text_lower = text.lower()
    found_emotions = []
    
    for emotion, keywords in EMOTIONAL_KEYWORDS.items():
        if any(keyword in text_lower for keyword in keywords):
            found_emotions.append(emotion)
    
    return found_emotions if found_emotions else ['neutral']


def analyze_capitalization(text: str) -> float:
    if not text:
        return 0.0
    
    uppercase_count = sum(1 for c in text if c.isupper())
    letter_count = sum(1 for c in text if c.isalpha())
    
    if letter_count == 0:
        return 0.0
    
    return min(uppercase_count / letter_count, 1.0)


def analyze_question_patterns(text: str) -> float:
    question_count = text.count('?')
    sentence_count = max(1, len(re.split(r'[.!?]', text)))
    
    return question_count / sentence_count


def detect_emotion(text: str) -> Dict:
    sentiment_score = analyze_sentiment(text)
    punctuation_intensity = analyze_punctuation(text)
    emotional_keywords = analyze_keywords(text)
    capitalization_level = analyze_capitalization(text)
    question_count = analyze_question_patterns(text)
    
    # Determine dominant emotion
    dominant_emotion = emotional_keywords[0] if emotional_keywords else 'neutral'
    
    # Refine based on sentiment
    if sentiment_score > 3:
        dominant_emotion = 'happy'
    elif sentiment_score < -3:
        dominant_emotion = 'sad'
    elif capitalization_level > 0.3 and punctuation_intensity > 0.3:
        dominant_emotion = 'angry'
    elif question_count > 0.3:
        dominant_emotion = 'anxious'
    
    # Calculate confidence
    factors = [
        abs(sentiment_score) / 10,     
        punctuation_intensity,           
        0.8 if emotional_keywords else 0.2, 
        0.7 if capitalization_level > 0.2 else 0.3, 
        0.6 if question_count > 0 else 0.3  
    ]
    confidence = min(sum(factors) / len(factors), 1.0)
    
    return {
        'emotion': dominant_emotion,
        'sentiment': sentiment_score,
        'confidence': round(confidence, 2),
        'analysis': {
            'sentiment_score': sentiment_score,
            'punctuation_intensity': round(punctuation_intensity, 2),
            'emotional_keywords': emotional_keywords,
            'capitalization_level': round(capitalization_level, 2),
            'question_count': round(question_count, 2)
        }
    }
