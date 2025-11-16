from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass


@dataclass
class ProgressStats:
    total_sessions: int
    total_time_spent: int
    average_comprehension: float
    topics_reviewed: List[str]
    last_session_date: Optional[str]


def format_progress_stats(stats: ProgressStats) -> Dict:
    """Convert progress stats to dictionary"""
    return {
        'total_sessions': stats.total_sessions,
        'total_time_spent': stats.total_time_spent,
        'average_comprehension': stats.average_comprehension,
        'topics_reviewed': stats.topics_reviewed,
        'last_session_date': stats.last_session_date
    }


async def track_progress(
    user_id: str,
    session_id: str,
    topics_reviewed: List[str],
    comprehension_level: int,
    time_spent: int,
    questions_answered: int = 0,
    correct_answers: int = 0
) -> bool:
    print(f"Recording progress for user {user_id}, session {session_id}")
    print(f"  Topics: {topics_reviewed}")
    print(f"  Comprehension: {comprehension_level}%")
    print(f"  Time: {time_spent} minutes")
    
    return True


async def get_user_progress_stats(user_id: str) -> Optional[ProgressStats]:
    """Get user progress statistics"""
    return ProgressStats(
        total_sessions=0,
        total_time_spent=0,
        average_comprehension=0.0,
        topics_reviewed=[],
        last_session_date=None
    )


async def get_session_progress(session_id: str) -> Optional[Dict]:
    print(f"Fetching progress for session {session_id}")
    # This will be implemented with database connection
    return None


async def update_comprehension_level(
    session_id: str,
    comprehension_level: int
) -> bool:
    if comprehension_level < 0 or comprehension_level > 100:
        raise ValueError("Comprehension level must be between 0 and 100")
    
    print(f"Updating comprehension for session {session_id}: {comprehension_level}%")
    # This will be implemented with database connection
    return True


def calculate_average_comprehension(comprehension_levels: List[int]) -> float:
    if not comprehension_levels:
        return 0.0
    return sum(comprehension_levels) / len(comprehension_levels)


def aggregate_topics(all_topics_lists: List[List[str]]) -> List[str]:
    unique_topics = set()
    for topics in all_topics_lists:
        unique_topics.update(topics)
    return sorted(list(unique_topics))
