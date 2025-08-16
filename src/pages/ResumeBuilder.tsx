import { ArrowLeft, Download, Upload, FileText, User, GraduationCap, Briefcase, Award, Plus, Save, Eye, Trash2, Edit3, Star, Target } from "lucide-react";
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
import { useMode } from "@/contexts/ModeContext";

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'achievements' | 'statement';
  title: string;
  data: any;
}

interface SavedResume {
  id: string;
  name: string;
  sections: ResumeSection[];
  lastModified: string;
}

const ResumeBuilder = () => {
  const { isInternshipMode } = useMode();
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
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

  // Load saved resumes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedResumes');
    if (saved) {
      setSavedResumes(JSON.parse(saved));
    }
  }, []);
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

  const saveResume = () => {
    const newResume: SavedResume = {
      id: currentResumeId || Date.now().toString(),
      name: resumeName,
      sections: resumeSections,
      lastModified: new Date().toISOString()
    };
    
    const updatedResumes = currentResumeId 
      ? savedResumes.map(r => r.id === currentResumeId ? newResume : r)
      : [...savedResumes, newResume];
    
    setSavedResumes(updatedResumes);
    setCurrentResumeId(newResume.id);
    localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));
    alert("Resume saved successfully!");
  };

  const loadResume = (resume: SavedResume) => {
    setResumeSections(resume.sections);
    setResumeName(resume.name);
    setCurrentResumeId(resume.id);
    setShowResumeManager(false);
  };

  const deleteResume = (resumeId: string) => {
    const updatedResumes = savedResumes.filter(r => r.id !== resumeId);
    setSavedResumes(updatedResumes);
    localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));
    if (currentResumeId === resumeId) {
      setCurrentResumeId(null);
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

  const downloadResume = () => {
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
    
    // Save the PDF
    const fileName = `${personalInfo.fullName ? personalInfo.fullName.replace(/\s+/g, '_') : resumeName.replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);
  };

  const personalInfo = resumeSections.find(s => s.type === 'personal')?.data || {};
  const personalStatement = resumeSections.find(s => s.type === 'statement')?.data || {};
  const education = resumeSections.find(s => s.type === 'education')?.data || [];
  const experience = resumeSections.find(s => s.type === 'experience')?.data || [];
  const skills = resumeSections.find(s => s.type === 'skills')?.data || [];
  const achievements = resumeSections.find(s => s.type === 'achievements')?.data || [];

  if (previewMode) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setPreviewMode(false)}
            className={`${isInternshipMode ? 'text-gray-300 hover:text-white bg-gray-800/90 hover:bg-gray-800 shadow-lg shadow-purple-500/40' : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-lg'} backdrop-blur-sm`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Resume Preview */}
        <div className="py-8 px-4">
          <div className={`max-w-4xl mx-auto ${isInternshipMode ? 'bg-white' : 'bg-white'} rounded-lg shadow-2xl p-8 text-gray-900`}>
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
              <div className="text-gray-600 space-y-1">
                <p>{personalInfo.email || 'your.email@example.com'}</p>
                <p>{personalInfo.phone || '(555) 123-4567'}</p>
                <p>{personalInfo.address || 'Your Address'}</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-purple-600' : 'text-blue-600'}`} />
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className={`border-l-4 ${isInternshipMode ? 'border-purple-600' : 'border-blue-600'} pl-4`}>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-purple-600' : 'text-blue-600'}`} />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className={`border-l-4 ${isInternshipMode ? 'border-purple-600' : 'border-blue-600'} pl-4`}>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Star className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-purple-600' : 'text-blue-600'}`} />
                  Skills & Strengths
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-purple-600' : 'text-blue-600'}`} />
                  Achievements & Awards
                </h2>
                <div className="space-y-3">
                  {achievements.map((achievement: any) => (
                    <div key={achievement.id} className={`border-l-4 ${isInternshipMode ? 'border-purple-600' : 'border-blue-600'} pl-4`}>
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
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => window.history.back()}
          className={`${isInternshipMode ? 'text-gray-300 hover:text-white bg-gray-800/90 hover:bg-gray-800 shadow-lg shadow-purple-500/40' : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-lg'} backdrop-blur-sm`}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className={`absolute inset-0 ${isInternshipMode ? 'bg-gradient-to-b from-purple-500/20 via-purple-600/10 to-gray-900' : 'bg-gradient-to-b from-blue-500/20 via-blue-600/10 to-white'}`}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className={`text-6xl font-bold ${isInternshipMode ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
              Professional Resume
              <span className={`${isInternshipMode ? 'text-gradient-purple-rainbow' : 'text-gradient-blue'} block`}>Builder</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className={`text-xl ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'} mb-10 max-w-2xl mx-auto leading-relaxed`}>
              Create a professional resume that stands out to employers and gets you interviews.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 fade-in-delayed-2 mb-6">
            <Input
              placeholder="Resume Name"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className={`${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'} max-w-xs`}
            />
            <Button onClick={() => setShowResumeManager(true)} className={isInternshipMode ? "btn-purple-rainbow" : "btn-rainbow"}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Resumes
            </Button>
          </div>
          
          <div className="flex justify-center space-x-4 fade-in-delayed-2">
            <Button onClick={saveResume} className={isInternshipMode ? "btn-purple-rainbow" : "btn-rainbow"}>
              <Save className="h-4 w-4 mr-2" />
              Save Resume
            </Button>
            <Button onClick={() => setPreviewMode(true)} className={isInternshipMode ? "btn-purple-rainbow" : "btn-rainbow"}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={downloadResume} className={isInternshipMode ? "btn-purple-rainbow" : "btn-rainbow"}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Resume Manager Dialog */}
      <Dialog open={showResumeManager} onOpenChange={setShowResumeManager}>
        <DialogContent className={`${isInternshipMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-blue-200 text-gray-900'} max-w-4xl`}>
          <DialogHeader>
            <DialogTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <FileText className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-purple-400' : 'text-blue-600'}`} />
              Resume Manager
            </DialogTitle>
            <DialogDescription className={isInternshipMode ? "text-gray-400" : "text-gray-600"}>
              Manage your saved resumes and create new ones
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-semibold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>Saved Resumes</h3>
              <Button onClick={createNewResume} className={isInternshipMode ? "btn-purple-rainbow" : "btn-rainbow"}>
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {savedResumes.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <FileText className={`h-12 w-12 ${isInternshipMode ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
                  <p className={isInternshipMode ? "text-gray-400" : "text-gray-500"}>No saved resumes yet</p>
                  <p className={`${isInternshipMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Create your first resume to get started</p>
                </div>
              ) : (
                savedResumes.map((resume) => (
                  <Card key={resume.id} className={`${isInternshipMode ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70' : 'bg-blue-50/50 border-blue-200 hover:bg-blue-50/70'} transition-colors`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'} text-lg`}>{resume.name}</CardTitle>
                        {currentResumeId === resume.id && (
                          <Badge variant="secondary" className={`${isInternshipMode ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>Current</Badge>
                        )}
                      </div>
                      <CardDescription className={`${isInternshipMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => loadResume(resume)}
                          size="sm"
                          className={`${isInternshipMode ? 'btn-purple-rainbow' : 'btn-rainbow'} flex-1`}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Load
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/20">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className={`${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
                            <AlertDialogHeader>
                              <AlertDialogTitle className={isInternshipMode ? "text-white" : "text-gray-900"}>Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription className={isInternshipMode ? "text-gray-400" : "text-gray-600"}>
                                Are you sure you want to delete "{resume.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className={`${isInternshipMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-blue-200'}`}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteResume(resume.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Personal Information */}
          <Card className={`${isInternshipMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-blue-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <User className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-purple-400' : 'text-blue-600'}`} />
                    Personal Information
                  </CardTitle>
                  <CardDescription className={isInternshipMode ? "text-gray-400" : "text-gray-600"}>
                    Basic contact information
                  </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className={`${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={isInternshipMode ? "text-white" : "text-gray-900"}>Delete Section</AlertDialogTitle>
                      <AlertDialogDescription className={isInternshipMode ? "text-gray-400" : "text-gray-600"}>
                        Are you sure you want to delete this section? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={`${isInternshipMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-blue-200'}`}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteSection('1')}
                        className="bg-red-600 hover:bg-red-700 text-white"
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
                  placeholder="Full Name"
                  value={personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className={`${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className={`${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                />
                <Input
                  placeholder="Phone Number"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className={`${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                />
                <Input
                  placeholder="Address"
                  value={personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className={`${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                />
              </div>
              <Textarea
                placeholder="Professional Objective (Optional)"
                value={personalInfo.objective}
                onChange={(e) => updatePersonalInfo('objective', e.target.value)}
                className={`${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card className={`${isInternshipMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-blue-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <GraduationCap className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    Education
                  </CardTitle>
                  <CardDescription className={isInternshipMode ? "text-gray-400" : "text-gray-600"}>
                    Academic background and qualifications
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => addEducationEntry('university')} size="sm" className={isInternshipMode ? "btn-purple-rainbow" : "btn-rainbow"}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add University
                  </Button>
                  <Button onClick={() => addEducationEntry('highschool')} size="sm" variant="outline" className={`${isInternshipMode ? 'border-purple-400 text-purple-400 hover:bg-purple-400/20' : 'border-blue-400 text-blue-400 hover:bg-blue-400/20'}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add High School
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu: any, index: number) => (
                <div key={edu.id} className={`p-4 ${isInternshipMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} rounded-lg space-y-3`}>
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="secondary" className={edu.type === 'university' ? (isInternshipMode ? 'bg-blue-600' : 'bg-blue-600') : (isInternshipMode ? 'bg-green-600' : 'bg-green-600')}>
                      {edu.type === 'university' ? 'University' : 'High School'}
                    </Badge>
                    <Button
                      onClick={() => deleteEducationEntry(edu.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
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
                      className={`${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
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
                      className={`${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
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
                      className={`${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                    <Input
                      placeholder="Graduation Year"
                      value={edu.graduationYear}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].graduationYear = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className={`${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                    />
                  </div>
                  <Input
                    placeholder="GPA (Optional)"
                    value={edu.gpa}
                    onChange={(e) => {
                      const newEducation = [...education];
                      newEducation[index].gpa = e.target.value;
                      setResumeSections(prev => prev.map(section => 
                        section.type === 'education' ? { ...section, data: newEducation } : section
                      ));
                    }}
                    className={`${isInternshipMode ? 'bg-gray-600 border-gray-500 text-white placeholder:text-gray-400' : 'bg-white border-blue-200 text-gray-900 placeholder:text-gray-500'}`}
                  />
                </div>
              ))}
              {education.length === 0 && (
                <p className={`${isInternshipMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>No education entries added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Work Experience */}

          <Card className={`${isInternshipMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-blue-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <Briefcase className={`h-6 w-6 mr-2 ${isInternshipMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    Work Experience
                  </CardTitle>
                  <CardDescription className={isInternshipMode ? "text-gray-400" : "text-gray-600"}>
                    Previous work experience and internships
                  </CardDescription>
                </div>
                <Button onClick={addExperienceEntry} size="sm" className="btn-purple-rainbow">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.map((exp: any, index: number) => (
                <div key={exp.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Experience #{index + 1}</h4>
                    <Button
                      onClick={() => deleteExperienceEntry(exp.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].company = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Position/Role"
                      value={exp.position}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].position = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].startDate = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="End Date (or 'Present')"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExperience = [...experience];
                        newExperience[index].endDate = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'experience' ? { ...section, data: newExperience } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Textarea
                    placeholder="Job description and achievements..."
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...experience];
                      newExperience[index].description = e.target.value;
                      setResumeSections(prev => prev.map(section => 
                        section.type === 'experience' ? { ...section, data: newExperience } : section
                      ));
                    }}
                    className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-gray-400 text-center py-4">No work experience added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Personal Statement Section */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-6 w-6 mr-2 text-green-400" />
                    Personal Statement
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    A brief paragraph about yourself, your goals and aspirations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a compelling personal statement that showcases your personality, goals, and what makes you unique..."
                value={personalStatement.statement}
                onChange={(e) => updatePersonalStatement(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Star className="h-6 w-6 mr-2 text-yellow-400" />
                    Skills & Strengths
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Technical and soft skills that highlight your abilities
                  </CardDescription>
                </div>
                <Button onClick={addSkill} size="sm" className="btn-purple-rainbow">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill: any, index: number) => (
                <div key={skill.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Skill #{index + 1}</h4>
                    <Button
                      onClick={() => deleteSkillEntry(skill.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Skill Name"
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index].name = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'skills' ? { ...section, data: newSkills } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
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
                      <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                        <SelectValue placeholder="Skill Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
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
                <p className="text-gray-400 text-center py-4">No skills added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-6 w-6 mr-2 text-yellow-400" />
                    Achievements & Awards
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Notable achievements, awards, and recognition
                  </CardDescription>
                </div>
                <Button onClick={addAchievement} size="sm" className="btn-purple-rainbow">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Achievement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement: any, index: number) => (
                <div key={achievement.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Achievement #{index + 1}</h4>
                    <Button
                      onClick={() => deleteAchievementEntry(achievement.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Achievement Title"
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = [...achievements];
                        newAchievements[index].title = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'achievements' ? { ...section, data: newAchievements } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
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
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Textarea
                    placeholder="Description of the achievement..."
                    value={achievement.description}
                    onChange={(e) => {
                      const newAchievements = [...achievements];
                      newAchievements[index].description = e.target.value;
                      setResumeSections(prev => prev.map(section => 
                        section.type === 'achievements' ? { ...section, data: newAchievements } : section
                      ));
                    }}
                    className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    rows={2}
                  />
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-gray-400 text-center py-4">No achievements added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Upload Resume Section */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="h-6 w-6 mr-2 text-blue-400" />
                Upload Existing Resume
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload a resume file from your computer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop your resume here, or click to browse</p>
                <p className="text-gray-500 text-sm">Supports PDF, DOC, DOCX files</p>
                <Button className="mt-4 btn-purple-rainbow">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
};

export default ResumeBuilder;
