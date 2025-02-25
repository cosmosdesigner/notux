import { FilePlus } from 'lucide-react';
import { NotesList } from '../components/NotesList';
import { Button } from '../components/ui/button';
import { useNotes } from '../hooks/useNotes';

export function Home() {
  const { notes, createNote, deleteNote, isLoading } = useNotes();

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button
          onClick={createNote}
          className="flex items-center space-x-2"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          <span>New Note</span>
        </Button>
      </div>
      <NotesList notes={notes} onDelete={deleteNote} />
    </div>
  );
}