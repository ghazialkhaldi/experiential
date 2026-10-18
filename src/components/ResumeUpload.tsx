import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, X, Download, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useResumes } from '@/hooks/useResumes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';

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
  const { resumes: savedResumes, loading: resumesLoading } = useResumes();
  const [uploading, setUploading] = useState(false);
  const [uploadedResumes, setUploadedResumes] = useState<SavedResume[]>([]);
  const [selectedSavedResume, setSelectedSavedResume] = useState<string>('');
  const [selectedBuiltResume, setSelectedBuiltResume] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadUploadedResumes();
    }
  }, [user]);

  const loadUploadedResumes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(user.id, {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading uploaded resumes:', error);
        return;
      }

      const resumes: SavedResume[] = data?.map(file => ({
        name: file.name,
        url: `${user.id}/${file.name}`,
        uploaded_at: file.created_at
      })) || [];

      setUploadedResumes(resumes);
    } catch (error) {
      console.error('Error loading uploaded resumes:', error);
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
      loadUploadedResumes(); // Refresh the list

      toast({
        title: "Resume uploaded",
        description: "It’s attached to this application."
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
    setSelectedBuiltResume(''); // Clear built resume selection
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(resumeUrl);
    
    onResumeSelect(publicUrl);
  };

  const generateResumeFromData = async (resumeData: any) => {
    const pdf = new jsPDF();
    
    // Set up fonts and colors
    pdf.setFont("helvetica");
    
    let yPosition = 20;
    const lineHeight = 7;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };
    
    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage();
        yPosition = 20;
      }
    };
    
    // Header - Personal Information
    const personalInfo = resumeData.sections.find((s: any) => s.type === 'personal')?.data || {};
    if (personalInfo.fullName) {
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(personalInfo.fullName, margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      if (personalInfo.email) {
        pdf.text(personalInfo.email, margin, yPosition);
        yPosition += lineHeight;
      }
      if (personalInfo.phone) {
        pdf.text(personalInfo.phone, margin, yPosition);
        yPosition += lineHeight;
      }
      if (personalInfo.address) {
        pdf.text(personalInfo.address, margin, yPosition);
        yPosition += lineHeight;
      }
      
      yPosition += 5;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    }
    
    // Personal Statement
    const personalStatement = resumeData.sections.find((s: any) => s.type === 'statement')?.data || {};
    if (personalStatement.statement) {
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("PERSONAL STATEMENT", margin, yPosition);
      yPosition += 8;
      
      yPosition = addWrappedText(personalStatement.statement, margin, yPosition, contentWidth, 10);
      yPosition += 10;
    }
    
    // Education
    const education = resumeData.sections.find((s: any) => s.type === 'education')?.data || [];
    if (education.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("EDUCATION", margin, yPosition);
      yPosition += 8;
      
      education.forEach((edu: any) => {
        checkPageBreak(25);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        
        let educationLine = "";
        if (edu.degree && edu.field) {
          educationLine = `${edu.degree} in ${edu.field}`;
        } else if (edu.degree) {
          educationLine = edu.degree;
        }
        
        if (educationLine) {
          pdf.text(educationLine, margin, yPosition);
          yPosition += lineHeight;
        }
        
        if (edu.institution) {
          pdf.setFont("helvetica", "normal");
          pdf.text(edu.institution, margin, yPosition);
          yPosition += lineHeight;
        }
        
        if (edu.graduationYear || edu.gpa) {
          let gradLine = "";
          if (edu.graduationYear) gradLine += `Class of ${edu.graduationYear}`;
          if (edu.gpa) gradLine += (gradLine ? ` • GPA: ${edu.gpa}` : `GPA: ${edu.gpa}`);
          pdf.text(gradLine, margin, yPosition);
          yPosition += lineHeight;
        }
        
        yPosition += 5;
      });
      yPosition += 5;
    }
    
    // Work Experience
    const experience = resumeData.sections.find((s: any) => s.type === 'experience')?.data || [];
    if (experience.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("WORK EXPERIENCE", margin, yPosition);
      yPosition += 8;
      
      experience.forEach((exp: any) => {
        checkPageBreak(30);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        
        if (exp.position) {
          pdf.text(exp.position, margin, yPosition);
          yPosition += lineHeight;
        }
        
        if (exp.company) {
          pdf.setFont("helvetica", "normal");
          pdf.text(exp.company, margin, yPosition);
          yPosition += lineHeight;
        }
        
        if (exp.startDate || exp.endDate) {
          const dateRange = `${exp.startDate || ''} - ${exp.endDate || ''}`.trim();
          if (dateRange !== '-') {
            pdf.text(dateRange, margin, yPosition);
            yPosition += lineHeight;
          }
        }
        
        if (exp.description) {
          yPosition = addWrappedText(exp.description, margin, yPosition, contentWidth, 10);
        }
        
        yPosition += 8;
      });
    }
    
    // Skills
    const skills = resumeData.sections.find((s: any) => s.type === 'skills')?.data || [];
    if (skills.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("SKILLS & STRENGTHS", margin, yPosition);
      yPosition += 8;
      
      skills.forEach((skill: any) => {
        checkPageBreak(10);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        if (skill.name && skill.level) {
          pdf.text(`• ${skill.name} - ${skill.level}`, margin, yPosition);
          yPosition += lineHeight;
        } else if (skill.name) {
          pdf.text(`• ${skill.name}`, margin, yPosition);
          yPosition += lineHeight;
        }
      });
      yPosition += 5;
    }
    
    // Achievements
    const achievements = resumeData.sections.find((s: any) => s.type === 'achievements')?.data || [];
    if (achievements.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("ACHIEVEMENTS & AWARDS", margin, yPosition);
      yPosition += 8;
      
      achievements.forEach((achievement: any) => {
        checkPageBreak(25);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        
        if (achievement.title) {
          pdf.text(achievement.title, margin, yPosition);
          yPosition += lineHeight;
        }
        
        if (achievement.date) {
          pdf.setFont("helvetica", "normal");
          pdf.text(achievement.date, margin, yPosition);
          yPosition += lineHeight;
        }
        
        if (achievement.description) {
          yPosition = addWrappedText(achievement.description, margin, yPosition, contentWidth, 10);
        }
        
        yPosition += 8;
      });
    }
    
    return pdf;
  };

  const handleBuiltResumeSelect = async (resumeId: string) => {
    setSelectedBuiltResume(resumeId);
    setSelectedSavedResume(''); // Clear uploaded resume selection
    
    try {
      const selectedResume = savedResumes.find(r => r.id === resumeId);
      if (!selectedResume) return;

      // Generate PDF from resume data
      const pdf = await generateResumeFromData(selectedResume);
      const pdfBlob = pdf.output('blob');
      
      // Upload the generated PDF to storage
      const timestamp = Date.now();
      const fileName = `${selectedResume.name.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      const filePath = `${user!.id}/temp_${fileName}`;

      const { error } = await supabase.storage
        .from('resumes')
        .upload(filePath, pdfBlob);

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      onResumeSelect(publicUrl);
      
      toast({
        title: "Resume Generated",
        description: "Your resume has been generated and is ready for application."
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume from your saved data.",
        variant: "destructive"
      });
    }
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
    <fieldset className="rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-medium">
        Resume {required ? <span className="text-destructive">(required)</span> : <span className="font-normal text-muted-foreground">(optional)</span>}
      </legend>
      <div>
        <Tabs defaultValue="built" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="built">From builder</TabsTrigger>
            <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
            <TabsTrigger value="upload">Upload new</TabsTrigger>
          </TabsList>
          
          <TabsContent value="built" className="space-y-4">
            {resumesLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading…</p>
            ) : savedResumes.length > 0 ? (
              <div className="space-y-2">
                {savedResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedBuiltResume === resume.id
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-primary/40'
                    }`}
                    onClick={() => handleBuiltResumeSelect(resume.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleBuiltResumeSelect(resume.id))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{resume.name}</span>
                        {selectedBuiltResume === resume.id && (
                          <Check className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">You haven’t built a resume yet.</p>
                <Link to="/resume-builder">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Build a resume
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="uploaded" className="space-y-4">
            {uploadedResumes.length > 0 ? (
              <div className="space-y-2">
                {uploadedResumes.map((resume) => (
                  <div
                    key={resume.url}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSavedResume === resume.url
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-primary/40'
                    }`}
                    onClick={() => handleSavedResumeSelect(resume.url)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleSavedResumeSelect(resume.url))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{resume.name}</span>
                        {selectedSavedResume === resume.url && (
                          <Check className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Download ${resume.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadResume(resume.url, resume.name);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No uploaded files yet.
              </p>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-upload">Upload Resume</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer bg-muted/40 transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> your resume
                    </p>
                    <p className="text-xs text-muted-foreground">PDF or DOC/DOCX (MAX. 5MB)</p>
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
                <p className="text-sm text-primary text-center" role="status">Uploading…</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {selectedResumeUrl && (
          <div className="p-3 bg-success-soft rounded-md mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Resume attached</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Remove attached resume"
                onClick={() => {
                  onResumeSelect(null);
                  setSelectedSavedResume('');
                  setSelectedBuiltResume('');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default ResumeUpload;