import { Note } from './notes';

export interface NotesListProps {
  notes: Note[];
  onDelete: (guid: string) => void;
}