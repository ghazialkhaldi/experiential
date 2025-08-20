-- Fix storage policies correctly and add real-time updates

-- Drop any conflicting policies first
DROP POLICY IF EXISTS "Public resume access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own resumes" ON storage.objects;

-- Create correct storage policies for resume access
CREATE POLICY "Resume public access" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Resume upload by owner" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Resume update by owner" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Resume delete by owner" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add real-time subscription for applications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;