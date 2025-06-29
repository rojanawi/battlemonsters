/*
  # Character System Schema

  1. New Tables
    - `characters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `character_name` (text)
      - `description` (text)
      - `hp` (integer)
      - `energy` (integer)
      - `mana` (integer)
      - `powers` (jsonb)
      - `image_prompt` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `characters` table
    - Add policies for authenticated users to:
      - Create their own characters
      - Read their own characters
*/

CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  character_name text NOT NULL,
  description text NOT NULL,
  hp integer NOT NULL,
  energy integer NOT NULL,
  mana integer NOT NULL,
  powers jsonb NOT NULL,
  image_prompt text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own characters"
  ON characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own characters"
  ON characters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);