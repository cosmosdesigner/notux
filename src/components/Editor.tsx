import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useState, useRef } from 'react';
import { Bold, Italic, List, Heading1, Heading2, Code, Quote, Undo, Redo, Eye, Edit2 } from 'lucide-react';
import { debounce } from '../utils/debounce';
import { Button } from './ui/button';
import { EditorProps, ToolbarButtonProps } from '../types/editor';
import { cn } from '../lib/utils';
import { updateNoteContent } from '../services/notes';

function ToolbarButton({ onClick, icon, label, isActive }: ToolbarButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 px-2 lg:px-3",
        isActive && "bg-muted"
      )}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export function Editor({ noteId, guid, initialContent }: EditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const saveContent = useCallback(
    debounce(async (content: string) => {
      await updateNoteContent(guid, content);
    }, 1000),
    [guid]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      saveContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-lg border shadow-sm">
      <div className="border-b mb-4 pb-2 flex items-center gap-0.5 overflow-x-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="h-4 w-4" />}
          label="Bold"
          isActive={editor.isActive('bold')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="h-4 w-4" />}
          label="Italic"
          isActive={editor.isActive('italic')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={<Heading1 className="h-4 w-4" />}
          label="Heading 1"
          isActive={editor.isActive('heading', { level: 1 })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={<Heading2 className="h-4 w-4" />}
          label="Heading 2"
          isActive={editor.isActive('heading', { level: 2 })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List className="h-4 w-4" />}
          label="Bullet List"
          isActive={editor.isActive('bulletList')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={<Code className="h-4 w-4" />}
          label="Code Block"
          isActive={editor.isActive('codeBlock')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote className="h-4 w-4" />}
          label="Quote"
          isActive={editor.isActive('blockquote')}
        />
        <div className="flex-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={<Undo className="h-4 w-4" />}
          label="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={<Redo className="h-4 w-4" />}
          label="Redo"
        />
        <div className="w-px h-4 bg-border mx-2" />
        <ToolbarButton
          onClick={() => setIsPreview(!isPreview)}
          icon={isPreview ? <Edit2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          label={isPreview ? "Edit" : "Preview"}
          isActive={isPreview}
        />
      </div>
      <div className={cn(
        "prose focus:outline-none min-h-[200px]",
        isPreview && "prose-sm"
      )}>
        {isPreview ? (
          <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}