import { TOPICS, TOPIC_MAP, QUESTIONS } from "./questionBank";
import type { MasteryClass, MasteryScore, PracticeAttempt, QuizAnswer, QuizResult, RankedTopic, ReasonTag, Topic, TopicId } from "./types";

export function classify(score: number): MasteryClass {
  if (score >= 80) return "mastered";
  if (score >= 50) return "developing";
  return "needs-work";
}

/**
 * Scores a diagnostic per topic. When the list of asked question ids is
 * given, unanswered questions count as wrong (as the submit dialog says).
 */
export function scoreQuiz(answers: QuizAnswer[], askedQuestionIds: string[] = []): QuizResult[] {
  const byTopic = new Map<string, { correct: number; total: number }>();
  const answeredIds = new Set(answers.map((a) => a.questionId));
  for (const id of askedQuestionIds) {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q || answeredIds.has(id)) continue;
    const bucket = byTopic.get(q.topicId) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    byTopic.set(q.topicId, bucket);
  }
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
  attempts: PracticeAttempt[] = [],
  now: number = Date.now(),
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

  // Pull weak prerequisites ahead of weak dependents. Repeat until nothing
  // moves: a prerequisite that was just pulled forward may itself have a
  // weak prerequisite that now sits behind it (e.g. Trees -> Stacks & Queues
  // -> Linked Lists). The topic graph is acyclic, so this always settles.
  const ordered = [...scored];
  const isWeak = (o: (typeof ordered)[number]) => (o.mastery?.score ?? 0) < 50;
  let moved = true;
  for (let pass = 0; moved && pass < ordered.length * ordered.length; pass += 1) {
    moved = false;
    for (let i = 0; i < ordered.length && !moved; i += 1) {
      const current = ordered[i];
      if (!isWeak(current)) continue;
      for (const prereqId of current.topic.prerequisites) {
        const prereqIdx = ordered.findIndex((o) => o.topic.id === prereqId);
        if (prereqIdx > i && isWeak(ordered[prereqIdx])) {
          const [prereq] = ordered.splice(prereqIdx, 1);
          ordered.splice(i, 0, prereq);
          moved = true;
          break;
        }
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
  const scoreOrder = scored.map((s) => s.topic.id);

  return finalOrder.map((entry, idx) => ({
    topic: entry.topic,
    rank: idx + 1,
    mastery: entry.mastery,
    reason: buildReason(entry.topic, entry.mastery, masteryByTopic),
    summary: buildSummary(entry.topic, entry.mastery, masteryByTopic),
    tags: buildTags(entry.topic, entry.mastery, masteryByTopic, {
      rank: idx + 1,
      scoreRank: scoreOrder.indexOf(entry.topic.id) + 1,
      lowestScore: Math.min(...rest.map((r) => r.mastery?.score ?? 0)),
      available: availableTopicIds,
      attempts,
      now,
    }),
  }));
}

const STALE_AFTER_MS = 3 * 24 * 60 * 60 * 1000;

/** Topics that list `id` as a direct prerequisite. */
export function dependentsOf(id: TopicId, available: TopicId[]): TopicId[] {
  return TOPICS.filter((t) => available.includes(t.id) && t.prerequisites.includes(id)).map((t) => t.id);
}

function weakPrereqNames(topic: Topic, masteryByTopic: Map<TopicId, MasteryScore>): string[] {
  return topic.prerequisites
    .filter((id) => {
      const m = masteryByTopic.get(id);
      return m !== undefined && m.score < 50;
    })
    .map((id) => TOPIC_MAP[id].name);
}

function buildSummary(
  topic: Topic,
  mastery: MasteryScore | null,
  masteryByTopic: Map<TopicId, MasteryScore>,
): string {
  if (!mastery) return "No data yet - take the quiz to rank this topic.";
  const base = `${mastery.correctCount}/${mastery.attemptCount} correct (${mastery.score}%)`;
  if (mastery.score >= 80) return `${base} - already mastered, so it's optional review.`;
  const weak = weakPrereqNames(topic, masteryByTopic);
  if (weak.length > 0) {
    return `${base}, but ${weak.join(" and ")} should come first - ${weak.length === 1 ? "it's a weak prerequisite" : "they're weak prerequisites"}.`;
  }
  return `${base} - ${labelFor(mastery.classification).toLowerCase()}, so it's scheduled ${mastery.score < 50 ? "early" : "after your weakest topics"}.`;
}

function buildTags(
  topic: Topic,
  mastery: MasteryScore | null,
  masteryByTopic: Map<TopicId, MasteryScore>,
  ctx: { rank: number; scoreRank: number; lowestScore: number; available: TopicId[]; attempts: PracticeAttempt[]; now: number },
): ReasonTag[] {
  if (!mastery) return [{ kind: "no-data", label: "No data yet" }];
  if (mastery.classification === "mastered") return [{ kind: "mastered", label: "Mastered" }];

  const tags: ReasonTag[] = [];
  if (mastery.score === ctx.lowestScore) tags.push({ kind: "lowest", label: "Lowest score" });
  if (ctx.rank < ctx.scoreRank) tags.push({ kind: "pulled-ahead", label: "Pulled ahead as a prerequisite" });

  const weak = weakPrereqNames(topic, masteryByTopic);
  if (weak.length > 0) tags.push({ kind: "weak-prereq", label: `Weak prerequisite: ${weak.join(", ")}` });

  const deps = dependentsOf(topic.id, ctx.available);
  if (deps.length > 0) tags.push({ kind: "unlocks", label: `Unlocks ${deps.length} topic${deps.length === 1 ? "" : "s"}` });

  const lastPractice = ctx.attempts.filter((a) => a.topicId === topic.id).slice(-1)[0]?.timestamp;
  if (!lastPractice || ctx.now - lastPractice > STALE_AFTER_MS) {
    tags.push({ kind: "stale", label: lastPractice ? "Not practiced in 3+ days" : "Not practiced yet" });
  }
  return tags;
}

export interface PathChange {
  topicId: TopicId;
  from: number;
  to: number;
  explanation: string;
}

/**
 * Compares two rankings and explains every topic whose rank changed -
 * used to show "Path updated" right after a practice answer.
 */
export function explainPathChange(before: RankedTopic[], after: RankedTopic[], practicedId: TopicId): PathChange[] {
  const changes: PathChange[] = [];
  for (const a of after) {
    const b = before.find((x) => x.topic.id === a.topic.id);
    if (!b || b.rank === a.rank) continue;
    const name = a.topic.name;
    const m = a.mastery;
    let explanation: string;
    if (a.topic.id === practicedId && m) {
      explanation =
        a.rank > b.rank
          ? `${name} moved down because your mastery rose to ${m.score}% (${labelFor(m.classification)}).`
          : `${name} moved up because your mastery dropped to ${m.score}% (${labelFor(m.classification)}).`;
    } else {
      const practiced = TOPIC_MAP[practicedId].name;
      explanation =
        a.rank < b.rank
          ? `${name} moved up because ${practiced} moved below it.`
          : `${name} moved down because ${practiced} now needs more work.`;
    }
    changes.push({ topicId: a.topic.id, from: b.rank, to: a.rank, explanation });
  }
  // Practiced topic first, then by new rank.
  return changes.sort((x, y) => (x.topicId === practicedId ? -1 : y.topicId === practicedId ? 1 : x.to - y.to));
}

function buildReason(
  topic: Topic,
  mastery: MasteryScore | null,
  masteryByTopic: Map<TopicId, MasteryScore>,
): string {
  if (!mastery) {
    return `No diagnostic data yet for ${topic.name}. Take the quiz to unlock a personalized rank.`;
  }
  const score = mastery.score;
  const correct = mastery.correctCount;
  const total = mastery.attemptCount;

  if (score >= 80) {
    return `${topic.name} ranked low-priority because you answered ${correct} of ${total} correctly (${score}%) - that's Mastered. Marked as Optional Review, but feel free to revisit when you have spare time.`;
  }

  const weakPrereqs = topic.prerequisites
    .map((id) => ({ id, m: masteryByTopic.get(id) }))
    .filter((x) => x.m && x.m!.score < 50)
    .map((x) => TOPIC_MAP[x.id].name);

  let base = `${topic.name} sits at rank here because you answered ${correct} of ${total} correctly (${score}%), classifying as ${labelFor(mastery.classification)}.`;
  if (weakPrereqs.length > 0) {
    base += ` It also depends on ${weakPrereqs.join(", ")} - those scored below 50%, so they're scheduled ahead of ${topic.name} to keep you from building on shaky foundations.`;
  }
  return base;
}

function labelFor(cls: MasteryClass): string {
  if (cls === "mastered") return "Mastered";
  if (cls === "developing") return "Developing";
  return "Needs Work";
}

/**
 * Mastery = share correct over the last `windowSize` answers for a topic.
 * Diagnostic answers count as the oldest answers in that window, so one lucky
 * practice answer right after the quiz can't jump a topic straight to 100%.
 */
export function recomputeMasteryWithAttempts(
  topicId: TopicId,
  attempts: PracticeAttempt[],
  windowSize = 10,
  diagnosticAnswers: QuizAnswer[] = [],
): MasteryScore {
  const seeded: { correct: boolean }[] = diagnosticAnswers
    .filter((a) => a.topicId === topicId)
    .map((a) => ({ correct: QUESTIONS.find((q) => q.id === a.questionId)?.correctOptionId === a.selectedOptionId }));
  const recent = [...seeded, ...attempts.filter((a) => a.topicId === topicId)].slice(-windowSize);
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

export function summaryStats(masteryByTopic: Map<TopicId, MasteryScore>) {
  const all = Array.from(masteryByTopic.values());
  const mastered = all.filter((m) => m.classification === "mastered").length;
  const developing = all.filter((m) => m.classification === "developing").length;
  const needsWork = all.filter((m) => m.classification === "needs-work").length;
  const average = all.length === 0 ? 0 : Math.round(all.reduce((s, m) => s + m.score, 0) / all.length);
  return { mastered, developing, needsWork, total: all.length, average };
}
