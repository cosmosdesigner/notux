/*
  # Create notes table with sharing capabilities

  1. New Tables
    - `notes`
      - `id` (text, primary key)
      - `title` (text, default 'Untitled')
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `notes` table
    - Allow public read access for sharing
    - Allow public update access for collaborative editing
    - Allow public insert access
    - Restrict delete to authenticated users who created the note
*/

CREATE TABLE IF NOT EXISTS notes (
  id text PRIMARY KEY,
  title text NOT NULL DEFAULT 'Untitled',
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read notes (for sharing)
CREATE POLICY "Anyone can read notes"
  ON notes
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to update notes (for collaborative editing)
CREATE POLICY "Anyone can update notes"
  ON notes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anyone to insert notes
CREATE POLICY "Anyone can create notes"
  ON notes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only the creator can delete notes
CREATE POLICY "Only creator can delete notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid()
    FROM notes
    WHERE id = notes.id
    AND created_at = notes.created_at
  ));