import { Link } from 'react-router-dom';
import { FileText, Share2, Trash2 } from 'lucide-react';
import { NotesListProps } from '../types/components';
import { Button } from './ui/button';
import { useClipboard } from '../hooks/useClipboard';

export function NotesList({ notes, onDelete }: NotesListProps) {
  const { copySuccess, copyToClipboard } = useClipboard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div key={note.guid} className="group bg-card text-card-foreground p-6 rounded-lg border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between mb-2">
            <Link to={`/notes/${note.guid}`} className="flex items-center space-x-2 font-medium hover:text-primary">
              <FileText className="w-4 h-4" />
              <h3 className="truncate">{note.title || 'Untitled'}</h3>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(`${window.location.origin}/notes/${note.guid}`, note.guid)}
                title="Share note"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(note.guid)}
                title="Delete note"
                className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(note.updated_at).toLocaleDateString()}
          </p>
          {copySuccess === note.guid && (
            <p className="text-sm text-primary mt-2">Link copied!</p>
          )}
        </div>
      ))}
    </div>
  );
}