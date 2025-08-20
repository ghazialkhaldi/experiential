-- Make the resumes bucket public so resumes can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'resumes';

-- Drop existing policy if it exists and create new ones
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Organizations can view resumes for their applications" ON storage.objects;

-- Create RLS policies for the resumes bucket to allow viewing
CREATE POLICY "Organizations can view resumes for their applications" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  EXISTS (
    SELECT 1 FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.id
    JOIN organizations org ON o.organization_id = org.id
    WHERE org.user_id = auth.uid()
    AND a.resume_url LIKE '%' || name || '%'
  )
);

CREATE POLICY "Users can view their own resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);