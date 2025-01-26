// contains all the custom types that we want to use

type language = "en" | "hi";
export type quizType = "assessment" | "homework" | "omr-assessment";
export type testFormat = "full_syllabus_test" | "major_test" | "part_test" | "chapter_test" | "hiring_test" | "evaluation_test" | "mock_test" | "homework" | "";
export type quizTitleType = string | null;
export type textAreaValueType = string | number | null;
export type isFirstSessionType = boolean | null;
type quizNavigationMode = "linear" | "non-linear";
export type submittedAnswer = number[] | string[] | string | number | null;
export type CorrectAnswerType = number[] | string[] | string | number | null;

export enum eventType {
  START_QUIZ = "start-quiz",
  RESUME_QUIZ = "resume-quiz",
  DUMMY_EVENT = "dummy-event",
  END_QUIZ = "end-quiz"
}

export enum questionType {
  SINGLE_CHOICE = "single-choice",
  MULTI_CHOICE = "multi-choice",
  NUMERICAL_INTEGER = "numerical-integer",
  NUMERICAL_FLOAT = "numerical-float",
  SUBJECTIVE = "subjective",
  MATRIX_MATCH = "matrix-match"
}

export enum questionTypeHeaderText {
    SINGLE_CHOICE = "Single Choice",
    MULTI_CHOICE = "Multiple Answer",
    NUMERICAL_INTEGER = "Numerical Integer",
    NUMERICAL_FLOAT = "Numerical",
    SUBJECTIVE = "Subjective Answer",
    MATRIX_MATCH = "Matrix Matching"
 }

export interface IconButtonTitleConfig {
  value: string;
  class?: string | string[];
}

export interface IconButtonIconConfig {
  enabled: boolean;
  iconName: string;
  iconClass?: string | string[];
}

export interface InputTextValidationConfig {
  enabled: boolean;
  isValid: boolean;
  validMessage: String;
  invalidMessage: String;
}

export type DraftResponse = number[] | string[] | number | string | null;

export interface SubmittedResponse {
  _id: string;
  question_id: string;
  answer: submittedAnswer;
  visited: boolean;
  time_spent?: number; // time spent on question in seconds
  marked_for_review: boolean;
}

interface ScorecardMetricIcon {
  source: string;
  class: string;
}

export interface ScorecardMetric {
  name: string;
  icon: ScorecardMetricIcon;
  value: number;
}

export interface QuestionSetMetric {
  name: string | null,
  qset_id: string,
  marksScored: number,
  maxQuestionsAllowedToAttempt: number,
  numAnswered: number,
  correctlyAnswered: number,
  partiallyAnswered: number,
  wronglyAnswered: number,
  numQuestionsMarkedForReview: number,
  attemptRate: number,
  accuracyRate: number
}

export interface QuizMetadata {
  quiz_type: quizType;
  grade: string;
  subject: string;
  chapter?: string;
  topic?: string;
  omr_mode: boolean;
  test_format?: testFormat;
  session_end_time?: string;
}

export interface QuestionBucket {
  // `start` and `end` are array indices
  start: number,
  end: number,
  isFetched: boolean
}

export interface QuestionBucketingMap {
  [key: number]: QuestionBucket
}

interface QuestionMetadata {
  grade: string;
  subject: string;
  chapter: string;
  topic: string;
  competency: string[];
  difficulty: string;
  chapter_id: string;
  topic_id: string;
}

export interface TimeLimit {
  min: number;
  max: number;
}

interface Image {
  url: string;
  alt_text: string;
}

interface PartialMarkCondition {
  num_correct_selected: number;
}

interface PartialMarkRule {
  conditions: PartialMarkCondition[];
  marks: number;
}

export interface MarkingScheme {
  correct: number;
  wrong: number;
  skipped: number;
  partial: PartialMarkRule[] | null;
}

interface Option {
  text: string;
  image: Image | null;
}

export interface Question {
  type: questionType;
  text: string;
  options: Option[] | null;
  correct_answer: CorrectAnswerType;
  image: Image | null;
  max_char_limit: number | null;
  matrix_size: number[] | null;
  graded: boolean;
  instructions: string | null;
  marking_scheme: MarkingScheme | null;
  solution: string[] | null;
  _id: string;
  metadata: QuestionMetadata | null;
  question_set_id: string;
  source_id: string | null;
}

export interface QuestionSet {
  _id: string;
  questions: Question[];
  max_questions_allowed_to_attempt: number;
  title: string | null;
  description: string | null;
  marking_scheme: MarkingScheme;
}

export interface QuestionSetIndexLimits {
  low: number; // the lowest question number in a question set
  high: number; // the highest question number in a question set
}

export interface QuizAPIResponse {
  title: quizTitleType;
  instructions: string;
  _id: string;
  language: language;
  max_marks: number;
  metadata: QuizMetadata;
  navigation_mode: quizNavigationMode;
  num_attempts_allowed: number;
  num_graded_questions: number;
  shuffle: boolean;
  time_limit: TimeLimit | null;
  review_immediate?: boolean;
  show_scores?: boolean;
  display_solution?: boolean;
  question_sets: QuestionSet[];
}

export interface SessionAPIResponse {
  _id: string;
  user_id: string;
  quiz_id: string;
  is_first: boolean;
  omr_mode: boolean;
  question_order: number[];
  session_answers: SubmittedResponse[];
  has_quiz_ended: boolean;
  time_remaining?: number;
}

export interface UpdateSessionAPIPayload {
  event: eventType;
  metrics?: QuestionSetMetric[];
}
export interface QuestionSetMetricPayload {
  name: string;
  qset_id: string;
  marks_scored: number;
  num_answered: number;
  num_skipped: number;
  num_correct: number;
  num_wrong: number;
  num_partially_correct: number;
  num_marked_for_review: number;
  attempt_rate: number;
  accuracy_rate: number;
}

export interface SessionMetricsPayload {
  qset_metrics: QuestionSetMetricPayload[];
  total_answered: number;
  total_skipped: number;
  total_correct: number;
  total_wrong: number;
  total_partially_correct: number;
  total_marked_for_review: number;
  total_marks: number;
}
export interface UpdateSessionAPIResponse {
  time_remaining: number; // how much time is remaining for quiz to complete
}

export interface SessionAnswerAPIResponse {
  status: number;
}

export interface UpdateSessionAnswerAPIPayload {
  answer?: submittedAnswer;
  visited?: boolean;
  time_spent?: number; // time spent on question in seconds
  marked_for_review?: boolean;
}

export type TimeSpentEntry = {
  timeSpent: number;
  hasSynced: boolean;
};

export type UpdateSessionAnswersAtSpecificPositionsAPIPayload = [number, UpdateSessionAnswerAPIPayload][];

export interface answerEvaluation {
  valid: boolean; // whether the evaluation of the question is valid in the first place (invalid for ungraded questions)
  answered: boolean; // whether the question has been answered
  isCorrect?: boolean;
  isPartiallyCorrect?: boolean; // whether question has been partially answered for multi answer
}

export type questionState = "success" | "error" | "neutral" | "partial-success" | "review";
export interface paletteItemState {
  index: number; // index of the corresponding question in the list of questions
  value: questionState;
}

export interface questionSetPalette {
  title: string | null;
  paletteItems: paletteItemState[];
  instructionText: string;
  maxQuestionsAllowedToAttempt: number;
}

export interface OrganizationAPIResponse {
  _id: string;
  name: string;
}

export interface FormResultResponse {
  response: string,
  all_results_exist: boolean,
  result_link: string,
  test_name: string,
  redirect: boolean
}

export interface CircularProgressResult {
  title: string;
  value: string;
}

export interface JnvDict {
  [index : string] : string[];
}
