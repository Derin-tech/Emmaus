-- ============================================================
-- Chemistry Educator Portal — Initial Schema Migration
-- ============================================================
-- Tables: notes, videos, pyqs, practice_sheets, doubts, announcements
-- Storage: buckets for PDFs and attachments
-- Auth: role-based profiles
-- RLS: per-table policies for students and professors
-- ============================================================

-- ─── Enable required extensions ───────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Custom Types ──────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE exam_type AS ENUM (
    'jee-main',
    'jee-advanced',
    'neet',
    'net',
    'msc-entrance'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE announcement_category AS ENUM ('general', 'exam', 'resource', 'schedule');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Profiles Table ────────────────────────────────────────
-- Extends Supabase auth.users with role information
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'professor')),
  display_name TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Extended user profiles with role information (student or professor)';

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── Notes Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notes (
  id             TEXT PRIMARY KEY DEFAULT ('note-' || gen_random_uuid()::text),
  course         exam_type NOT NULL,
  subject        TEXT NOT NULL,
  chapter        TEXT NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  file_url       TEXT NOT NULL DEFAULT '',
  file_size      TEXT NOT NULL DEFAULT '',
  download_count INTEGER NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notes IS 'Study notes and lecture PDFs organized by course and chapter';
CREATE INDEX IF NOT EXISTS notes_course_idx ON public.notes(course);
CREATE INDEX IF NOT EXISTS notes_subject_idx ON public.notes(subject);

-- ─── Videos Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.videos (
  id           TEXT PRIMARY KEY DEFAULT ('vid-' || gen_random_uuid()::text),
  course       exam_type NOT NULL,
  subject      TEXT NOT NULL,
  chapter      TEXT NOT NULL,
  title        TEXT NOT NULL,
  youtube_link TEXT NOT NULL,
  thumbnail    TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  duration     TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.videos IS 'YouTube video lectures organized by course and chapter';
CREATE INDEX IF NOT EXISTS videos_course_idx ON public.videos(course);

-- ─── PYQs Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pyqs (
  id             TEXT PRIMARY KEY DEFAULT ('pyq-' || gen_random_uuid()::text),
  course         exam_type NOT NULL,
  subject        TEXT NOT NULL,
  chapter        TEXT NOT NULL,
  year           INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2100),
  difficulty     difficulty_level NOT NULL DEFAULT 'Medium',
  question_url   TEXT NOT NULL DEFAULT '',
  solution_url   TEXT NOT NULL DEFAULT '',
  question_size  TEXT NOT NULL DEFAULT '',
  solution_size  TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.pyqs IS 'Previous Year Questions with difficulty ratings and file links';
CREATE INDEX IF NOT EXISTS pyqs_course_idx ON public.pyqs(course);
CREATE INDEX IF NOT EXISTS pyqs_year_idx ON public.pyqs(year DESC);

-- ─── Practice Sheets Table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.practice_sheets (
  id          TEXT PRIMARY KEY DEFAULT ('ps-' || gen_random_uuid()::text),
  course      exam_type NOT NULL,
  subject     TEXT NOT NULL,
  chapter     TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_url    TEXT NOT NULL DEFAULT '',
  file_size   TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.practice_sheets IS 'Practice worksheets and drill sets organized by course';
CREATE INDEX IF NOT EXISTS practice_sheets_course_idx ON public.practice_sheets(course);

-- ─── Doubts Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.doubts (
  id              TEXT PRIMARY KEY DEFAULT ('doubt-' || gen_random_uuid()::text),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  subject         TEXT NOT NULL,
  question        TEXT NOT NULL,
  attachment_name TEXT,
  attachment_url  TEXT,
  answer_text     TEXT,
  is_answered     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.doubts IS 'Student doubt submissions and professor replies';
CREATE INDEX IF NOT EXISTS doubts_is_answered_idx ON public.doubts(is_answered);
CREATE INDEX IF NOT EXISTS doubts_created_at_idx ON public.doubts(created_at DESC);

-- ─── Announcements Table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id         TEXT PRIMARY KEY DEFAULT ('ann-' || gen_random_uuid()::text),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  category   announcement_category NOT NULL DEFAULT 'general',
  pinned     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.announcements IS 'Professor announcements with category and pin support';
CREATE INDEX IF NOT EXISTS announcements_pinned_idx ON public.announcements(pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS announcements_category_idx ON public.announcements(category);

-- ─── Updated_at Trigger Function ───────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all tables
DO $$ 
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','notes','videos','pyqs','practice_sheets','doubts','announcements']
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
    ', t, t);
  END LOOP;
END $$;

-- ─── Row Level Security ────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper function: is the current user a professor?
CREATE OR REPLACE FUNCTION public.is_professor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'professor'
  );
$$;

-- ── Profiles RLS ──
-- Users can view their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- ── Notes RLS ──
-- Anyone (including unauthenticated) can read notes
CREATE POLICY "notes_public_read"
  ON public.notes FOR SELECT
  USING (TRUE);

-- Only professors can insert/update/delete notes
CREATE POLICY "notes_professor_insert"
  ON public.notes FOR INSERT TO authenticated
  WITH CHECK (public.is_professor());

CREATE POLICY "notes_professor_update"
  ON public.notes FOR UPDATE TO authenticated
  USING (public.is_professor());

CREATE POLICY "notes_professor_delete"
  ON public.notes FOR DELETE TO authenticated
  USING (public.is_professor());

-- ── Videos RLS ──
CREATE POLICY "videos_public_read"
  ON public.videos FOR SELECT
  USING (TRUE);

CREATE POLICY "videos_professor_insert"
  ON public.videos FOR INSERT
  WITH CHECK (public.is_professor());

CREATE POLICY "videos_professor_update"
  ON public.videos FOR UPDATE
  USING (public.is_professor());

CREATE POLICY "videos_professor_delete"
  ON public.videos FOR DELETE
  USING (public.is_professor());

-- ── PYQs RLS ──
CREATE POLICY "pyqs_public_read"
  ON public.pyqs FOR SELECT
  USING (TRUE);

CREATE POLICY "pyqs_professor_insert"
  ON public.pyqs FOR INSERT
  WITH CHECK (public.is_professor());

CREATE POLICY "pyqs_professor_update"
  ON public.pyqs FOR UPDATE
  USING (public.is_professor());

CREATE POLICY "pyqs_professor_delete"
  ON public.pyqs FOR DELETE
  USING (public.is_professor());

-- ── Practice Sheets RLS ──
CREATE POLICY "practice_sheets_public_read"
  ON public.practice_sheets FOR SELECT
  USING (TRUE);

CREATE POLICY "practice_sheets_professor_insert"
  ON public.practice_sheets FOR INSERT
  WITH CHECK (public.is_professor());

CREATE POLICY "practice_sheets_professor_update"
  ON public.practice_sheets FOR UPDATE
  USING (public.is_professor());

CREATE POLICY "practice_sheets_professor_delete"
  ON public.practice_sheets FOR DELETE
  USING (public.is_professor());

-- ── Doubts RLS ──
-- Anyone can read all doubts (public Q&A)
CREATE POLICY "doubts_public_read"
  ON public.doubts FOR SELECT
  USING (TRUE);

-- Anyone can submit a doubt (no auth required)
CREATE POLICY "doubts_public_insert"
  ON public.doubts FOR INSERT
  WITH CHECK (TRUE);

-- Only professors can update doubts (to answer them)
CREATE POLICY "doubts_professor_update"
  ON public.doubts FOR UPDATE
  USING (public.is_professor());

-- Only professors can delete doubts
CREATE POLICY "doubts_professor_delete"
  ON public.doubts FOR DELETE
  USING (public.is_professor());

-- ── Announcements RLS ──
CREATE POLICY "announcements_public_read"
  ON public.announcements FOR SELECT
  USING (TRUE);

CREATE POLICY "announcements_professor_insert"
  ON public.announcements FOR INSERT
  WITH CHECK (public.is_professor());

CREATE POLICY "announcements_professor_update"
  ON public.announcements FOR UPDATE
  USING (public.is_professor());

CREATE POLICY "announcements_professor_delete"
  ON public.announcements FOR DELETE
  USING (public.is_professor());

-- ─── Storage Buckets ───────────────────────────────────────
-- Notes PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notes-pdfs',
  'notes-pdfs',
  TRUE,
  52428800, -- 50 MB
  ARRAY['application/pdf', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Practice Sheets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'practice-sheets',
  'practice-sheets',
  TRUE,
  52428800,
  ARRAY['application/pdf', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- PYQs (question papers and solutions)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pyqs',
  'pyqs',
  TRUE,
  52428800,
  ARRAY['application/pdf', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Student doubt attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  TRUE,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ─── Storage RLS Policies ──────────────────────────────────

-- notes-pdfs: public read, professor write
CREATE POLICY "notes_pdfs_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notes-pdfs');

CREATE POLICY "notes_pdfs_professor_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'notes-pdfs' AND public.is_professor());

CREATE POLICY "notes_pdfs_professor_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'notes-pdfs' AND public.is_professor());

CREATE POLICY "notes_pdfs_professor_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'notes-pdfs' AND public.is_professor());

-- practice-sheets: public read, professor write
CREATE POLICY "practice_sheets_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'practice-sheets');

CREATE POLICY "practice_sheets_storage_professor_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'practice-sheets' AND public.is_professor());

CREATE POLICY "practice_sheets_storage_professor_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'practice-sheets' AND public.is_professor());

CREATE POLICY "practice_sheets_storage_professor_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'practice-sheets' AND public.is_professor());

-- pyqs: public read, professor write
CREATE POLICY "pyqs_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pyqs');

CREATE POLICY "pyqs_storage_professor_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pyqs' AND public.is_professor());

CREATE POLICY "pyqs_storage_professor_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'pyqs' AND public.is_professor());

CREATE POLICY "pyqs_storage_professor_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'pyqs' AND public.is_professor());

-- attachments: public read, anyone can upload (doubt submissions)
CREATE POLICY "attachments_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'attachments');

CREATE POLICY "attachments_public_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "attachments_professor_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'attachments' AND public.is_professor());

CREATE POLICY "attachments_professor_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND public.is_professor());
