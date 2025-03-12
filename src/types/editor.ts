import { ReactNode } from 'react';

export interface EditorProps {
  noteId: string;
  guid?: string;
  initialContent: string;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
}