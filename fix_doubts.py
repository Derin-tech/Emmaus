import re

with open('src/services/doubtsService.ts', 'r') as f:
    content = f.read()

# Replace rowToDoubt to include replies
row_to_doubt_repl = """function rowToDoubt(row: any): Doubt {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    question: row.question,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    isAnswered: row.is_answered,
    createdAt: row.created_at,
    replies: row.doubt_replies ? row.doubt_replies.map((reply: any) => ({
      id: reply.id,
      doubt_id: reply.doubt_id,
      professor_id: reply.professor_id,
      reply_text: reply.reply_text,
      image_urls: reply.image_urls || [],
      video_urls: reply.video_urls || [],
      audio_urls: reply.audio_urls || [],
      attachment_urls: reply.attachment_urls || [],
      created_at: reply.created_at,
      updated_at: reply.updated_at,
      is_edited: reply.is_edited,
      reply_order: reply.reply_order
    })).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : []
  };
}"""

content = re.sub(r'function rowToDoubt\(row:.*?\}\): Doubt \{.*?\}', row_to_doubt_repl, content, flags=re.DOTALL)

# Update fetchDoubts
fetch_doubts_repl = """export async function fetchDoubts(): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from('doubts')
    .select('*, doubt_replies(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchDoubts: ${error.message}`);
  return (data ?? []).map(rowToDoubt);
}"""

content = re.sub(r'export async function fetchDoubts\(\): Promise<Doubt\[\]> \{.*?\}', fetch_doubts_repl, content, flags=re.DOTALL)


# Update submitDoubt to remove answerText
submit_doubt_repl = """export async function submitDoubt(
  doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt' | 'replies'>
): Promise<Doubt> {"""

content = re.sub(r"export async function submitDoubt\([\s\S]*?\): Promise<Doubt> \{", submit_doubt_repl, content)


# Add new replyToDoubt function with multimedia
reply_to_doubt_repl = """export async function replyToDoubt(
  doubtId: string, 
  professorId: string, 
  replyData: {
    reply_text?: string;
    image_urls?: string[];
    video_urls?: string[];
    audio_urls?: string[];
    attachment_urls?: string[];
  }
): Promise<any> {
  const { data, error } = await supabase
    .from('doubt_replies')
    .insert({
      doubt_id: doubtId,
      professor_id: professorId,
      reply_text: replyData.reply_text || null,
      image_urls: replyData.image_urls || [],
      video_urls: replyData.video_urls || [],
      audio_urls: replyData.audio_urls || [],
      attachment_urls: replyData.attachment_urls || []
    })
    .select()
    .single();

  if (error) throw new Error(`replyToDoubt: ${error.message}`);
  
  // Mark doubt as answered
  await supabase.from('doubts').update({ is_answered: true }).eq('id', doubtId);
  
  return data;
}"""

content = re.sub(r"export async function replyToDoubt.*?\{[\s\S]*?return rowToDoubt\(data\);\n\}", reply_to_doubt_repl, content)

with open('src/services/doubtsService.ts', 'w') as f:
    f.write(content)
