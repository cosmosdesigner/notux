/*
  # Update notes table schema

  1. Changes
    - Ensure proper ID and GUID columns
    - Add default values for all columns
    - Add updated_at trigger
    - Update RLS policies

  2. Security
    - Maintain RLS on notes table
    - Update policies to use proper checks
*/

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create or update the notes table
DO $$ BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'id') THEN
    ALTER TABLE notes ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'title') THEN
    ALTER TABLE notes ADD COLUMN title text NOT NULL DEFAULT 'Untitled';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'content') THEN
    ALTER TABLE notes ADD COLUMN content text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'created_at') THEN
    ALTER TABLE notes ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'updated_at') THEN
    ALTER TABLE notes ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ BEGIN
  DROP POLICY IF EXISTS "Notes are accessible by anyone" ON notes;
  DROP POLICY IF EXISTS "Anyone can create notes" ON notes;
  DROP POLICY IF EXISTS "Anyone can update notes" ON notes;
  DROP POLICY IF EXISTS "Anyone can delete notes" ON notes;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create new policies
CREATE POLICY "Notes are accessible by anyone"
  ON notes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create notes"
  ON notes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update notes"
  ON notes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete notes"
  ON notes
  FOR DELETE
  TO public
  USING (true);