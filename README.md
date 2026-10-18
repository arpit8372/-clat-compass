# CLAT Compass 🧭

**CLAT Compass** is a production-ready personal CLAT (Common Law Admission Test) practice and mock-test web application designed for one dedicated student and one administrator. 

It provides an authentic, high-speed practice environment inspired by national computer-based test (CBT) engines like Testbook and NTA, tailored specifically to the passage-dense format of the CLAT Consortium examinations.

---

## 🌟 Key Features

1. **Realistic Split-Screen CBT Mock Engine (`/mocks`, `/attempts/[attemptId]`)**:
   - Split-screen workspace: Reading passage on the left with font resizing controls (`A-`, `A`, `A+`) and clean vertical scrolling; Question and options on the right.
   - 5-State Question Palette:
     - 🟢 **Answered**
     - 🔴 **Not Answered**
     - 🟣 **Marked for Review**
     - 🔵 **Answered & Marked for Review**
     - ⚪ **Not Visited**
   - Active countdown timer with low-time notifications and automatic submission upon timer expiration.
   - Immediate answer masking during exam: Correctness is kept strictly hidden until final submission.
   - Pre-submission summary modal displaying questions answered, unanswered, marked, and unvisited.

2. **Instant Feedback Practice Mode (`/practice`, `/practice/[attemptId]`)**:
   - Answer revelation immediately upon selecting an option (+1.0 for correct, -0.25 for incorrect).
   - In-depth analytical solutions and legal principles displayed instantly.
   - Filter questions by CLAT subject: *Legal Reasoning*, *English Language*, *Logical Reasoning*, *Current Affairs & GK*, and *Quantitative Techniques*.

3. **Official PYQ Archive (`/pyq`)**:
   - Organized past year question sets (e.g. CLAT 2024, 2023).
   - Dual-mode launch: Take under timed CBT exam conditions or solve in step-by-step practice mode.

4. **Detailed Scorecards & Analytics (`/results/[attemptId]`)**:
   - Comprehensive score (+1 for correct, -0.25 penalty for incorrect, 0 for unattempted).
   - Accuracy percentage and total exam time spent.
   - Sectional performance breakdown bar charts across all 5 syllabus areas.
   - Full question-by-question review with filters for *Incorrect Answers*, *Correct Answers*, and *Unattempted*.

5. **Personal Bookmarks & Targeted Revision (`/bookmarks`, `/revision`)**:
   - Save tricky questions with custom notes and tags (`#important-principle`, `#repeated-mistake`).
   - Launch targeted revision sessions that compile bookmarked questions for active spaced recall.

6. **Admin Studio (`/admin`, `/admin/questions`, `/admin/passages`, `/admin/tests`, `/admin/import`, `/admin/users`)**:
   - **Question Bank**: Create, edit, and delete questions with marking weights and options.
   - **Passage Management**: Create rich text passages, assign sources, and link to questions.
   - **Test Assembler**: Create 120-minute mocks or sectional tests.
   - **Bulk JSON Import**: Paste arrays of questions for instantaneous bulk ingestion.
   - **Student Provisioning**: Create student accounts with password credentials (public signup is disabled).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 App Router with TypeScript
- **Styling**: Tailwind CSS with custom legal compass palette and accessible UI components
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS)
- **Sessions & SSR**: `@supabase/ssr` cookies and Next.js Server Actions
- **Icons**: Lucide React
- **Testing**: Vitest with unit tests covering CLAT scoring calculations, CBT palette transitions, and role authorization guards

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm or yarn

### 2. Installation
```bash
git clone <your-repo-url>
cd "vdp edot"
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: CLAT Compass includes a built-in preview/offline fallback. If Supabase keys are not set yet, you can still run `npm run dev` and explore all student and admin routes using sample mock data.

### 4. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Run the schema migration committed at:
   ```
   supabase/migrations/20240101000000_create_clat_compass_schema.sql
   ```
4. Run the realistic CLAT seed script at:
   ```
   supabase/seed.sql
   ```

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Safe Account Provisioning Guide

### Creating the First Administrator Account
Because public signup is disabled to preserve private access, create your administrator account safely:

1. In Supabase Dashboard, go to **Authentication** -> **Users** -> **Add user**.
2. Create a user (e.g., `admin@clatcompass.com`) with a secure password and confirm their email.
3. In the Supabase **SQL Editor**, run the following query to elevate the user's role to `admin`:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'admin@clatcompass.com';
   ```

### Provisioning the Student Account
1. Log in as Administrator at `/login`.
2. Navigate to **Admin Studio** -> **Provision Students** (`/admin/users`).
3. Enter the student's Name, Email, and temporary password.
4. Click **Provision Student**. The student's account is automatically created in Supabase Auth and assigned the `student` role.
5. The student can now sign in at `/login`.

---

## 🧪 Running Automated Tests

Run the test suite using Vitest:
```bash
npm test
```

The test suite verifies:
- CLAT scoring calculation (+1.0 for correct, -0.25 penalty for wrong answers, 0 for unattempted).
- Sectional breakdown scoring and accuracy calculation.
- CBT Question Palette 5-state transitions (Not Visited, Not Answered, Answered, Marked, Answered & Marked).
- Practice mode immediate evaluation and explanation exposure.
- Mock mode answer masking during active test attempts.
- Role authorization guards preventing non-admins from mutating questions or student profiles.

---

## 🌐 Deploying to Vercel

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial CLAT Compass commit"
   git remote add origin https://github.com/<your-username>/clat-compass.git
   git push -u origin main
   ```

2. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
3. Import your `clat-compass` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Keep secure, server-only)
   - `NEXT_PUBLIC_SITE_URL` (Set to your production Vercel URL, e.g. `https://clat-compass.vercel.app`)
5. Click **Deploy**. Vercel will automatically build the Next.js App Router application.
