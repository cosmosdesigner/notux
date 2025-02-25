import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { fetchNoteByGuid, updateNoteTitle } from '../services/notes';

export function useNote(guid: string | undefined) {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadNote = useCallback(async (noteGuid: string) => {
    setIsLoading(true);
    const data = await fetchNoteByGuid(noteGuid);
    if (data) {
      setNote(data);
      setTitle(data.title);
    }
    setIsLoading(false);
  }, []);

  const updateTitle = useCallback(async (newTitle: string) => {
    if (!guid) return;
    setTitle(newTitle);
    await updateNoteTitle(guid, newTitle);
  }, [guid]);

  useEffect(() => {
    if (guid) {
      loadNote(guid);
    }
  }, [guid, loadNote]);

  return {
    note,
    title,
    isLoading,
    updateTitle
  };
}