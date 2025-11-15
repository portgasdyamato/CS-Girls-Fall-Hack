import { db } from "../db";
import { studyProgress } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export interface ProgressUpdate {
  userId: string;
  sessionId: string;
  topicsReviewed: string[];
  comprehensionLevel: number; // 0-100
  timeSpent: number; // in minutes
  questionsAnswered?: number;
  correctAnswers?: number;
}

export interface ProgressStats {
  totalSessions: number;
  totalTimeSpent: number;
  averageComprehension: number;
  topicsReviewed: string[];
  lastSessionDate: Date | null;
}

/**
 * Track user's study progress
 */
export async function trackProgress(
  userId: string,
  sessionId: string,
  data: Omit<ProgressUpdate, "userId" | "sessionId">
): Promise<void> {
  try {
    const topicsString = JSON.stringify(data.topicsReviewed);
    
    await db.insert(studyProgress).values({
      userId,
      sessionId,
      topicsReviewed: topicsString,
      comprehensionLevel: data.comprehensionLevel,
      timeSpent: data.timeSpent,
      questionsAnswered: data.questionsAnswered || 0,
      correctAnswers: data.correctAnswers || 0,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error tracking progress:", error);
    throw error;
  }
}

/**
 * Get user's progress statistics
 */
export async function getUserProgressStats(userId: string): Promise<ProgressStats> {
  try {
    const allProgress = await db
      .select()
      .from(studyProgress)
      .where(eq(studyProgress.userId, userId));

    if (allProgress.length === 0) {
      return {
        totalSessions: 0,
        totalTimeSpent: 0,
        averageComprehension: 0,
        topicsReviewed: [],
        lastSessionDate: null,
      };
    }

    const totalSessions = allProgress.length;
    const totalTimeSpent = allProgress.reduce((sum, p) => sum + (p.timeSpent ?? 0), 0);
    const averageComprehension = 
      allProgress.reduce((sum, p) => sum + (p.comprehensionLevel ?? 0), 0) / totalSessions;

    // Collect all unique topics
    const allTopics = new Set<string>();
    allProgress.forEach((p) => {
      try {
        if (p.topicsReviewed) {
          const topicsStr = typeof p.topicsReviewed === 'string' ? p.topicsReviewed : JSON.stringify(p.topicsReviewed);
          const topics = JSON.parse(topicsStr);
          topics.forEach((t: string) => allTopics.add(t));
        }
      } catch {
        // Skip if JSON parsing fails
      }
    });

    // Get last session date
    const lastSessionDate = allProgress.reduce((latest, current) => {
      const currentDate = current.createdAt ? new Date(current.createdAt) : new Date();
      return currentDate > latest ? currentDate : latest;
    }, allProgress[0].createdAt ? new Date(allProgress[0].createdAt) : new Date());

    return {
      totalSessions,
      totalTimeSpent,
      averageComprehension: Math.round(averageComprehension * 100) / 100,
      topicsReviewed: Array.from(allTopics),
      lastSessionDate,
    };
  } catch (error) {
    console.error("Error getting progress stats:", error);
    throw error;
  }
}

/**
 * Get session-specific progress
 */
export async function getSessionProgress(sessionId: string) {
  try {
    const progress = await db
      .select()
      .from(studyProgress)
      .where(eq(studyProgress.sessionId, sessionId));

    return progress.length > 0 ? progress[0] : null;
  } catch (error) {
    console.error("Error getting session progress:", error);
    throw error;
  }
}

/**
 * Update comprehension level for a session
 */
export async function updateComprehensionLevel(
  sessionId: string,
  comprehensionLevel: number
): Promise<void> {
  try {
    if (comprehensionLevel < 0 || comprehensionLevel > 100) {
      throw new Error("Comprehension level must be between 0 and 100");
    }

    await db
      .update(studyProgress)
      .set({
        comprehensionLevel,
        updatedAt: new Date(),
      })
      .where(eq(studyProgress.sessionId, sessionId));
  } catch (error) {
    console.error("Error updating comprehension level:", error);
    throw error;
  }
}
