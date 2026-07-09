-- ============================================================
-- Development Override Migration: Relax RLS Policies
-- ============================================================
-- Since the application does not have a formal authentication
-- flow yet (role selection happens via a UI toggle), auth.uid()
-- is NULL. This blocks uploads and inserts due to the
-- "is_professor()" checks.
--
-- This migration updates the table and storage policies to
-- allow public (anonymous) inserts and updates so the UI can
-- be tested without hitting "new row violates row-level security policy".
-- ============================================================

-- 1. Relax Table Policies

-- Notes
DROP POLICY IF EXISTS "notes_professor_insert" ON public.notes;
DROP POLICY IF EXISTS "notes_professor_update" ON public.notes;
DROP POLICY IF EXISTS "notes_professor_delete" ON public.notes;

CREATE POLICY "notes_public_insert" ON public.notes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "notes_public_update" ON public.notes FOR UPDATE USING (TRUE);
CREATE POLICY "notes_public_delete" ON public.notes FOR DELETE USING (TRUE);

-- Videos
DROP POLICY IF EXISTS "videos_professor_insert" ON public.videos;
DROP POLICY IF EXISTS "videos_professor_update" ON public.videos;
DROP POLICY IF EXISTS "videos_professor_delete" ON public.videos;

CREATE POLICY "videos_public_insert" ON public.videos FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "videos_public_update" ON public.videos FOR UPDATE USING (TRUE);
CREATE POLICY "videos_public_delete" ON public.videos FOR DELETE USING (TRUE);

-- PYQs
DROP POLICY IF EXISTS "pyqs_professor_insert" ON public.pyqs;
DROP POLICY IF EXISTS "pyqs_professor_update" ON public.pyqs;
DROP POLICY IF EXISTS "pyqs_professor_delete" ON public.pyqs;

CREATE POLICY "pyqs_public_insert" ON public.pyqs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "pyqs_public_update" ON public.pyqs FOR UPDATE USING (TRUE);
CREATE POLICY "pyqs_public_delete" ON public.pyqs FOR DELETE USING (TRUE);

-- Practice Sheets
DROP POLICY IF EXISTS "practice_sheets_professor_insert" ON public.practice_sheets;
DROP POLICY IF EXISTS "practice_sheets_professor_update" ON public.practice_sheets;
DROP POLICY IF EXISTS "practice_sheets_professor_delete" ON public.practice_sheets;

CREATE POLICY "practice_sheets_public_insert" ON public.practice_sheets FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "practice_sheets_public_update" ON public.practice_sheets FOR UPDATE USING (TRUE);
CREATE POLICY "practice_sheets_public_delete" ON public.practice_sheets FOR DELETE USING (TRUE);

-- Announcements
DROP POLICY IF EXISTS "announcements_professor_insert" ON public.announcements;
DROP POLICY IF EXISTS "announcements_professor_update" ON public.announcements;
DROP POLICY IF EXISTS "announcements_professor_delete" ON public.announcements;

CREATE POLICY "announcements_public_insert" ON public.announcements FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "announcements_public_update" ON public.announcements FOR UPDATE USING (TRUE);
CREATE POLICY "announcements_public_delete" ON public.announcements FOR DELETE USING (TRUE);

-- Doubts (Professors answer doubts, which involves UPDATE)
DROP POLICY IF EXISTS "doubts_professor_update" ON public.doubts;
DROP POLICY IF EXISTS "doubts_professor_delete" ON public.doubts;

CREATE POLICY "doubts_public_update" ON public.doubts FOR UPDATE USING (TRUE);
CREATE POLICY "doubts_public_delete" ON public.doubts FOR DELETE USING (TRUE);


-- 2. Relax Storage Bucket Policies

-- notes-pdfs
DROP POLICY IF EXISTS "notes_pdfs_professor_insert" ON storage.objects;
DROP POLICY IF EXISTS "notes_pdfs_professor_update" ON storage.objects;
DROP POLICY IF EXISTS "notes_pdfs_professor_delete" ON storage.objects;

CREATE POLICY "notes_pdfs_public_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes-pdfs');
CREATE POLICY "notes_pdfs_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'notes-pdfs');
CREATE POLICY "notes_pdfs_public_delete" ON storage.objects FOR DELETE USING (bucket_id = 'notes-pdfs');

-- practice-sheets
DROP POLICY IF EXISTS "practice_sheets_storage_professor_insert" ON storage.objects;
DROP POLICY IF EXISTS "practice_sheets_storage_professor_update" ON storage.objects;
DROP POLICY IF EXISTS "practice_sheets_storage_professor_delete" ON storage.objects;

CREATE POLICY "practice_sheets_storage_public_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'practice-sheets');
CREATE POLICY "practice_sheets_storage_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'practice-sheets');
CREATE POLICY "practice_sheets_storage_public_delete" ON storage.objects FOR DELETE USING (bucket_id = 'practice-sheets');

-- pyqs
DROP POLICY IF EXISTS "pyqs_storage_professor_insert" ON storage.objects;
DROP POLICY IF EXISTS "pyqs_storage_professor_update" ON storage.objects;
DROP POLICY IF EXISTS "pyqs_storage_professor_delete" ON storage.objects;

CREATE POLICY "pyqs_storage_public_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pyqs');
CREATE POLICY "pyqs_storage_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'pyqs');
CREATE POLICY "pyqs_storage_public_delete" ON storage.objects FOR DELETE USING (bucket_id = 'pyqs');

-- attachments
DROP POLICY IF EXISTS "attachments_professor_update" ON storage.objects;
DROP POLICY IF EXISTS "attachments_professor_delete" ON storage.objects;

CREATE POLICY "attachments_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'attachments');
CREATE POLICY "attachments_public_delete" ON storage.objects FOR DELETE USING (bucket_id = 'attachments');
