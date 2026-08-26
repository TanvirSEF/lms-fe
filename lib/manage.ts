import { api } from '@/lib/api';

export type ManageLesson = {
  documentId: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
};

export type ManageQuizQuestion = {
  documentId: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type ManageQuiz = {
  documentId: string;
  title: string;
  questions: ManageQuizQuestion[];
};

export type ManageCourse = {
  documentId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  instructor: { username: string } | null;
  lessons: ManageLesson[];
  quizzes: ManageQuiz[];
};

export type QuizInput = {
  title: string;
  course?: string;
  questions: { text: string; options: string[]; correctIndex: number }[];
};

export type CourseInput = {
  title: string;
  description?: string;
  coverUrl?: string;
};

export type LessonInput = {
  title: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  course?: string;
};

export async function fetchManageCourses(): Promise<ManageCourse[]> {
  const res = await api<{ data: ManageCourse[] }>('/courses/manage');
  return res.data;
}

export function createCourse(input: CourseInput) {
  return api('/courses', { method: 'POST', body: JSON.stringify(input) });
}

export function updateCourse(documentId: string, input: CourseInput) {
  return api(`/courses/${documentId}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deleteCourse(documentId: string) {
  return api(`/courses/${documentId}`, { method: 'DELETE' });
}

export function createLesson(input: LessonInput) {
  return api('/lessons', { method: 'POST', body: JSON.stringify(input) });
}

export function updateLesson(documentId: string, input: LessonInput) {
  return api(`/lessons/${documentId}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deleteLesson(documentId: string) {
  return api(`/lessons/${documentId}`, { method: 'DELETE' });
}

export function createQuiz(input: QuizInput) {
  return api('/quizzes', { method: 'POST', body: JSON.stringify(input) });
}

export function updateQuiz(documentId: string, input: QuizInput) {
  return api(`/quizzes/${documentId}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deleteQuiz(documentId: string) {
  return api(`/quizzes/${documentId}`, { method: 'DELETE' });
}
