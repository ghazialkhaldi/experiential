import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Building, Clock, MapPin, Plus, Target, TrendingUp, Briefcase, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';
import { toast } from '@/hooks/use-toast';

interface LogExperienceForm {
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string;
}

const mockExperiences: any[] = [];

const TrackExperience = () => {
  const { user } = useAuth();
  const { isInternshipMode } = useMode();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [experienceGoal, setExperienceGoal] = useState(() => {
    return parseInt(localStorage.getItem('experienceGoal') || '6');
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LogExperienceForm>();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleBackNavigation = () => {
    triggerHaptic();
    toast({
      title: "Returning to Portfolio",
      description: "Going back to portfolio...",
      duration: 1500,
    });
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-background'}`}>
        <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
          <h1 className={`text-4xl font-bold mb-4 ${isInternshipMode ? 'text-white' : ''}`}>Track Your Experience</h1>
          <p className={`text-xl mb-8 ${isInternshipMode ? 'text-gray-300' : 'text-muted-foreground'}`}>
            Please sign in to track your internships and work experience.
          </p>
        </div>
      </div>
    );
  }

  const handleSetGoal = (newGoal: number) => {
    setExperienceGoal(newGoal);
    localStorage.setItem('experienceGoal', newGoal.toString());
  };

  const onSubmit = (data: LogExperienceForm) => {
    console.log('Experience logged:', data);
    setIsDialogOpen(false);
    reset();
  };

  const totalMonths = mockExperiences.reduce((sum, exp) => {
    if (!exp.duration) return sum;
    const durationMatch = exp.duration.match(/(\d+)/);
    const months = durationMatch ? parseInt(durationMatch[1]) : 0;
    return sum + months;
  }, 0);

  const progressPercentage = Math.min((totalMonths / experienceGoal) * 100, 100);

  const getMostCommonSkill = () => {
    if (mockExperiences.length === 0) return 'N/A';
    
    const allSkills = mockExperiences.flatMap(exp => 
      exp.skills ? exp.skills.split(', ').map(skill => skill.trim()) : []
    );
    
    if (allSkills.length === 0) return 'N/A';
    
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(skillCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';
  };

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-background'
    }`}>
      {/* Back Button - Updated for iPhone notch */}
      <div className="absolute top-16 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBackNavigation}
          className={`${isInternshipMode ? 'text-gray-300 hover:text-white bg-gray-800/90 hover:bg-gray-800 shadow-lg shadow-purple-500/40' : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-lg'} backdrop-blur-sm`}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <main>
        <div className="container mx-auto px-4 py-20">{/* Added top padding for notch */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${isInternshipMode ? 'text-white' : ''}`}>Track Your Experience</h1>
              <p className={`text-xl ${isInternshipMode ? 'text-gray-300' : 'text-muted-foreground'}`}>
                Log your internships and work experience to build your professional portfolio
              </p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isInternshipMode ? 'text-gray-200' : ''}`}>Total Experience</CardTitle>
                <Clock className={`h-4 w-4 ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isInternshipMode ? 'text-white' : ''}`}>{totalMonths} months</div>
                <p className={`text-xs ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  Professional experience gained
                </p>
              </CardContent>
            </Card>

            <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isInternshipMode ? 'text-gray-200' : ''}`}>Goal Progress</CardTitle>
                <Target className={`h-4 w-4 ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isInternshipMode ? 'text-white' : ''}`}>{Math.round(progressPercentage)}%</div>
                <Progress value={progressPercentage} className="mt-2" />
                <p className={`text-xs mt-2 ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {totalMonths} of {experienceGoal} months
                </p>
              </CardContent>
            </Card>

            <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isInternshipMode ? 'text-gray-200' : ''}`}>Positions Held</CardTitle>
                <Briefcase className={`h-4 w-4 ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isInternshipMode ? 'text-white' : ''}`}>{mockExperiences.length}</div>
                <p className={`text-xs ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  Different roles completed
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Experience Tracking Section */}
            <div className="space-y-6">
              {/* Set Goal Section */}
              <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isInternshipMode ? 'text-white' : ''}`}>
                    <Target className="h-5 w-5" />
                    Experience Goal
                  </CardTitle>
                  <CardDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                    Set your target months of professional experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={experienceGoal}
                      onChange={(e) => handleSetGoal(parseInt(e.target.value) || 6)}
                      className={`w-24 ${isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      min="1"
                      max="60"
                    />
                    <span className={`text-sm ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>months</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isInternshipMode ? 'text-white' : ''}`}>
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className={isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}>Most Common Skill:</span>
                    <Badge variant="secondary" className={isInternshipMode ? 'bg-gray-700 text-gray-200' : ''}>{getMostCommonSkill()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className={isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}>Experience Remaining:</span>
                    <span className={`font-medium ${isInternshipMode ? 'text-white' : ''}`}>{Math.max(0, experienceGoal - totalMonths)} months</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Experience Entries */}
            <div>
              <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`flex items-center gap-2 ${isInternshipMode ? 'text-white' : ''}`}>
                        <Briefcase className="h-5 w-5" />
                        Experience Log
                      </CardTitle>
                      <CardDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                        Track your professional experience and skills
                      </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className={isInternshipMode ? 'bg-purple-600 hover:bg-purple-700' : ''}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                        <DialogHeader>
                          <DialogTitle className={isInternshipMode ? 'text-white' : ''}>Log New Experience</DialogTitle>
                          <DialogDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                            Add a new internship or work experience to your portfolio
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div>
                            <Label htmlFor="title" className={isInternshipMode ? 'text-gray-200' : ''}>Position Title</Label>
                            <Input 
                              {...register('title', { required: 'Title is required' })} 
                              className={isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="company" className={isInternshipMode ? 'text-gray-200' : ''}>Company</Label>
                            <Input 
                              {...register('company', { required: 'Company is required' })} 
                              className={isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration" className={isInternshipMode ? 'text-gray-200' : ''}>Duration (e.g., "3 months")</Label>
                            <Input 
                              {...register('duration', { required: 'Duration is required' })} 
                              className={isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="description" className={isInternshipMode ? 'text-gray-200' : ''}>Description</Label>
                            <Textarea 
                              {...register('description')} 
                              className={isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="skills" className={isInternshipMode ? 'text-gray-200' : ''}>Skills (comma-separated)</Label>
                            <Input 
                              {...register('skills')} 
                              placeholder="e.g., JavaScript, React, Communication"
                              className={isInternshipMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <Button type="submit" className={`w-full ${isInternshipMode ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                            Add Experience
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {mockExperiences.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className={`h-12 w-12 mx-auto mb-4 ${isInternshipMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={`text-lg mb-2 ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>No experience logged yet</p>
                      <p className={`text-sm ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'}`}>Start building your professional portfolio!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockExperiences.map((exp, index) => (
                        <div key={index} className={`p-4 border rounded-lg ${isInternshipMode ? 'border-gray-700 bg-gray-700/50' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className={`font-semibold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>{exp.title}</h3>
                              <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>{exp.company}</p>
                            </div>
                            <Badge variant="outline" className={isInternshipMode ? 'border-gray-600 text-gray-300' : ''}>{exp.duration}</Badge>
                          </div>
                          {exp.description && (
                            <p className={`text-sm mb-2 ${isInternshipMode ? 'text-gray-400' : 'text-gray-700'}`}>{exp.description}</p>
                          )}
                          {exp.skills && (
                            <div className="flex flex-wrap gap-1">
                              {exp.skills.split(', ').map((skill, i) => (
                                <Badge key={i} variant="secondary" className={`text-xs ${isInternshipMode ? 'bg-gray-600 text-gray-200' : ''}`}>
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackExperience;