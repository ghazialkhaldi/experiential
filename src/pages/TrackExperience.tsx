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
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Building, Clock, MapPin, Plus, Target, TrendingUp, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogExperienceForm {
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string;
}

const upcomingInternships = [
  {
    id: 1,
    title: "Summer Software Engineering Internship",
    company: "Tech Corp",
    location: "San Francisco, CA",
    season: "Summer 2024",
    duration: "12 weeks",
    applicationDeadline: "March 15, 2024",
    startDate: "June 1, 2024"
  },
  {
    id: 2,
    title: "Fall Business Analytics Internship",
    company: "Data Solutions Inc",
    location: "New York, NY",
    season: "Fall 2024",
    duration: "16 weeks",
    applicationDeadline: "July 1, 2024",
    startDate: "September 1, 2024"
  },
  {
    id: 3,
    title: "Spring Marketing Internship",
    company: "Creative Agency",
    location: "Los Angeles, CA",
    season: "Spring 2025",
    duration: "14 weeks",
    applicationDeadline: "November 15, 2024",
    startDate: "January 15, 2025"
  }
];

const mockExperiences = [
  {
    id: 1,
    title: "Software Development Intern",
    company: "StartupXYZ",
    duration: "3 months",
    description: "Developed web applications using React and Node.js",
    skills: "React, Node.js, MongoDB",
    completedAt: "2023-08-15"
  },
  {
    id: 2,
    title: "Marketing Assistant",
    company: "Local Business",
    duration: "2 months",
    description: "Assisted with social media campaigns and content creation",
    skills: "Social Media, Content Writing, Analytics",
    completedAt: "2023-12-20"
  }
];

const TrackExperience = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [experienceGoal, setExperienceGoal] = useState(() => {
    return parseInt(localStorage.getItem('experienceGoal') || '6');
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LogExperienceForm>();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4">Track Your Experience</h1>
          <p className="text-xl text-muted-foreground mb-8">
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
    const months = parseInt(exp.duration.split(' ')[0]);
    return sum + months;
  }, 0);

  const progressPercentage = Math.min((totalMonths / experienceGoal) * 100, 100);

  const getMostCommonSkill = () => {
    const allSkills = mockExperiences.flatMap(exp => 
      exp.skills.split(', ').map(skill => skill.trim())
    );
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(skillCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Track Your Experience</h1>
              <p className="text-xl text-muted-foreground">
                Log your internships and work experience to build your professional portfolio
              </p>
            </div>
            <AuthButton />
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Experience</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonths} months</div>
                <p className="text-xs text-muted-foreground">
                  Professional experience gained
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                <Progress value={progressPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {totalMonths} of {experienceGoal} months
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Positions Held</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockExperiences.length}</div>
                <p className="text-xs text-muted-foreground">
                  Different roles completed
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Experience Tracking Section */}
            <div className="space-y-6">
              {/* Set Goal Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Experience Goal
                  </CardTitle>
                  <CardDescription>
                    Set your target months of professional experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={experienceGoal}
                      onChange={(e) => handleSetGoal(parseInt(e.target.value) || 6)}
                      className="w-24"
                      min="1"
                      max="60"
                    />
                    <span className="text-sm text-muted-foreground">months</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Most Common Skill:</span>
                    <Badge variant="secondary">{getMostCommonSkill()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Duration:</span>
                    <span className="font-medium">
                      {mockExperiences.length > 0 ? Math.round(totalMonths / mockExperiences.length) : 0} months
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Log Experience Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Log Work Experience</DialogTitle>
                    <DialogDescription>
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
                      <Button type="submit" className="flex-1">Log Experience</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Recent Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Experience</CardTitle>
                  <CardDescription>Your latest internships and work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockExperiences.map((experience) => (
                      <div key={experience.id} className="border-l-2 border-primary pl-4">
                        <h3 className="font-semibold">{experience.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {experience.company} • {experience.duration}
                        </p>
                        <p className="text-sm mt-1">{experience.description}</p>
                        <div className="flex gap-1 mt-2">
                          {experience.skills.split(', ').map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Upcoming Internships */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Internship Calendar
                  </CardTitle>
                  <CardDescription>
                    Plan ahead for upcoming internship opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className={cn("w-full justify-center pointer-events-auto")}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Internships</CardTitle>
                  <CardDescription>
                    Seasonal internship opportunities to apply for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingInternships.map((internship) => (
                      <div key={internship.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{internship.title}</h3>
                          <Badge variant="outline">{internship.season}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {internship.company}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {internship.location}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Duration: {internship.duration}</span>
                          <span>Apply by: {internship.applicationDeadline}</span>
                        </div>
                        <Separator className="my-2" />
                        <Button variant="outline" size="sm" className="w-full">
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </div>
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