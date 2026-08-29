# LMS Frontend

Next.js frontend for a Learning Management System: browse and enroll in courses, learn lesson by lesson, track progress, take auto-graded quizzes and read the blog.

- Live app: https://lms-fe-nine-ivory.vercel.app
- Backend repo: https://github.com/TanvirSEF/lms-be
- Backend live: https://lms-be-production-39f4.up.railway.app

## Tech

- Next.js (App Router, TypeScript, server components for public pages)
- Tailwind CSS + shadcn/ui
- lucide-react icons

## Features

- Auth: register (joins as student), login, role-aware navbar, protected pages
- Courses: public browse + detail (SSR), enroll flow, cover image upload
- Learning: course player with lesson sequence, text and video lessons (upload or URL), mark complete
- Progress: per course percent, persisted per student, visible in My Courses and the dashboard
- Quizzes: MCQ taking, instant score, per question review, retake, attempt history
- Manage panel: courses, lessons and quizzes CRUD for instructors (own) and admins / CMs (all)
  - admins / CMs can assign an instructor when creating or editing a course
  - enrolled students list with per-student progress percent (instructors see their own courses)
- Blog: published list + single post (SSR, public), draft / publish workflow for admins / CMs
- Admin panel: platform stats and user role management (admin only)

## Pages

| Route | Description |
| --- | --- |
| `/` | landing |
| `/courses`, `/courses/[documentId]` | public course browse and detail |
| `/my-courses`, `/my-courses/[documentId]` | enrolled courses and the course player |
| `/my-courses/[documentId]/quiz/[quizDocumentId]` | quiz taking and results |
| `/manage` | course / lesson / quiz management |
| `/blog`, `/blog/[documentId]` | public blog |
| `/blog/manage` | blog management (admin / CM) |
| `/admin` | platform stats + user roles (admin) |

## Run locally

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NEXT_PUBLIC_STRAPI_URL` in `.env.local` to the Strapi URL. The app runs on http://localhost:3000.

## Demo accounts

All passwords are `test1234`: `admin1`, `cm1`, `instructor1`, `ltest1`, `student1`, `student2`. See the backend README for what each role can do.
