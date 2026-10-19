import { QUESTIONS } from "./questionBank";
import type { MasteryClass, QuizAnswer, QuizResult } from "./types";

export function classify(score: number): MasteryClass {
  if (score >= 80) return "mastered";
  if (score >= 50) return "developing";
  return "needs-work";
}

export function scoreQuiz(answers: QuizAnswer[]): QuizResult[] {
  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const a of answers) {
    const q = QUESTIONS.find((x) => x.id === a.questionId);
    const isCorrect = q ? q.correctOptionId === a.selectedOptionId : false;
    const bucket = byTopic.get(a.topicId) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (isCorrect) bucket.correct += 1;
    byTopic.set(a.topicId, bucket);
  }
  const results: QuizResult[] = [];
  for (const [topicId, { correct, total }] of byTopic) {
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);
    results.push({ topicId: topicId as any, correct, total, score });
  }
  return results.sort((x, y) => x.topicId.localeCompare(y.topicId));
}
