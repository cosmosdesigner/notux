import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Editor } from '../components/Editor';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNote } from '../hooks/useNote';

export function Note() {
  const { id: guid } = useParams<{ id: string }>();
  const { note, title, isLoading, updateTitle } = useNote(guid);

  if (isLoading || !note) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="pl-0 hover:pl-2 transition-all"
        >
          <Link
          to="/"
          className="inline-flex items-center"
          >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to notes
          </Link>
        </Button>
      </div>
      <Input
        type="text"
        value={title}
        onChange={(e) => updateTitle(e.target.value)}
        placeholder="Untitled"
        className="text-3xl font-bold mb-8 w-full bg-transparent border-none px-0 h-auto focus-visible:ring-0"
      />
      <Editor noteId={note.id} initialContent={note.content} />
    </div>
  );
}