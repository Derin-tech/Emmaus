/**
 * Doubts service — submit, reply, and manage doubt tickets.
 * Students can insert without auth; professors can update/delete.
 */
import { supabase } from '../lib/supabase';
import type { Doubt } from '../types';

function rowToDoubt(row: {
  id: string;
  name: string;
  email: string;
  subject: string;
  question: string;
  attachment_name: string | null;
  attachment_url: string | null;
  answer_text: string | null;
  is_answered: boolean;
  created_at: string;
}): Doubt {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    question: row.question,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    answerText: row.answer_text ?? undefined,
    isAnswered: row.is_answered,
    createdAt: row.created_at,
  };
}

export async function fetchDoubts(): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from('doubts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchDoubts: ${error.message}`);
  return (data ?? []).map(rowToDoubt);
}

/** Submit a new doubt. No auth required (RLS allows public insert). */
export async function submitDoubt(
  doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt' | 'answerText'>
): Promise<Doubt> {
  const { data, error } = await supabase
    .from('doubts')
    .insert({
      name: doubt.name,
      email: doubt.email,
      subject: doubt.subject,
      question: doubt.question,
      attachment_name: doubt.attachmentName ?? null,
      attachment_url: doubt.attachmentUrl ?? null,
      is_answered: false,
    })
    .select()
    .single();

  if (error) throw new Error(`submitDoubt: ${error.message}`);
  return rowToDoubt(data);
}

/** Professor replies to a doubt — marks it as answered. */
export async function replyToDoubt(id: string, answerText: string): Promise<Doubt> {
  const { data, error } = await supabase
    .from('doubts')
    .update({
      answer_text: answerText,
      is_answered: true,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`replyToDoubt: ${error.message}`);
  return rowToDoubt(data);
}

/** Delete a doubt by id (professor only). */
export async function deleteDoubt(id: string): Promise<void> {
  const { error } = await supabase.from('doubts').delete().eq('id', id);
  if (error) throw new Error(`deleteDoubt: ${error.message}`);
}

/**
 * Upload an attachment file for a doubt submission.
 * Returns the public URL of the uploaded file.
 */
export async function uploadDoubtAttachment(file: File): Promise<{ url: string; name: string }> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('attachments')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`uploadDoubtAttachment: ${error.message}`);

  const { data } = supabase.storage.from('attachments').getPublicUrl(filename);
  return { url: data.publicUrl, name: file.name };
}
