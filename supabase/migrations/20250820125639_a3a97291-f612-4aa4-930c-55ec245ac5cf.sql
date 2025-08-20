-- Fix resume storage access issues

-- Ensure the resumes bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Create comprehensive storage policies for resumes
DELETE FROM storage.objects WHERE bucket_id = 'resumes'; -- Clean up any existing policies

-- Policy: Anyone can view resumes (for organizations reviewing applications)
CREATE POLICY "Public resume access" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');

-- Policy: Users can upload their own resumes
CREATE POLICY "Users can upload own resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own resumes
CREATE POLICY "Users can update own resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own resumes
CREATE POLICY "Users can delete own resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);