export type UserRole = 'admin' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export type SubjectCode = 'english' | 'gk' | 'legal' | 'logical' | 'quant';

export interface Subject {
  id: string;
  name: string;
  code: SubjectCode;
  description?: string;
  display_order: number;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  subject_id?: string;
  topic_id?: string | null;
  source?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  passage_id?: string | null;
  subject_id: string;
  topic_id?: string | null;
  question_text: string;
  options: QuestionOption[];
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  marks_positive: number;
  marks_negative: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_pyq?: boolean;
  pyq_year?: number | null;
  tags?: string[];
  created_at?: string;
  // Joined relation fields for convenience
  passage?: Passage | null;
  subject?: Subject | null;
}

export type TestType = 'full_mock' | 'sectional' | 'pyq' | 'practice_set';

export interface Test {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  type: TestType;
  duration_minutes: number;
  total_marks: number;
  positive_mark: number;
  negative_mark: number;
  is_published: boolean;
  pyq_year?: number | null;
  subject_id?: string | null;
  question_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TestQuestion {
  id: string;
  test_id: string;
  question_id: string;
  order_seq: number;
  section_name?: string;
  question?: Question;
}

export type AttemptMode = 'mock' | 'practice' | 'pyq' | 'revision';
export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned';

export interface SubjectScoreBreakdown {
  subject_name: string;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  total_marks: number;
  total_questions: number;
  time_spent_seconds: number;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  test_id?: string | null;
  mode: AttemptMode;
  status: AttemptStatus;
  started_at: string;
  submitted_at?: string | null;
  time_spent_seconds: number;
  score: number;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  accuracy: number;
  subject_breakdown?: Record<string, SubjectScoreBreakdown>;
  created_at: string;
  // Joined relations
  test?: Test | null;
}

export type PaletteQuestionStatus =
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_and_marked';

export interface AttemptResponse {
  id?: string;
  attempt_id: string;
  question_id: string;
  selected_option: 'A' | 'B' | 'C' | 'D' | null;
  is_correct?: boolean | null;
  is_marked_for_review: boolean;
  time_spent_seconds: number;
  visited: boolean;
  answered_at?: string | null;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  notes?: string | null;
  tag?: string | null;
  created_at: string;
  question?: Question;
}
