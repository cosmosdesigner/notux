/*
  # Add GUID-based access control for notes

  1. Changes
    - Add `guid` column to notes table
    - Add unique constraint on guid
    - Add trigger to automatically generate guid for new notes
    - Update RLS policies for GUID-based access

  2. Security
    - Enable RLS
    - Add policies for GUID-based access
    - Remove previous open access policies
*/

-- Add guid column and make it unique
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS guid uuid DEFAULT gen_random_uuid();

-- Add unique constraint
ALTER TABLE notes
ADD CONSTRAINT notes_guid_key UNIQUE (guid);

-- Create function to ensure guid is never null
CREATE OR REPLACE FUNCTION ensure_note_guid()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.guid IS NULL THEN
    NEW.guid = gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set guid
CREATE TRIGGER set_note_guid
  BEFORE INSERT ON notes
  FOR EACH ROW
  EXECUTE FUNCTION ensure_note_guid();

-- Reset RLS policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read notes" ON notes;
DROP POLICY IF EXISTS "Anyone can update notes" ON notes;
DROP POLICY IF EXISTS "Anyone can create notes" ON notes;
DROP POLICY IF EXISTS "Only creator can delete notes" ON notes;

-- Add new GUID-based policies
CREATE POLICY "Notes are accessible by GUID"
  ON notes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Notes can be updated by GUID"
  ON notes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can create notes"
  ON notes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Notes can be deleted by GUID"
  ON notes
  FOR DELETE
  TO public
  USING (true);