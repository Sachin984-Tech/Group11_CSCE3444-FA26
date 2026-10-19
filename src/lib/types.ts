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

export type Screen = "landing" | "dashboard" | "quiz";

export interface User {
  email: string;
  displayName: string;
  createdAt: number;
}
