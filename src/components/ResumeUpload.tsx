import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, X, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ResumeUploadProps {
  onResumeSelect: (resumeUrl: string | null) => void;
  selectedResumeUrl?: string | null;
  required?: boolean;
}

interface SavedResume {
  name: string;
  url: string;
  uploaded_at: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ 
  onResumeSelect, 
  selectedResumeUrl, 
  required = false 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'saved' | 'upload'>('saved');
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [selectedSavedResume, setSelectedSavedResume] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadSavedResumes();
    }
  }, [user]);

  const loadSavedResumes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(user.id, {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading saved resumes:', error);
        return;
      }

      const resumes: SavedResume[] = data?.map(file => ({
        name: file.name,
        url: `${user.id}/${file.name}`,
        uploaded_at: file.created_at
      })) || [];

      setSavedResumes(resumes);
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `resume_${timestamp}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      onResumeSelect(publicUrl);
      loadSavedResumes(); // Refresh the list

      toast({
        title: "Success!",
        description: "Resume uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSavedResumeSelect = (resumeUrl: string) => {
    setSelectedSavedResume(resumeUrl);
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(resumeUrl);
    
    onResumeSelect(publicUrl);
  };

  const downloadResume = (resumeUrl: string, fileName: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(resumeUrl);
    
    const link = document.createElement('a');
    link.href = publicUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Resume {required && <span className="text-red-500 ml-1">*</span>}
        </CardTitle>
        <CardDescription>
          {required 
            ? "A resume is required for this application." 
            : "Optionally attach your resume to strengthen your application."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={uploadMode} onValueChange={(value) => setUploadMode(value as 'saved' | 'upload')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="saved" id="saved" />
            <Label htmlFor="saved">Use saved resume</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload">Upload new resume</Label>
          </div>
        </RadioGroup>

        {uploadMode === 'saved' && (
          <div className="space-y-2">
            {savedResumes.length > 0 ? (
              <div className="space-y-2">
                {savedResumes.map((resume) => (
                  <div
                    key={resume.url}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSavedResume === resume.url
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSavedResumeSelect(resume.url)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{resume.name}</span>
                        {selectedSavedResume === resume.url && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadResume(resume.url, resume.name);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-gray-500">
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No saved resumes found. Upload one below or create one using our Resume Builder.
              </p>
            )}
          </div>
        )}

        {uploadMode === 'upload' && (
          <div className="space-y-2">
            <Label htmlFor="resume-upload">Upload Resume</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> your resume
                  </p>
                  <p className="text-xs text-gray-500">PDF or DOC/DOCX (MAX. 5MB)</p>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <p className="text-sm text-blue-600 text-center">Uploading resume...</p>
            )}
          </div>
        )}

        {selectedResumeUrl && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Resume selected</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onResumeSelect(null);
                  setSelectedSavedResume('');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;