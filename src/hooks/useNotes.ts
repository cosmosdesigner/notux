import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { fetchNotes, createNote, deleteNote } from '../services/notes';
import { useNavigate } from 'react-router-dom';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchNotes();
    setNotes(data);
    setIsLoading(false);
  }, []);

  const handleCreateNote = useCallback(async () => {
    const { data, error } = await createNote();
    if (data && !error) {
      navigate(`/notes/${data.guid}`);
    }
  }, [navigate]);

  const handleDeleteNote = useCallback(async (guid: string) => {
    await deleteNote(guid);
    setNotes(notes => notes.filter(note => note.guid !== guid));
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    isLoading,
    createNote: handleCreateNote,
    deleteNote: handleDeleteNote,
    refreshNotes: loadNotes
  };
}