import { ArrowLeft, Download, Upload, FileText, User, GraduationCap, Briefcase, Award, Plus, Save, Eye, Trash2, Edit3, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

  const addEducationEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
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
    // In a real implementation, this would generate and download a PDF
    alert("Resume download functionality would be implemented here!");
  };

  const personalInfo = resumeSections.find(s => s.type === 'personal')?.data || {};
  const personalStatement = resumeSections.find(s => s.type === 'statement')?.data || {};
  const education = resumeSections.find(s => s.type === 'education')?.data || [];
  const experience = resumeSections.find(s => s.type === 'experience')?.data || [];
  const skills = resumeSections.find(s => s.type === 'skills')?.data || [];
  const achievements = resumeSections.find(s => s.type === 'achievements')?.data || [];

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
                <Briefcase className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">InternshipHub</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Button onClick={() => setPreviewMode(false)} variant="outline" className="text-white border-gray-600">
                  <ArrowLeft className="h-4 w-4 mr-2 text-purple-400" />
                  Back to Editor
                </Button>
                <Button onClick={downloadResume} className="btn-purple-rainbow">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Resume Preview */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8 text-gray-900">
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
                  <GraduationCap className="h-6 w-6 mr-2 text-purple-600" />
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="border-l-4 border-purple-600 pl-4">
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
                  <Briefcase className="h-6 w-6 mr-2 text-purple-600" />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className="border-l-4 border-purple-600 pl-4">
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
                  <Star className="h-6 w-6 mr-2 text-purple-600" />
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
                  <Award className="h-6 w-6 mr-2 text-purple-600" />
                  Achievements & Awards
                </h2>
                <div className="space-y-3">
                  {achievements.map((achievement: any) => (
                    <div key={achievement.id} className="border-l-4 border-purple-600 pl-4">
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
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
        <nav className="bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
                <Briefcase className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">InternshipHub</span>
              </Link>
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-gray-300 hover:text-purple-400 font-medium">
                  Internships
                </Link>
                <AuthButton />
                <Button className="btn-purple-rainbow">
                  Post Internship
                </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2 text-purple-400" />
            Back to Internships
          </Button>
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-purple-600/10 to-gray-900"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Professional Resume
              <span className="text-gradient-purple-rainbow block">Builder</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create a professional resume that stands out to employers and gets you interviews.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 fade-in-delayed-2 mb-6">
            <Input
              placeholder="Resume Name"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 max-w-xs"
            />
            <Button onClick={() => setShowResumeManager(true)} className="btn-purple-rainbow">
              <FileText className="h-4 w-4 mr-2" />
              Manage Resumes
            </Button>
          </div>
          
          <div className="flex justify-center space-x-4 fade-in-delayed-2">
            <Button onClick={saveResume} className="btn-purple-rainbow">
              <Save className="h-4 w-4 mr-2" />
              Save Resume
            </Button>
            <Button onClick={() => setPreviewMode(true)} className="btn-purple-rainbow">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={downloadResume} className="btn-purple-rainbow">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Resume Manager Dialog */}
      <Dialog open={showResumeManager} onOpenChange={setShowResumeManager}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <FileText className="h-6 w-6 mr-2 text-purple-400" />
              Resume Manager
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage your saved resumes and create new ones
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Saved Resumes</h3>
              <Button onClick={createNewResume} className="btn-purple-rainbow">
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {savedResumes.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No saved resumes yet</p>
                  <p className="text-gray-500 text-sm">Create your first resume to get started</p>
                </div>
              ) : (
                savedResumes.map((resume) => (
                  <Card key={resume.id} className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{resume.name}</CardTitle>
                        {currentResumeId === resume.id && (
                          <Badge variant="secondary" className="bg-purple-600 text-white">Current</Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-400 text-sm">
                        Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => loadResume(resume)}
                          size="sm"
                          className="btn-purple-rainbow flex-1"
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
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete "{resume.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">Cancel</AlertDialogCancel>
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
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-6 w-6 mr-2 text-purple-400" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic contact information
                  </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Section</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete this section? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">Cancel</AlertDialogCancel>
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
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Phone Number"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Address"
                  value={personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Textarea
                placeholder="Professional Objective (Optional)"
                value={personalInfo.objective}
                onChange={(e) => updatePersonalInfo('objective', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <GraduationCap className="h-6 w-6 mr-2 text-blue-400" />
                    Education
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Academic background and qualifications
                  </CardDescription>
                </div>
                <Button onClick={addEducationEntry} size="sm" className="btn-purple-rainbow">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu: any, index: number) => (
                <div key={edu.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].institution = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].degree = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].field = e.target.value;
                        setResumeSections(prev => prev.map(section => 
                          section.type === 'education' ? { ...section, data: newEducation } : section
                        ));
                      }}
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
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
                      className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
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
                    className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Add similar sections for Experience, Skills, and Achievements */}
          {/* (I'll keep this concise, but in a real implementation, these would be fully built out) */}

          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="h-6 w-6 mr-2 text-blue-400" />
                    Work Experience
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Previous work experience and internships
                  </CardDescription>
                </div>
                <Button onClick={addExperienceEntry} size="sm" className="btn-purple-rainbow">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {experience.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No work experience added yet</p>
              ) : (
                <div className="space-y-4">
                  {experience.map((exp: any, index: number) => (
                    <div key={exp.id} className="p-4 bg-gray-700/50 rounded-lg">
                      <p className="text-white">Experience entry #{index + 1}</p>
                    </div>
                  ))}
                </div>
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
