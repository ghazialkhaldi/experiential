import { ArrowLeft, Download, Upload, FileText, GraduationCap, Briefcase, Award, Plus, Save, Eye, Trash2, Edit3, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useResumes, ResumeSection, SavedResume } from '@/hooks/useResumes';
import { PageShell } from '@/components/layout/PageShell';
import { toast as notify } from '@/hooks/use-toast';

// Adapter so existing toast.success / toast.error calls use the app toaster.
const toast = {
  success: (title: string) => notify({ title }),
  error: (title: string) => notify({ title, variant: 'destructive' }),
};

const ResumeBuilder = () => {
  const { user } = useAuth();
  const { resumes: savedResumes, saveResume: saveResumeToDb, deleteResume: deleteResumeFromDb, getResume, loading } = useResumes();
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState("My Resume");
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([
    {
      id: '1',
      type: 'personal',
      title: 'Personal Information',
      data: {
        fullName: '',
        email: '',
        phone: '',
        address: ''
      }
    },
    {
      id: '2',
      type: 'statement',
      title: 'Personal Statement',
      data: {
        statement: ''
      }
    },
    {
      id: '3',
      type: 'education',
      title: 'Education',
      data: []
    },
    {
      id: '4',
      type: 'experience',
      title: 'Work Experience',
      data: []
    },
    {
      id: '5',
      type: 'skills',
      title: 'Skills & Strengths',
      data: []
    },
    {
      id: '6',
      type: 'achievements',
      title: 'Achievements & Awards',
      data: []
    }
  ]);

  const [previewMode, setPreviewMode] = useState(false);
  const [showResumeManager, setShowResumeManager] = useState(false);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'personal' ? {
        ...section,
        data: { ...section.data, [field]: value }
      } : section
    ));
  };

  const updatePersonalStatement = (value: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'statement' ? {
        ...section,
        data: { statement: value }
      } : section
    ));
  };

  const addEducationEntry = (type: 'university' | 'highschool') => {
    const newEntry = {
      id: Date.now().toString(),
      type,
      institution: '',
      degree: type === 'university' ? '' : 'High School Diploma',
      field: '',
      graduationYear: '',
      gpa: ''
    };
    
    setResumeSections(prev => prev.map(section => 
      section.type === 'education' ? {
        ...section,
        data: [...section.data, newEntry]
      } : section
    ));
  };

  const addExperienceEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    
    setResumeSections(prev => prev.map(section => 
      section.type === 'experience' ? {
        ...section,
        data: [...section.data, newEntry]
      } : section
    ));
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    };
    
    setResumeSections(prev => prev.map(section => 
      section.type === 'skills' ? {
        ...section,
        data: [...section.data, newSkill]
      } : section
    ));
  };

  const addAchievement = () => {
    const newAchievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: ''
    };
    
    setResumeSections(prev => prev.map(section => 
      section.type === 'achievements' ? {
        ...section,
        data: [...section.data, newAchievement]
      } : section
    ));
  };

  const deleteEducationEntry = (entryId: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'education' ? {
        ...section,
        data: section.data.filter((entry: any) => entry.id !== entryId)
      } : section
    ));
  };

  const deleteExperienceEntry = (entryId: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'experience' ? {
        ...section,
        data: section.data.filter((entry: any) => entry.id !== entryId)
      } : section
    ));
  };

  const deleteSkillEntry = (entryId: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'skills' ? {
        ...section,
        data: section.data.filter((entry: any) => entry.id !== entryId)
      } : section
    ));
  };

  const deleteAchievementEntry = (entryId: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'achievements' ? {
        ...section,
        data: section.data.filter((entry: any) => entry.id !== entryId)
      } : section
    ));
  };

  const saveResume = async () => {
    if (!user) {
      toast.error("Please log in to save your resume");
      return;
    }

    try {
      const savedResume = await saveResumeToDb(resumeName, resumeSections, currentResumeId || undefined);
      setCurrentResumeId(savedResume.id);
      toast.success("Resume saved");
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error("Failed to save resume");
    }
  };

  const loadResume = async (resume: SavedResume) => {
    setResumeSections(resume.sections);
    setResumeName(resume.name);
    setCurrentResumeId(resume.id);
    setShowResumeManager(false);
  };

  const deleteResume = async (resumeId: string) => {
    try {
      await deleteResumeFromDb(resumeId);
      if (currentResumeId === resumeId) {
        setCurrentResumeId(null);
        setResumeName("My Resume");
        // Reset to default sections
        setResumeSections([
          {
            id: '1',
            type: 'personal',
            title: 'Personal Information',
            data: { fullName: '', email: '', phone: '', address: '' }
          },
          {
            id: '2',
            type: 'statement',
            title: 'Personal Statement',
            data: { statement: '' }
          },
          {
            id: '3',
            type: 'education',
            title: 'Education',
            data: []
          },
          {
            id: '4',
            type: 'experience',
            title: 'Work Experience',
            data: []
          },
          {
            id: '5',
            type: 'skills',
            title: 'Skills & Strengths',
            data: []
          },
          {
            id: '6',
            type: 'achievements',
            title: 'Achievements & Awards',
            data: []
          }
        ]);
      }
      toast.success("Resume deleted");
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error("Failed to delete resume");
    }
  };

  const createNewResume = () => {
    setResumeSections([
      {
        id: '1',
        type: 'personal',
        title: 'Personal Information',
        data: { fullName: '', email: '', phone: '', address: '' }
      },
      {
        id: '2',
        type: 'statement',
        title: 'Personal Statement',
        data: { statement: '' }
      },
      {
        id: '3',
        type: 'education',
        title: 'Education',
        data: []
      },
      {
        id: '4',
        type: 'experience',
        title: 'Work Experience',
        data: []
      },
      {
        id: '5',
        type: 'skills',
        title: 'Skills & Strengths',
        data: []
      },
      {
        id: '6',
        type: 'achievements',
        title: 'Achievements & Awards',
        data: []
      }
    ]);
    setResumeName("New Resume");
    setCurrentResumeId(null);
    setShowResumeManager(false);
  };

  const deleteSection = (sectionId: string) => {
    setResumeSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const saveResumeToStorage = async () => {
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
    const personalInfo = resumeSections.find(s => s.type === 'personal')?.data || {};
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
    const personalStatement = resumeSections.find(s => s.type === 'statement')?.data || {};
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
    const education = resumeSections.find(s => s.type === 'education')?.data || [];
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
    const experience = resumeSections.find(s => s.type === 'experience')?.data || [];
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
    const skills = resumeSections.find(s => s.type === 'skills')?.data || [];
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
    const achievements = resumeSections.find(s => s.type === 'achievements')?.data || [];
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
    
    // Save to Supabase storage for use in applications
    const pdfBlob = pdf.output('blob');
    const timestamp = Date.now();
    const filePath = `${user.id}/resume_${timestamp}.pdf`;
    
    
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, pdfBlob);
    
    if (error) {
      console.error('Error saving resume to storage:', error);
      throw error;
    }
    
    return data;
  };

  const downloadResume = async () => {
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
    const personalInfo = resumeSections.find(s => s.type === 'personal')?.data || {};
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
    const personalStatement = resumeSections.find(s => s.type === 'statement')?.data || {};
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
    const education = resumeSections.find(s => s.type === 'education')?.data || [];
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
    const experience = resumeSections.find(s => s.type === 'experience')?.data || [];
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
    const skills = resumeSections.find(s => s.type === 'skills')?.data || [];
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
    const achievements = resumeSections.find(s => s.type === 'achievements')?.data || [];
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
    
    // Save the PDF locally
    const fileName = `${personalInfo.fullName ? personalInfo.fullName.replace(/\s+/g, '_') : resumeName.replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);

    // Also save to Supabase storage for use in applications
    try {
      if (user) {
        await saveResumeToStorage();
      }
    } catch (error) {
      console.error('Error saving resume to storage:', error);
    }
  };

  const personalInfo = resumeSections.find(s => s.type === 'personal')?.data || {};
  const personalStatement = resumeSections.find(s => s.type === 'statement')?.data || {};
  const education = resumeSections.find(s => s.type === 'education')?.data || [];
  const experience = resumeSections.find(s => s.type === 'experience')?.data || [];
  const skills = resumeSections.find(s => s.type === 'skills')?.data || [];
  const achievements = resumeSections.find(s => s.type === 'achievements')?.data || [];

  if (previewMode) {
    return (
      <PageShell width="narrow">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setPreviewMode(false)}>
            <ArrowLeft />
            Back to editor
          </Button>
          <Button onClick={downloadResume}>
            <Download />
            Download PDF
          </Button>
        </div>
        {/* Resume Preview */}
        <div>
          <div className="mx-auto max-w-[8.5in] rounded-sm border border-border bg-white p-8 text-neutral-900 shadow-lift sm:p-12">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
              <div className="text-gray-600 space-y-1">
                <p>{personalInfo.email}</p>
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.address}</p>
              </div>
              {personalStatement.statement && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-gray-700 italic">{personalStatement.statement}</p>
                </div>
              )}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-neutral-900 mb-3 flex items-center border-b border-neutral-200 pb-1">
                  <GraduationCap className={`hidden text-neutral-500`} />
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className={`border-l-4 border-neutral-300 pl-4`}>
                      <h3 className="font-semibold text-lg">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      <p className="text-gray-600">Class of {edu.graduationYear} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-neutral-900 mb-3 flex items-center border-b border-neutral-200 pb-1">
                  <Briefcase className={`hidden text-neutral-500`} />
                  Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className={`border-l-4 border-neutral-300 pl-4`}>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                      <p className="text-gray-600 mb-2">{exp.startDate} - {exp.endDate}</p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-neutral-900 mb-3 flex items-center border-b border-neutral-200 pb-1">
                  <Star className={`hidden text-neutral-500`} />
                  Skills
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill: any) => (
                    <div key={skill.id} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      <p className="text-sm text-gray-600">{skill.level}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mb-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-neutral-900 mb-3 flex items-center border-b border-neutral-200 pb-1">
                  <Award className={`hidden text-neutral-500`} />
                  Awards and achievements
                </h2>
                <div className="space-y-3">
                  {achievements.map((achievement: any) => (
                    <div key={achievement.id} className={`border-l-4 border-neutral-300 pl-4`}>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-gray-700">{achievement.description}</p>
                      <p className="text-gray-600 text-sm">{achievement.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell width="narrow">
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-semibold leading-tight md:text-[2.125rem]">Resume builder</h1>
          <p className="mt-2 text-muted-foreground">Fill in the sections, preview, and download a clean one-page PDF.</p>
        </div>
        <div className="sticky top-16 z-20 -mx-4 flex flex-wrap items-center gap-2 border-y border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:bg-card sm:shadow-card">
          <Label htmlFor="resume-name" className="sr-only">Resume name</Label>
          <Input
            id="resume-name"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            className="h-9 w-full font-medium sm:w-56"
          />
          <div className="flex flex-1 flex-wrap justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowResumeManager(true)}>
              <FileText />
              My resumes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(true)}>
              <Eye />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={downloadResume}>
              <Download />
              PDF
            </Button>
            <Button size="sm" onClick={saveResume}>
              <Save />
              Save
            </Button>
          </div>
        </div>
        {!user && (
          <p className="text-sm text-muted-foreground">
            You can build and download without an account.{' '}
            <Link to="/auth?next=/resume-builder" className="font-semibold text-primary hover:underline">Sign in</Link> to save your work and attach it to applications.
          </p>
        )}
      </div>

      {/* Resume Manager Dialog */}
      <Dialog open={showResumeManager} onOpenChange={setShowResumeManager}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className={`text-foreground flex items-center`}>
              Resume Manager
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Manage your saved resumes and create new ones
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-semibold text-foreground`}>Saved Resumes</h3>
              <Button onClick={createNewResume} >
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {savedResumes.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <FileText className={`h-12 w-12 text-muted-foreground mx-auto mb-4`} />
                  <p className="text-muted-foreground">No saved resumes yet</p>
                  <p className={`text-muted-foreground text-sm`}>Create your first resume to get started</p>
                </div>
              ) : (
                savedResumes.map((resume) => (
                  <Card key={resume.id} className="shadow-none transition-colors hover:border-primary/40">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-foreground text-lg`}>{resume.name}</CardTitle>
                        {currentResumeId === resume.id && (
                          <Badge variant="accent">Current</Badge>
                        )}
                      </div>
                       <CardDescription className={`text-muted-foreground text-sm`}>
                        Last modified: {new Date(resume.updated_at).toLocaleDateString()}
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => loadResume(resume)}
                          size="sm"
                          className="flex-1"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Load
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-muted-foreground hover:border-destructive/40 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent >
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete "{resume.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel >Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteResume(resume.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Builder Form */}
      <section>
        <div className="space-y-6">
          
          {/* Personal Information */}
          <Card >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className={`text-foreground flex items-center`}>
                    Contact details
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    How schools and organizations can reach you.
                  </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-muted-foreground hover:border-destructive/40 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">Delete Section</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to delete this section? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel >Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteSection('1')}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full name"
                  value={personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className={`bg-background border-border text-foreground placeholder:text-muted-foreground`}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                />
                <Input
                  placeholder="Phone"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className={`bg-background border-border text-foreground placeholder:text-muted-foreground`}
                />
                <Input
                  placeholder="City, province or state"
                  value={personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className={`bg-background border-border text-foreground placeholder:text-muted-foreground`}
                />
              </div>
              <Textarea
                placeholder="Objective (optional)"
                value={personalInfo.objective}
                onChange={(e) => updatePersonalInfo('objective', e.target.value)}
                className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className={`text-foreground flex items-center`}>
                    Education
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your high school, and college if you’ve started.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => addEducationEntry('university')} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add college
                  </Button>
                  <Button onClick={() => addEducationEntry('highschool')} size="sm" variant="outline" >
                    <Plus className="h-4 w-4 mr-1" />
                    Add high school
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu: any, index: number) => (
                <div key={edu.id} className={`p-4 bg-muted/50 rounded-lg space-y-3`}>
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant={edu.type === 'university' ? 'accent' : 'muted'}>
                      {edu.type === 'university' ? 'University' : 'High School'}
                    </Badge>
                    <Button
                      onClick={() => deleteEducationEntry(edu.id)}
                      size="sm"
                      variant="outline"
                      className="text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder={edu.type === 'university' ? 'University Name' : 'High School Name'}
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].institution = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder={edu.type === 'university' ? 'Degree' : 'High School Diploma'}
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].degree = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder={edu.type === 'university' ? 'Field of Study' : 'Concentration/Track (Optional)'}
                      value={edu.field}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].field = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder="Graduation year"
                      value={edu.graduationYear}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].graduationYear = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                  </div>
                  <Input
                    placeholder="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].gpa = e.target.value;
                      setResumeSections(prev => prev.map(section => 
                        section.type === 'education' ? { ...section, data: newEducation } : section
                      ));
                    }}
                    className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
              ))}
              {education.length === 0 && (
                <p className={`text-muted-foreground text-center py-4`}>No schools added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Work Experience */}

          <Card >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className={`text-foreground flex items-center`}>
                    Experience
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Jobs, volunteer roles, and leadership positions.
                  </CardDescription>
                </div>
                <Button onClick={addExperienceEntry} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.map((exp: any, index: number) => (
                <div key={exp.id} className={`p-4 bg-muted/50 rounded-lg space-y-3`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`text-foreground font-medium`}>Experience #{index + 1}</h4>
                    <Button
                      onClick={() => deleteExperienceEntry(exp.id)}
                      size="sm"
                      variant="outline"
                      className="text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Organization"
                      value={exp.company}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].company = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder="Role"
                      value={exp.position}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].position = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder="Start (e.g. Sep 2025)"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].startDate = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder="End (or Present)"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].endDate = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                  </div>
                  <Textarea
                    placeholder="What you did, in two or three lines. Start each with a verb: Tutored, Organized, Led."
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...experience];
                      newExperience[index].description = e.target.value;
                      setResumeSections(prev => prev.map(section => 
                        section.type === 'experience' ? { ...section, data: newExperience } : section
                      ));
                    }}
                    className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    rows={3}
                  />
                </div>
              ))}
              {experience.length === 0 && (
                <p className={`text-muted-foreground text-center py-4`}>No experience added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Personal Statement Section */}
          <Card >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className={`text-foreground flex items-center`}>
                    Personal statement
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Two or three sentences on who you are and what you’re working toward.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g. High school junior who has tutored middle-school math every week since grade 9. Planning to study education."
                value={personalStatement.statement}
                onChange={(e) => updatePersonalStatement(e.target.value)}
                className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className={`text-foreground flex items-center`}>
                    Skills
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Languages, tools, and strengths you can back up with an example.
                  </CardDescription>
                </div>
                <Button onClick={addSkill} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill: any, index: number) => (
                <div key={skill.id} className={`p-4 bg-muted/50 rounded-lg space-y-3`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`text-foreground font-medium`}>Skill #{index + 1}</h4>
                    <Button
                      onClick={() => deleteSkillEntry(skill.id)}
                      size="sm"
                      variant="outline"
                      className="text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Skill"
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index].name = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'skills' ? { ...section, data: newSkills } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Select 
                      value={skill.level} 
                      onValueChange={(value) => {
                        const newSkills = [...skills];
                        newSkills[index].level = value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'skills' ? { ...section, data: newSkills } : section
                        ));
                      }}
                    >
                      <SelectTrigger className={`bg-white border-border text-foreground`}>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              {skills.length === 0 && (
                <p className={`text-muted-foreground text-center py-4`}>No skills added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card >
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className={`text-foreground flex items-center`}>
                    Awards and achievements
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Awards, honors, and service milestones.
                  </CardDescription>
                </div>
                <Button onClick={addAchievement} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add award
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement: any, index: number) => (
                <div key={achievement.id} className={`p-4 bg-muted/50 rounded-lg space-y-3`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className={`text-foreground font-medium`}>Achievement #{index + 1}</h4>
                    <Button
                      onClick={() => deleteAchievementEntry(achievement.id)}
                      size="sm"
                      variant="outline"
                      className="text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Award or achievement"
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = [...achievements];
                        newAchievements[index].title = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'achievements' ? { ...section, data: newAchievements } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                    <Input
                      placeholder="Date"
                      value={achievement.date}
                      onChange={(e) => {
                        const newAchievements = [...achievements];
                        newAchievements[index].date = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'achievements' ? { ...section, data: newAchievements } : section
                        ));
                      }}
                      className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    />
                  </div>
                  <Textarea
                    placeholder="One line on what it was for."
                    value={achievement.description}
                    onChange={(e) => {
                      const newAchievements = [...achievements];
                      newAchievements[index].description = e.target.value;
                      setResumeSections(prev => prev.map(section => 
                        section.type === 'achievements' ? { ...section, data: newAchievements } : section
                      ));
                    }}
                    className={`bg-white border-border text-foreground placeholder:text-muted-foreground`}
                    rows={2}
                  />
                </div>
              ))}
              {achievements.length === 0 && (
                <p className={`text-muted-foreground text-center py-4`}>No awards added yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Upload Resume Section */}

        </div>
      </section>
    </PageShell>
  );
};

export default ResumeBuilder;
