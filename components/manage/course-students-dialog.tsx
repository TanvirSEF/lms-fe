'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { fetchCourseStudents, type CourseStudents } from '@/lib/manage';

export function CourseStudentsDialog({
  open,
  onOpenChange,
  course,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: { documentId: string; title: string } | null;
}) {
  const [data, setData] = useState<CourseStudents | null>(null);

  useEffect(() => {
    if (!course) return;

    fetchCourseStudents(course.documentId)
      .then(setData)
      .catch(() => setData({ total: 0, students: [] }));
  }, [course]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enrolled students</DialogTitle>
          <DialogDescription>{course?.title}</DialogDescription>
        </DialogHeader>

        {!data ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : data.students.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="size-6 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              No students enrolled in this course yet.
            </p>
          </div>
        ) : (
          <ul className="flex max-h-[60svh] flex-col gap-4 overflow-y-auto py-1">
            {data.students.map((student) => (
              <li key={student.documentId} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{student.username}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {student.percent}%
                  </span>
                </div>
                <Progress value={student.percent} />
                <p className="text-xs text-muted-foreground">
                  {student.completed} of {data.total} lessons completed · enrolled{' '}
                  {new Date(student.enrolledAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
