import { TOPIC_MAP, QUESTIONS } from "./questionBank";
import type { MasteryClass, MasteryScore, PracticeAttempt, QuizAnswer, QuizResult, RankedTopic, Topic, TopicId } from "./types";

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

export function masteryFromQuiz(results: QuizResult[]): MasteryScore[] {
  return results.map((r) => ({
    topicId: r.topicId,
    score: r.score,
    correctCount: r.correct,
    attemptCount: r.total,
    classification: classify(r.score),
  }));
}

export function rankTopics(
  masteryByTopic: Map<TopicId, MasteryScore>,
  availableTopicIds: TopicId[],
): RankedTopic[] {
  const present = availableTopicIds.map((id) => TOPIC_MAP[id]).filter(Boolean);
  const scored = present.map((t) => ({
    topic: t,
    mastery: masteryByTopic.get(t.id) ?? null,
  }));

  scored.sort((a, b) => {
    const sa = a.mastery?.score ?? 0;
    const sb = b.mastery?.score ?? 0;
    if (sa !== sb) return sa - sb;
    return a.topic.defaultOrder - b.topic.defaultOrder;
  });

  const ordered = [...scored];
  for (let i = 0; i < ordered.length; i += 1) {
    const current = ordered[i];
    for (const prereqId of current.topic.prerequisites) {
      const prereqIdx = ordered.findIndex((o) => o.topic.id === prereqId);
      if (prereqIdx === -1) continue;
      const prereq = ordered[prereqIdx];
      const prereqIsWeak = (prereq.mastery?.score ?? 0) < 50;
      const dependentIsWeak = (current.mastery?.score ?? 0) < 50;
      if (prereqIsWeak && prereqIdx > i && dependentIsWeak) {
        const [moved] = ordered.splice(prereqIdx, 1);
        ordered.splice(i, 0, moved);
      }
    }
  }

  const masteredTail = ordered.filter(
    (o) => (o.mastery?.classification ?? "needs-work") === "mastered",
  );
  const rest = ordered.filter(
    (o) => (o.mastery?.classification ?? "needs-work") !== "mastered",
  );
  const finalOrder = [...rest, ...masteredTail];

  return finalOrder.map((entry, idx) => ({
    topic: entry.topic,
    rank: idx + 1,
    mastery: entry.mastery,
    reason: "",
  }));
}

export function recomputeMasteryWithAttempts(
  topicId: TopicId,
  attempts: PracticeAttempt[],
  windowSize = 10,
): MasteryScore {
  const recent = attempts
    .filter((a) => a.topicId === topicId)
    .slice(-windowSize);
  const total = recent.length;
  const correct = recent.filter((a) => a.correct).length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return {
    topicId,
    score,
    correctCount: correct,
    attemptCount: total,
    classification: classify(score),
  };
}
