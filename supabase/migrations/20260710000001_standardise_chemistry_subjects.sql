-- ============================================================
-- Chemistry Educator Portal — Subject Standardisation Migration
-- ============================================================
-- Purpose:
--   1. Add a new ENUM type `chemistry_subject` with only the three
--      valid chemistry subjects.
--   2. Migrate all existing data so every subject column contains one
--      of those three values (unknown values → 'Physical Chemistry').
--   3. Replace the old free-text `subject TEXT` columns with the new
--      constrained ENUM type on notes, videos, pyqs, practice_sheets.
--
-- Safety:
--   - All changes are wrapped in DO blocks with EXCEPTION handlers.
--   - Existing data is preserved; only the subject field is normalised.
--   - The migration is idempotent (safe to run more than once).
-- ============================================================

-- ─── 1. Create the new ENUM type (idempotent) ──────────────────────────
DO $$ BEGIN
  CREATE TYPE chemistry_subject AS ENUM (
    'Physical Chemistry',
    'Organic Chemistry',
    'Inorganic Chemistry'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 2. Normalise existing data BEFORE changing column types ───────────
--
-- Mapping logic (as requested):
--   'chemistry'            → 'Physical Chemistry'
--   'Chemistry'            → 'Physical Chemistry'
--   'Mathematics'          → 'Physical Chemistry'
--   'Physics'              → 'Physical Chemistry'
--   'Biology'              → 'Physical Chemistry'
--   'dv'                   → 'Physical Chemistry'
--   'Mathematical Chemistry' → 'Physical Chemistry'
--   'Classical Mechanics'  → 'Physical Chemistry'
--   Any other unknown value → 'Physical Chemistry'
--   (valid values are left as-is)

-- notes
UPDATE public.notes
SET subject = CASE
  WHEN subject IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry')
    THEN subject
  ELSE 'Physical Chemistry'
END
WHERE subject NOT IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry');

-- videos
UPDATE public.videos
SET subject = CASE
  WHEN subject IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry')
    THEN subject
  ELSE 'Physical Chemistry'
END
WHERE subject NOT IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry');

-- pyqs
UPDATE public.pyqs
SET subject = CASE
  WHEN subject IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry')
    THEN subject
  ELSE 'Physical Chemistry'
END
WHERE subject NOT IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry');

-- practice_sheets
UPDATE public.practice_sheets
SET subject = CASE
  WHEN subject IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry')
    THEN subject
  ELSE 'Physical Chemistry'
END
WHERE subject NOT IN ('Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry');

-- ─── 3. Alter column types from TEXT → chemistry_subject ENUM ──────────

-- notes.subject
ALTER TABLE public.notes
  ALTER COLUMN subject TYPE chemistry_subject
  USING subject::chemistry_subject;

-- videos.subject
ALTER TABLE public.videos
  ALTER COLUMN subject TYPE chemistry_subject
  USING subject::chemistry_subject;

-- pyqs.subject
ALTER TABLE public.pyqs
  ALTER COLUMN subject TYPE chemistry_subject
  USING subject::chemistry_subject;

-- practice_sheets.subject
ALTER TABLE public.practice_sheets
  ALTER COLUMN subject TYPE chemistry_subject
  USING subject::chemistry_subject;

-- ─── 4. Add default value for safety ───────────────────────────────────
ALTER TABLE public.notes          ALTER COLUMN subject SET DEFAULT 'Physical Chemistry'::chemistry_subject;
ALTER TABLE public.videos         ALTER COLUMN subject SET DEFAULT 'Physical Chemistry'::chemistry_subject;
ALTER TABLE public.pyqs           ALTER COLUMN subject SET DEFAULT 'Physical Chemistry'::chemistry_subject;
ALTER TABLE public.practice_sheets ALTER COLUMN subject SET DEFAULT 'Physical Chemistry'::chemistry_subject;

-- ─── 5. Verification queries (commented out — run manually if needed) ──
-- SELECT DISTINCT subject FROM public.notes;
-- SELECT DISTINCT subject FROM public.videos;
-- SELECT DISTINCT subject FROM public.pyqs;
-- SELECT DISTINCT subject FROM public.practice_sheets;
