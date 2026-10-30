-- 20241030_02_allow_multiple_attempts.sql
-- Allow multiple attempts per user-test pair and add attempt_number
DROP INDEX IF EXISTS attempts_user_test_unique;

ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS attempt_number integer NOT NULL DEFAULT 1;

-- Existing rows get attempt_number = 1 (already default)
UPDATE public.test_attempts
SET attempt_number = 1
WHERE attempt_number IS NULL;
