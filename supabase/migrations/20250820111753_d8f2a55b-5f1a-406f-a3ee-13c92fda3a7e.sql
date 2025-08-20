-- Ensure resumes bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- Create RLS policies for resume storage
CREATE POLICY "Users can upload their own resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Organizations can view resumes in applications" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  EXISTS (
    SELECT 1 FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.id
    JOIN organizations org ON o.organization_id = org.id
    WHERE a.resume_url LIKE '%' || name || '%'
    AND org.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own resumes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);