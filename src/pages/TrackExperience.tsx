import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import Sidebar from '@/components/Sidebar';
import AuthButton from '@/components/AuthButton';
import ExperientialLogo from '@/components/ExperientialLogo';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Building, Clock, MapPin, Plus, Target, TrendingUp, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';
import { NotificationBell } from '@/components/NotificationBell';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

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
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [experienceGoal, setExperienceGoal] = useState(() => {
    return parseInt(localStorage.getItem('experienceGoal') || '6');
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LogExperienceForm>();

  if (!user) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-background'}`}>
        <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
          <h1 className={`text-4xl font-bold mb-4 ${isInternshipMode ? 'text-white' : ''}`}>Track Your Experience</h1>
          <p className={`text-xl mb-8 ${isInternshipMode ? 'text-gray-300' : 'text-muted-foreground'}`}>
            Please sign in to track your internships and work experience.
          </p>
          <AuthButton />
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
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'hero-bg'}`}>
      <Sidebar />
      
      {/* Navigation */}
      <nav className={`backdrop-blur-md shadow-sm border-b ${
        isInternshipMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-blue-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile: Center the logo, Desktop: Left align */}
            <div className={`flex items-center space-x-2 fade-in ${
              isMobile ? 'absolute left-1/2 transform -translate-x-1/2' : ''
            }`}>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <ExperientialLogo className="h-12 w-auto" />
              </Link>
            </div>
            <div className="flex items-center space-x-6 fade-in-delayed">
              {/* Desktop navigation - hide some items on mobile */}
              {!isMobile && (
                <>
                  {user && <NotificationBell />}
                  <AuthButton />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
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
                    <span className={isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}>Average Duration:</span>
                    <span className={`font-medium ${isInternshipMode ? 'text-white' : ''}`}>
                      {mockExperiences.length > 0 ? Math.round(totalMonths / mockExperiences.length) : 0} months
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Log Experience Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className={`sm:max-w-md ${isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <DialogHeader>
                    <DialogTitle className={isInternshipMode ? 'text-white' : ''}>Log Work Experience</DialogTitle>
                    <DialogDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                      Add your internship or work experience to track your professional growth.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Position Title"
                        {...register('title', { required: 'Title is required' })}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="Company Name"
                        {...register('company', { required: 'Company is required' })}
                      />
                      {errors.company && (
                        <p className="text-sm text-destructive mt-1">{errors.company.message}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="Duration (e.g., 3 months)"
                        {...register('duration', { required: 'Duration is required' })}
                      />
                      {errors.duration && (
                        <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
                      )}
                    </div>

                    <div>
                      <Textarea
                        placeholder="Description of your role and responsibilities"
                        {...register('description')}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Skills gained (e.g., React, Communication, Leadership)"
                        {...register('skills')}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border-0">Log Experience</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className={`flex-1 ${isInternshipMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Recent Experience */}
              <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isInternshipMode ? 'text-white' : ''}>Recent Experience</CardTitle>
                  <CardDescription className={isInternshipMode ? 'text-gray-400' : ''}>Your latest internships and work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockExperiences.length === 0 ? (
                      <div className={`text-center py-8 ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className={`text-lg font-medium mb-2 ${isInternshipMode ? 'text-gray-300' : ''}`}>No experience logged yet</p>
                        <p className="text-sm">Click "Log Experience" to add your first internship or work experience.</p>
                      </div>
                    ) : (
                      mockExperiences.map((experience) => (
                        <div key={experience.id} className="border-l-2 border-primary pl-4">
                          <h3 className={`font-semibold ${isInternshipMode ? 'text-white' : ''}`}>{experience.title}</h3>
                          <p className={`text-sm flex items-center gap-1 ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                            <Building className="h-3 w-3" />
                            {experience.company} • {experience.duration}
                          </p>
                          <p className={`text-sm mt-1 ${isInternshipMode ? 'text-gray-300' : ''}`}>{experience.description}</p>
                          <div className="flex gap-1 mt-2">
                            {experience.skills.split(', ').map((skill) => (
                              <Badge key={skill} variant="outline" className={`text-xs ${isInternshipMode ? 'border-gray-600 text-gray-300' : ''}`}>
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Upcoming Internships */}
            <div className="space-y-6">
              <Card className={isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isInternshipMode ? 'text-white' : ''}`}>
                    <CalendarIcon className="h-5 w-5" />
                    Internship Calendar
                  </CardTitle>
                  <CardDescription className={isInternshipMode ? 'text-gray-400' : ''}>
                    Plan ahead for upcoming internship opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className={cn("w-full justify-center pointer-events-auto", isInternshipMode ? 'text-white [&_.rdp-day]:text-gray-300 [&_.rdp-day_button:hover]:bg-gray-700' : '')}
                  />
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TrackExperience;