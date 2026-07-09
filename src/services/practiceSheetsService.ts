/**
 * Practice Sheets service — all CRUD operations for the practice_sheets table.
 */
import { supabase } from '../lib/supabase';
import type { TablesUpdate } from '../types/database';
import type { PracticeSheet, ExamType } from '../types';

function rowToSheet(row: {
  id: string;
  course: string;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  file_url: string;
  file_size: string;
}): PracticeSheet {
  return {
    id: row.id,
    course: row.course as ExamType,
    subject: row.subject,
    chapter: row.chapter,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    fileSize: row.file_size,
  };
}

export async function fetchPracticeSheets(): Promise<PracticeSheet[]> {
  const { data, error } = await supabase
    .from('practice_sheets')
    .select('*')
    .order('course', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw new Error(`fetchPracticeSheets: ${error.message}`);
  return (data ?? []).map(rowToSheet);
}

export async function createPracticeSheet(
  sheet: Omit<PracticeSheet, 'id' | 'fileSize'>
): Promise<PracticeSheet> {
  const { data, error } = await supabase
    .from('practice_sheets')
    .insert({
      course: sheet.course,
      subject: sheet.subject,
      chapter: sheet.chapter,
      title: sheet.title,
      description: sheet.description,
      file_url: sheet.fileUrl,
      file_size: '',
    })
    .select()
    .single();

  if (error) throw new Error(`createPracticeSheet: ${error.message}`);
  return rowToSheet(data);
}

export async function updatePracticeSheet(
  id: string,
  fields: Partial<Omit<PracticeSheet, 'id'>>
): Promise<PracticeSheet> {
  const payload: TablesUpdate<'practice_sheets'> = {};
  if (fields.course !== undefined) payload.course = fields.course;
  if (fields.subject !== undefined) payload.subject = fields.subject;
  if (fields.chapter !== undefined) payload.chapter = fields.chapter;
  if (fields.title !== undefined) payload.title = fields.title;
  if (fields.description !== undefined) payload.description = fields.description;
  if (fields.fileUrl !== undefined) payload.file_url = fields.fileUrl;
  if (fields.fileSize !== undefined) payload.file_size = fields.fileSize;

  const { data, error } = await supabase
    .from('practice_sheets')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updatePracticeSheet: ${error.message}`);
  return rowToSheet(data);
}

export async function deletePracticeSheet(id: string): Promise<void> {
  const { error } = await supabase.from('practice_sheets').delete().eq('id', id);
  if (error) throw new Error(`deletePracticeSheet: ${error.message}`);
}
