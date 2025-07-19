import { useState, useEffect } from "react";
import { Clock, Target, CheckCircle, Plus, Calendar, BarChart3, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVolunteerHours } from "@/hooks/useVolunteerHours";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface LogHoursForm {
  title: string;
  organization: string;
  hours: string;
  date_completed: string;
  category: string;
}

const TrackHours = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { hours: volunteerHours, loading: hoursLoading, addHours, totalHours, totalOpportunities } = useVolunteerHours();
  const [hourGoal, setHourGoal] = useState(() => {
    const savedGoal = localStorage.getItem('volunteerHourGoal');
    return savedGoal ? parseInt(savedGoal, 10) : 50;
  });
  const [newGoal, setNewGoal] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LogHoursForm>();

  const handleSetGoal = () => {
    if (newGoal && !isNaN(Number(newGoal))) {
      const goalValue = Number(newGoal);
      setHourGoal(goalValue);
      localStorage.setItem('volunteerHourGoal', goalValue.toString());
      setNewGoal("");
    }
  };

  const onSubmit = async (data: LogHoursForm) => {
    const success = await addHours({
      title: data.title,
      organization: data.organization,
      hours: parseFloat(data.hours),
      date_completed: data.date_completed,
      category: data.category || undefined,
    });

    if (success) {
      reset();
      setDialogOpen(false);
    }
  };

  const progressPercentage = (totalHours / hourGoal) * 100;

  const getMostActiveCategory = () => {
    if (volunteerHours.length === 0) return "None yet";
    const categories = volunteerHours.map(h => h.category).filter(Boolean);
    if (categories.length === 0) return "None yet";
    
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat!] = (acc[cat!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0][0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Experiential</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Volunteer Hours</h1>
          <p className="text-xl text-gray-600">
            Monitor your volunteer progress and achieve your service goals.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-500">Loading...</div>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-12">
            <LogIn className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In to Track Your Hours</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to track your volunteer hours and monitor your progress.
            </p>
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalHours}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalHours === 0 ? "No hours logged yet" : `${totalOpportunities} opportunities completed`}
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
                    {totalHours} of {hourGoal} hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Opportunities Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOpportunities}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalOpportunities === 0 
                      ? "Start logging your volunteer work"
                      : `Across ${new Set(volunteerHours.map(h => h.category).filter(Boolean)).size} categories`
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hour Goal Setting */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Set Hour Goal</span>
                    </CardTitle>
                    <CardDescription>
                      Set and update your volunteer hour goals to stay motivated.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current-goal">Current Goal</Label>
                      <div className="text-2xl font-bold text-blue-600">{hourGoal} hours</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-goal">Update Goal</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="new-goal"
                          type="number"
                          placeholder="Enter new goal"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                        />
                        <Button onClick={handleSetGoal}>
                          Set
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Quick Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average per opportunity:</span>
                      <span className="font-medium">
                        {totalOpportunities > 0 
                          ? Math.round(totalHours / totalOpportunities) 
                          : 0} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hours remaining:</span>
                      <span className="font-medium text-blue-600">
                        {Math.max(0, hourGoal - totalHours)} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Most active category:</span>
                      <span className="font-medium">
                        {getMostActiveCategory()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Completed Opportunities */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>Completed Opportunities</span>
                        </CardTitle>
                        <CardDescription>
                          View all your completed volunteer work and logged hours.
                        </CardDescription>
                      </div>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Log Hours
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Log Volunteer Hours</DialogTitle>
                            <DialogDescription>
                              Add a completed volunteer opportunity to track your hours.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="title">Opportunity Title</Label>
                                <Input 
                                  id="title" 
                                  placeholder="Enter opportunity title" 
                                  {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="organization">Organization</Label>
                                <Input 
                                  id="organization" 
                                  placeholder="Enter organization name" 
                                  {...register("organization", { required: "Organization is required" })}
                                />
                                {errors.organization && <p className="text-sm text-red-600">{errors.organization.message}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="hours">Hours Completed</Label>
                                <Input 
                                  id="hours" 
                                  type="number" 
                                  step="0.5"
                                  placeholder="Enter hours" 
                                  {...register("hours", { 
                                    required: "Hours is required",
                                    min: { value: 0.5, message: "Must be at least 0.5 hours" }
                                  })}
                                />
                                {errors.hours && <p className="text-sm text-red-600">{errors.hours.message}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="date_completed">Date Completed</Label>
                                <Input 
                                  id="date_completed" 
                                  type="date" 
                                  {...register("date_completed", { required: "Date is required" })}
                                />
                                {errors.date_completed && <p className="text-sm text-red-600">{errors.date_completed.message}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="category">Category (Optional)</Label>
                                <Input 
                                  id="category" 
                                  placeholder="e.g., Community Service, Education"
                                  {...register("category")}
                                />
                              </div>
                              <Button type="submit" className="w-full">Log Hours</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hoursLoading ? (
                        <div className="text-center py-8">
                          <div className="text-lg text-gray-500">Loading...</div>
                        </div>
                      ) : volunteerHours.length > 0 ? (
                        volunteerHours.map((hour) => (
                          <div key={hour.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{hour.title}</h3>
                              <p className="text-sm text-gray-600">{hour.organization}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    {new Date(hour.date_completed).toLocaleDateString()}
                                  </span>
                                </div>
                                {hour.category && <Badge variant="secondary">{hour.category}</Badge>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{hour.hours}</div>
                              <div className="text-sm text-gray-500">hours</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg mb-2">No completed opportunities yet</p>
                          <p className="text-sm">Start volunteering and log your hours to track your progress!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackHours;