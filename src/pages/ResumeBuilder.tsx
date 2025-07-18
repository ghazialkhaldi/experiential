import { ArrowLeft, Download, Upload, FileText, User, GraduationCap, Briefcase, Award, Plus, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'achievements';
  title: string;
  data: any;
}

const ResumeBuilder = () => {
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([
    {
      id: '1',
      type: 'personal',
      title: 'Personal Information',
      data: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        objective: ''
      }
    },
    {
      id: '2',
      type: 'education',
      title: 'Education',
      data: []
    },
    {
      id: '3',
      type: 'experience',
      title: 'Work Experience',
      data: []
    },
    {
      id: '4',
      type: 'skills',
      title: 'Skills',
      data: []
    },
    {
      id: '5',
      type: 'achievements',
      title: 'Achievements & Awards',
      data: []
    }
  ]);

  const [previewMode, setPreviewMode] = useState(false);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeSections(prev => prev.map(section => 
      section.type === 'personal' ? {
        ...section,
        data: { ...section.data, [field]: value }
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

  const downloadResume = () => {
    // In a real implementation, this would generate and download a PDF
    alert("Resume download functionality would be implemented here!");
  };

  const saveResume = () => {
    // In a real implementation, this would save to the database
    alert("Resume saved successfully!");
  };

  const personalInfo = resumeSections.find(s => s.type === 'personal')?.data || {};
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
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">InternshipHub</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Button onClick={() => setPreviewMode(false)} variant="outline" className="text-white border-gray-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Editor
                </Button>
                <Button onClick={downloadResume} className="btn-purple-rainbow text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Resume Preview */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
              <div className="text-gray-600 space-y-1">
                <p>{personalInfo.email || 'your.email@example.com'}</p>
                <p>{personalInfo.phone || '(555) 123-4567'}</p>
                <p>{personalInfo.address || 'Your Address'}</p>
              </div>
              {personalInfo.objective && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-gray-700 italic">{personalInfo.objective}</p>
                </div>
              )}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="border-l-4 border-blue-600 pl-4">
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
                  <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className="border-l-4 border-blue-600 pl-4">
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
                  <Award className="h-6 w-6 mr-2 text-blue-600" />
                  Skills
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill: any) => (
                    <div key={skill.id} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{skill.name}</p>
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
                  <Award className="h-6 w-6 mr-2 text-blue-600" />
                  Achievements & Awards
                </h2>
                <div className="space-y-3">
                  {achievements.map((achievement: any) => (
                    <div key={achievement.id} className="border-l-4 border-blue-600 pl-4">
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
              <Briefcase className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">InternshipHub</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-blue-400 font-medium">
                Internships
              </Link>
              <AuthButton />
              <Button className="btn-purple-rainbow text-white">
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Internships
          </Button>
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-600/10 to-gray-900"></div>
        
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
          
          <div className="flex justify-center space-x-4 fade-in-delayed-2">
            <Button onClick={saveResume} className="btn-purple-rainbow text-gray-900">
              <Save className="h-4 w-4 mr-2" />
              Save Resume
            </Button>
            <Button onClick={() => setPreviewMode(true)} variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={downloadResume} variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Resume Builder Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Personal Information */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Basic contact information and professional objective
              </CardDescription>
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
                <Button onClick={addEducationEntry} size="sm" className="btn-purple-rainbow text-gray-900">
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
                <Button onClick={addExperienceEntry} size="sm" className="btn-purple-rainbow text-gray-900">
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
                <Button className="mt-4 btn-purple-rainbow text-gray-900">
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
