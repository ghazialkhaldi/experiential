import { ArrowLeft, CheckCircle, Circle, Plus, Trash2, Edit3, GraduationCap, BookOpen, FileText, Calendar, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

interface ChecklistSection {
  title: string;
  description: string;
  icon: any;
  items: ChecklistItem[];
  color: string;
}

const UniversityChecklist = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [customItem, setCustomItem] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  
  // Check if accessed from sidebar (no referrer from resources page)
  const isFromSidebar = !document.referrer.includes('/resources') && location.state?.fromSidebar !== false;

  const [checklists, setChecklists] = useState<ChecklistSection[]>([
    {
      title: "Academic Requirements",
      description: "Core academic achievements and course completion",
      icon: BookOpen,
      color: "blue",
      items: [
        { id: "1", text: "Maintain GPA above 3.5", completed: false, category: "academic" },
        { id: "2", text: "Complete AP or IB courses", completed: false, category: "academic" },
        { id: "3", text: "Take SAT/ACT tests", completed: false, category: "academic" },
        { id: "4", text: "Request transcripts", completed: false, category: "academic" },
        { id: "5", text: "Get teacher recommendations", completed: false, category: "academic" }
      ]
    },
    {
      title: "Extracurricular Activities",
      description: "Leadership roles and community involvement",
      icon: Target,
      color: "cyan",
      items: [
        { id: "6", text: "Join student government", completed: false, category: "extracurricular" },
        { id: "7", text: "Participate in sports or clubs", completed: false, category: "extracurricular" },
        { id: "8", text: "Volunteer 100+ hours", completed: false, category: "extracurricular" },
        { id: "9", text: "Lead a community project", completed: false, category: "extracurricular" },
        { id: "10", text: "Attend summer programs", completed: false, category: "extracurricular" }
      ]
    },
    {
      title: "College Applications",
      description: "Application deadlines and requirements",
      icon: FileText,
      color: "purple",
      items: [
        { id: "11", text: "Research target universities", completed: false, category: "applications" },
        { id: "12", text: "Write personal essays", completed: false, category: "applications" },
        { id: "13", text: "Submit applications", completed: false, category: "applications" },
        { id: "14", text: "Apply for financial aid", completed: false, category: "applications" },
        { id: "15", text: "Schedule interviews", completed: false, category: "applications" }
      ]
    },
    {
      title: "Scholarships & Financial Aid",
      description: "Funding opportunities and deadlines",
      icon: Award,
      color: "indigo",
      items: [
        { id: "16", text: "Complete FAFSA application", completed: false, category: "financial" },
        { id: "17", text: "Research scholarship opportunities", completed: false, category: "financial" },
        { id: "18", text: "Apply to merit-based scholarships", completed: false, category: "financial" },
        { id: "19", text: "Submit CSS Profile", completed: false, category: "financial" },
        { id: "20", text: "Apply for need-based aid", completed: false, category: "financial" }
      ]
    }
  ]);

  const toggleItem = (sectionIndex: number, itemId: string) => {
    setChecklists(prev => prev.map((section, idx) => 
      idx === sectionIndex ? {
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      } : section
    ));
  };

  const addCustomItem = (sectionIndex: number) => {
    if (!customItem.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: customItem,
      completed: false,
      category: checklists[sectionIndex].items[0]?.category || "custom"
    };
    
    setChecklists(prev => prev.map((section, idx) => 
      idx === sectionIndex ? {
        ...section,
        items: [...section.items, newItem]
      } : section
    ));
    
    setCustomItem("");
  };

  const deleteItem = (sectionIndex: number, itemId: string) => {
    setChecklists(prev => prev.map((section, idx) => 
      idx === sectionIndex ? {
        ...section,
        items: section.items.filter(item => item.id !== itemId)
      } : section
    ));
  };

  const startEditing = (itemId: string, currentText: string) => {
    setEditingItem(itemId);
    setEditText(currentText);
  };

  const saveEdit = (sectionIndex: number, itemId: string) => {
    if (!editText.trim()) return;
    
    setChecklists(prev => prev.map((section, idx) => 
      idx === sectionIndex ? {
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, text: editText } : item
        )
      } : section
    ));
    
    setEditingItem(null);
    setEditText("");
  };

  const getProgressPercentage = (section: ChecklistSection) => {
    const completed = section.items.filter(item => item.completed).length;
    return Math.round((completed / section.items.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile: Center the logo, Desktop: Left align */}
            <Link to="/" className={`flex items-center space-x-2 transition-colors hover:opacity-80 ${
              isMobile ? 'absolute left-1/2 transform -translate-x-1/2' : ''
            }`}>
              <span className="text-2xl font-bold text-gray-900">E<span className="text-blue-500">x</span>per<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>ent<span className="relative">ı<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-blue-500 text-sm">•</span></span>al<span className="text-blue-500">.</span></span>
            </Link>
            <div className="flex items-center space-x-6">
              {!isMobile && (
                <>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Opportunities
                  </Link>
                  <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium">
                    University Resources
                  </Link>
                </>
              )}
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!isFromSidebar && (
          <Link to="/resources">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to University Resources
            </Button>
          </Link>
        )}
      </div>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/15 via-cyan-400/8 to-white"></div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-blue-400/25 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-purple-400/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 leading-tight">
              University
              <span className="text-gradient-rainbow block">Application Checklist</span>
            </h1>
          </div>
          <div className="fade-in-delayed">
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Stay organized and on track with your college application journey. Create custom checklists and monitor your progress.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="py-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {checklists.map((section, index) => {
              const IconComponent = section.icon;
              const progress = getProgressPercentage(section);
              return (
                <div key={index} className="text-center p-4 rounded-lg bg-white/60 backdrop-blur-sm">
                  <IconComponent className={`h-8 w-8 mx-auto mb-2 text-${section.color}-600`} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{progress}%</div>
                  <div className="text-sm text-gray-600">{section.title}</div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
                    <div 
                      className={`bg-gradient-to-r from-${section.color}-400 to-${section.color}-600 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checklist Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {checklists.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            const progress = getProgressPercentage(section);
            
            return (
              <Card key={sectionIndex} className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-${section.color}-100 rounded-lg`}>
                        <IconComponent className={`h-6 w-6 text-${section.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-900">{section.title}</CardTitle>
                        <CardDescription className="text-gray-600">{section.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`bg-${section.color}-100 text-${section.color}-700 border-${section.color}-200`}>
                      {progress}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => toggleItem(sectionIndex, item.id)}
                            className="flex-shrink-0"
                          >
                            {item.completed ? (
                              <CheckCircle className={`h-5 w-5 text-${section.color}-600`} />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                          {editingItem === item.id ? (
                            <div className="flex items-center space-x-2 flex-1">
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    saveEdit(sectionIndex, item.id);
                                  }
                                }}
                                autoFocus
                              />
                              <Button 
                                size="sm" 
                                onClick={() => saveEdit(sectionIndex, item.id)}
                                className="btn-rainbow text-white px-3"
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'} flex-1`}>
                              {item.text}
                            </span>
                          )}
                        </div>
                        {editingItem !== item.id && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => startEditing(item.id, item.text)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteItem(sectionIndex, item.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Custom Item */}
                    <div className="flex items-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg">
                      <Input
                        placeholder="Add custom checklist item..."
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomItem(sectionIndex);
                          }
                        }}
                      />
                      <Button 
                        onClick={() => addCustomItem(sectionIndex)}
                        className="btn-rainbow text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Action Section - Only show if not from sidebar */}
      {!isFromSidebar && (
        <section className="py-16 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-600/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <BookOpen className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Stay on Track to Success</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Keep checking off items and build the strong application profile that will get you into your dream university.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resources">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 transform transition-all duration-200 hover:scale-105">
                  Back to Resources
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" className="bg-white/20 text-white hover:bg-white/30 border border-white/30 transform transition-all duration-200 hover:scale-105">
                  Find Volunteer Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default UniversityChecklist;