/*
  # Add character creation policy (if not exists)
  
  1. Changes
    - Adds INSERT policy for authenticated users to create their own characters
    - Uses DO block to check policy existence before creation
  
  2. Security
    - Ensures authenticated users can only create characters with their own user_id
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE tablename = 'characters' 
    AND policyname = 'Users can create their own characters'
  ) THEN
    CREATE POLICY "Users can create their own characters"
      ON characters
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;