export type TopicId =
  | "arrays"
  | "linked-lists"
  | "stacks-queues"
  | "trees"
  | "graphs"
  | "sorting-searching";

export interface Topic {
  id: TopicId;
  name: string;
  blurb: string;
  prerequisites: TopicId[];
  defaultOrder: number;
  accent: "emerald" | "violet" | "amber" | "fuchsia" | "rose" | "teal";
  icon: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  difficulty: Difficulty;
  topicId: TopicId;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  topicId: TopicId;
}

export interface QuizResult {
  topicId: TopicId;
  correct: number;
  total: number;
  score: number;
}

export type MasteryClass = "needs-work" | "developing" | "mastered";

export interface MasteryScore {
  topicId: TopicId;
  score: number;
  correctCount: number;
  attemptCount: number;
  classification: MasteryClass;
}

export interface RankedTopic {
  topic: Topic;
  rank: number;
  mastery: MasteryScore | null;
  reason: string;
}

export interface PracticeAttempt {
  questionId: string;
  topicId: TopicId;
  correct: boolean;
  selectedOptionId?: string;
  timestamp: number;
}

export type Screen = "landing" | "dashboard" | "quiz" | "study-path" | "practice" | "progress" | "review" | "history";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: number;
  provider: "firebase" | "local";
}

/** One point on the study timeline, recorded after a diagnostic or a practice answer. */
export interface HistoryEntry {
  timestamp: number;
  kind: "diagnostic" | "practice";
  /** Practice only: which topic was practiced and whether the answer was right. */
  topicId?: TopicId;
  correct?: boolean;
  /** Diagnostic only: how many questions the quiz had. */
  questions?: number;
  /** Average mastery across topics with data, right after this event. */
  average: number;
  /** Mastery score per topic right after this event. */
  mastery: Partial<Record<TopicId, number>>;
}
