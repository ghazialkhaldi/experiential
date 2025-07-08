import { useState, useEffect } from "react";
import { Clock, Target, CheckCircle, Plus, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { Users } from "lucide-react";

const TrackHours = () => {
  const [totalHours, setTotalHours] = useState(0);
  const [hourGoal, setHourGoal] = useState(50);
  const [completedOpportunities, setCompletedOpportunities] = useState([
    {
      id: 1,
      title: "Food Bank Volunteer",
      organization: "Community Food Bank",
      hours: 8,
      date: "2024-01-15",
      category: "Community Service"
    },
    {
      id: 2,
      title: "Animal Shelter Assistant",
      organization: "City Animal Shelter",
      hours: 6,
      date: "2024-01-20",
      category: "Animal Care"
    }
  ]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const total = completedOpportunities.reduce((sum, opp) => sum + opp.hours, 0);
    setTotalHours(total);
  }, [completedOpportunities]);

  const handleSetGoal = () => {
    if (newGoal && !isNaN(Number(newGoal))) {
      setHourGoal(Number(newGoal));
      setNewGoal("");
    }
  };

  const progressPercentage = (totalHours / hourGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VolunteerHub</span>
            </div>
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
                +3 hours from last week
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
              <div className="text-2xl font-bold">{completedOpportunities.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {new Set(completedOpportunities.map(o => o.category)).size} categories
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
                    {completedOpportunities.length > 0 
                      ? Math.round(totalHours / completedOpportunities.length) 
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
                  <span className="font-medium">Community Service</span>
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
                  <Dialog>
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
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Opportunity Title</Label>
                          <Input id="title" placeholder="Enter opportunity title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input id="organization" placeholder="Enter organization name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hours">Hours Completed</Label>
                          <Input id="hours" type="number" placeholder="Enter hours" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Date Completed</Label>
                          <Input id="date" type="date" />
                        </div>
                        <Button className="w-full">Log Hours</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600">{opportunity.organization}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{opportunity.date}</span>
                          </div>
                          <Badge variant="secondary">{opportunity.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{opportunity.hours}</div>
                        <div className="text-sm text-gray-500">hours</div>
                      </div>
                    </div>
                  ))}
                  
                  {completedOpportunities.length === 0 && (
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
      </div>
    </div>
  );
};

export default TrackHours;