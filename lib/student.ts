import { api } from '@/lib/api';

export type CourseProgress = {
  total: number;
  completed: number;
  percent: number;
  completedLessonIds: string[];
};

export type EnrolledCourse = {
  course: {
    documentId: string;
    title: string;
    description: string | null;
    coverUrl: string | null;
    instructor: { username: string } | null;
  };
  progress: CourseProgress;
};

export type LearnLesson = {
  documentId: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
};

export type LearnCourse = {
  documentId: string;
  title: string;
  description: string | null;
  instructor: { username: string } | null;
  lessons: LearnLesson[];
  quizzes: { documentId: string; title: string; questionCount: number }[];
  progress: CourseProgress | null;
  completedLessonIds: string[];
};

export type QuizQuestion = {
  documentId: string;
  text: string;
  options: string[];
};

export type TakeQuiz = {
  documentId: string;
  title: string;
  questions: QuizQuestion[];
};

export type QuizResult = {
  score: number;
  total: number;
  correctAnswers: number[];
};

export type QuizAttempt = {
  documentId: string;
  score: number;
  total: number;
  createdAt: string;
  quiz: {
    documentId: string | null;
    title: string | null;
    course: { documentId: string; title: string } | null;
  };
};

export function enroll(courseDocumentId: string) {
  return api('/enrollments/enroll', {
    method: 'POST',
    body: JSON.stringify({ course: courseDocumentId }),
  });
}

export async function fetchMyCourses(): Promise<EnrolledCourse[]> {
  const res = await api<{ data: EnrolledCourse[] }>('/enrollments/my');
  return res.data;
}

export function completeLesson(lessonDocumentId: string) {
  return api<{ data: CourseProgress }>('/progress/complete', {
    method: 'POST',
    body: JSON.stringify({ lesson: lessonDocumentId }),
  });
}

export async function fetchLearnCourse(documentId: string): Promise<LearnCourse> {
  const res = await api<{ data: LearnCourse }>(`/courses/${documentId}/learn`);
  return res.data;
}

export async function fetchQuizForTake(documentId: string): Promise<TakeQuiz> {
  const res = await api<{ data: TakeQuiz }>(`/quizzes/${documentId}/take`);
  return res.data;
}

export function submitQuiz(documentId: string, answers: number[]) {
  return api<{ data: QuizResult }>(`/quizzes/${documentId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  }).then((res) => res.data);
}

export async function fetchMyAttempts(): Promise<QuizAttempt[]> {
  const res = await api<{ data: QuizAttempt[] }>('/quizzes/attempts');
  return res.data;
}
