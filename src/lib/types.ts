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

export interface Question {
  id: string;
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
  timestamp: number;
}

export type Screen = "landing" | "dashboard" | "quiz" | "study-path" | "practice";

export interface User {
  email: string;
  displayName: string;
  createdAt: number;
}
