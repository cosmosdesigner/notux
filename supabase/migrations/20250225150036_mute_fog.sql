/*
  # Update GUID format
  
  1. Changes
    - Add trigger to ensure GUID is set using nanoid format instead of UUID
  
  2. Security
    - Maintains existing RLS policies
*/

-- Create function to generate nanoid-style GUID
CREATE OR REPLACE FUNCTION generate_guid()
RETURNS text AS $$
BEGIN
  -- Generate a 21-character nanoid-style string
  RETURN SUBSTRING(encode(gen_random_bytes(16), 'base64') FROM 1 FOR 21);
END;
$$ LANGUAGE plpgsql;

-- Update guid column to use text type
ALTER TABLE notes 
ALTER COLUMN guid TYPE text USING guid::text;

-- Create function to ensure note guid
CREATE OR REPLACE FUNCTION ensure_note_guid()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.guid IS NULL THEN
    NEW.guid = generate_guid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set guid
DROP TRIGGER IF EXISTS set_note_guid ON notes;
CREATE TRIGGER set_note_guid
  BEFORE INSERT ON notes
  FOR EACH ROW
  EXECUTE FUNCTION ensure_note_guid();