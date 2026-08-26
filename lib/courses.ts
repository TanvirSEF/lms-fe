export type Lesson = {
  documentId: string;
  title: string;
  order: number;
};

export type Course = {
  documentId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  instructor: { username: string } | null;
  lessons: Lesson[];
};

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/api/courses`, { cache: 'no-store' });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data;
}

export async function getCourse(documentId: string): Promise<Course | null> {
  const res = await fetch(`${API_URL}/api/courses/${documentId}`, { cache: 'no-store' });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data;
}
