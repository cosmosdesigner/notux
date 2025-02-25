import { supabase } from '../lib/supabase';
import type { Note } from '../types';
import { nanoid } from 'nanoid';


export async function fetchNotes() {
  const { data } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
  
  return data || [];
}

export async function fetchNoteByGuid(guid: string) {
  const { data } = await supabase
    .from('notes')
    .select('*')
    .eq('guid', guid)
    .single();
  
  return data;
}

export async function createNote() {
  const { data, error } = await supabase
    .from('notes')
    .insert([{
      id: crypto.randomUUID(),
      guid: nanoid(),
      content: ''
    }])
    .select()
    .single();

  return { data, error };
}

export async function deleteNote(guid: string) {
  return await supabase
    .from('notes')
    .delete()
    .eq('guid', guid);
}

export async function updateNoteTitle(guid: string, title: string) {
  return await supabase
    .from('notes')
    .update({ title })
    .eq('guid', guid);
}

export async function updateNoteContent(guid: string, content: string) {
  return await supabase
    .from('notes')
    .update({ content })
    .eq('guid', guid);
}