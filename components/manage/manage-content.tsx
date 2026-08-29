'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { CourseFormDialog } from '@/components/manage/course-form-dialog';
import { CourseStudentsDialog } from '@/components/manage/course-students-dialog';
import { DeleteButton } from '@/components/manage/delete-button';
import { LessonFormDialog } from '@/components/manage/lesson-form-dialog';
import { QuizFormDialog } from '@/components/manage/quiz-form-dialog';
import {
  deleteCourse,
  deleteLesson,
  deleteQuiz,
  fetchManageCourses,
  type ManageCourse,
  type ManageLesson,
  type ManageQuiz,
} from '@/lib/manage';

export function ManageContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<ManageCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [courseDialog, setCourseDialog] = useState<{ open: boolean; course: ManageCourse | null }>({
    open: false,
    course: null,
  });
  const [lessonDialog, setLessonDialog] = useState<{
    open: boolean;
    course: ManageCourse | null;
    lesson: ManageLesson | null;
  }>({ open: false, course: null, lesson: null });
  const [quizDialog, setQuizDialog] = useState<{
    open: boolean;
    course: ManageCourse | null;
    quiz: ManageQuiz | null;
  }>({ open: false, course: null, quiz: null });
  const [studentsDialog, setStudentsDialog] = useState<{
    open: boolean;
    course: ManageCourse | null;
  }>({ open: false, course: null });

  const reload = async () => {
    try {
      const data = await fetchManageCourses();
      setCourses(data);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManageCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteCourse(documentId: string) {
    await deleteCourse(documentId);
    await reload();
  }

  async function handleDeleteLesson(documentId: string) {
    await deleteLesson(documentId);
    await reload();
  }

  async function handleDeleteQuiz(documentId: string) {
    await deleteQuiz(documentId);
    await reload();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Manage courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.userRole === 'instructor'
              ? 'Your own courses and their lessons.'
              : 'Every course on the platform.'}
          </p>
        </div>
        <Button onClick={() => setCourseDialog({ open: true, course: null })}>
          <Plus className="size-4" />
          New course
        </Button>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No courses yet. Create your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course) => {
            const isOpen = expanded === course.documentId;

            return (
              <Card key={course.documentId}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      {course.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.coverUrl}
                          alt=""
                          className="h-10 w-16 shrink-0 rounded-md border object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                          <BookOpen className="size-4 text-muted-foreground/60" />
                        </span>
                      )}
                      {course.title}
                      <Badge variant="outline" className="font-normal">
                        {course.lessons.length} lessons
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(isOpen ? null : course.documentId)}
                      >
                        {isOpen ? (
                          <ChevronDown className="size-3.5" />
                        ) : (
                          <ChevronRight className="size-3.5" />
                        )}
                        Lessons
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStudentsDialog({ open: true, course })}
                      >
                        <Users className="size-3.5" />
                        Students
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCourseDialog({ open: true, course })}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <DeleteButton onConfirm={() => handleDeleteCourse(course.documentId)} />
                    </div>
                  </div>
                  {course.instructor && (
                    <p className="text-sm text-muted-foreground">
                      Instructor: {course.instructor.username}
                    </p>
                  )}
                </CardHeader>

                {isOpen && (
                  <CardContent className="flex flex-col gap-3">
                    {course.lessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No lessons yet.</p>
                    ) : (
                      <ul className="flex flex-col divide-y rounded-lg border">
                        {course.lessons.map((lesson) => (
                          <li
                            key={lesson.documentId}
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                                {lesson.order}
                              </span>
                              <span className="truncate">{lesson.title}</span>
                              {lesson.videoUrl && (
                                <BookOpen className="size-3.5 shrink-0 text-muted-foreground" />
                              )}
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setLessonDialog({ open: true, course, lesson })
                                }
                              >
                                <Pencil className="size-3.5" />
                                Edit
                              </Button>
                              <DeleteButton
                                onConfirm={() => handleDeleteLesson(lesson.documentId)}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLessonDialog({ open: true, course, lesson: null })}
                      >
                        <Plus className="size-3.5" />
                        Add lesson
                      </Button>
                    </div>

                    <div className="mt-6">
                      <h3 className="mb-2 text-sm font-medium">Quizzes</h3>
                      {course.quizzes.length === 0 ? (
                        <p className="mb-2 text-sm text-muted-foreground">No quizzes yet.</p>
                      ) : (
                        <ul className="mb-2 flex flex-col divide-y rounded-lg border">
                          {course.quizzes.map((quiz) => (
                            <li
                              key={quiz.documentId}
                              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="truncate">{quiz.title}</span>
                                <Badge variant="outline" className="font-normal">
                                  {quiz.questions.length} questions
                                </Badge>
                              </span>
                              <span className="flex shrink-0 items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setQuizDialog({ open: true, course, quiz })}
                                >
                                  <Pencil className="size-3.5" />
                                  Edit
                                </Button>
                                <DeleteButton onConfirm={() => handleDeleteQuiz(quiz.documentId)} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuizDialog({ open: true, course, quiz: null })}
                      >
                        <Plus className="size-3.5" />
                        Add quiz
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <CourseFormDialog
        key={`course-${courseDialog.course?.documentId ?? 'new'}-${courseDialog.open}`}
        open={courseDialog.open}
        onOpenChange={(open) => setCourseDialog((prev) => ({ ...prev, open }))}
        course={courseDialog.course}
        onSaved={reload}
      />
      <LessonFormDialog
        key={`lesson-${lessonDialog.lesson?.documentId ?? lessonDialog.course?.documentId ?? 'new'}-${lessonDialog.open}`}
        open={lessonDialog.open}
        onOpenChange={(open) => setLessonDialog((prev) => ({ ...prev, open }))}
        courseDocumentId={lessonDialog.course?.documentId ?? ''}
        lesson={lessonDialog.lesson}
        nextOrder={(lessonDialog.course?.lessons.length ?? 0) + 1}
        onSaved={reload}
      />
      <QuizFormDialog
        key={`quiz-${quizDialog.quiz?.documentId ?? quizDialog.course?.documentId ?? 'new'}-${quizDialog.open}`}
        open={quizDialog.open}
        onOpenChange={(open) => setQuizDialog((prev) => ({ ...prev, open }))}
        courseDocumentId={quizDialog.course?.documentId ?? ''}
        quiz={quizDialog.quiz}
        onSaved={reload}
      />
      <CourseStudentsDialog
        key={`students-${studentsDialog.course?.documentId ?? 'none'}-${studentsDialog.open}`}
        open={studentsDialog.open}
        onOpenChange={(open) => setStudentsDialog((prev) => ({ ...prev, open }))}
        course={studentsDialog.course}
      />
    </div>
  );
}
