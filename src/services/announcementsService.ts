/**
 * Announcements service — CRUD for professor announcements.
 */
import { supabase } from '../lib/supabase';
import type { TablesUpdate } from '../types/database';
import type { Announcement, AnnouncementCategory } from '../types';

function rowToAnnouncement(row: {
  id: string;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  created_at: string;
}): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category as AnnouncementCategory,
    pinned: row.pinned,
    createdAt: row.created_at,
  };
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchAnnouncements: ${error.message}`);
  return (data ?? []).map(rowToAnnouncement);
}

export async function createAnnouncement(
  ann: Omit<Announcement, 'id' | 'createdAt'>
): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      title: ann.title,
      body: ann.body,
      category: ann.category,
      pinned: ann.pinned,
    })
    .select()
    .single();

  if (error) throw new Error(`createAnnouncement: ${error.message}`);
  return rowToAnnouncement(data);
}

export async function updateAnnouncement(
  id: string,
  fields: Partial<Omit<Announcement, 'id' | 'createdAt'>>
): Promise<Announcement> {
  const payload: TablesUpdate<'announcements'> = {};
  if (fields.title !== undefined) payload.title = fields.title;
  if (fields.body !== undefined) payload.body = fields.body;
  if (fields.category !== undefined) payload.category = fields.category;
  if (fields.pinned !== undefined) payload.pinned = fields.pinned;

  const { data, error } = await supabase
    .from('announcements')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateAnnouncement: ${error.message}`);
  return rowToAnnouncement(data);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw new Error(`deleteAnnouncement: ${error.message}`);
}

export async function togglePinAnnouncement(
  id: string,
  currentPinned: boolean
): Promise<Announcement> {
  return updateAnnouncement(id, { pinned: !currentPinned });
}
