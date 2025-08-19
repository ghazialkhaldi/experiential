-- Add resume requirement field to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN resume_required BOOLEAN DEFAULT false;

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

-- Create policies for resume uploads
CREATE POLICY "Users can upload their own resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Organizations can view resumes for their opportunity applications" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  EXISTS (
    SELECT 1 FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.id
    JOIN organizations org ON o.organization_id = org.id
    WHERE org.user_id = auth.uid()
    AND a.user_id::text = (storage.foldername(name))[1]
  )
);

-- Add resume_url field to applications table
ALTER TABLE public.applications 
ADD COLUMN resume_url TEXT;