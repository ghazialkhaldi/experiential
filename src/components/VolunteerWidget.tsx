import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp, Plus, History } from 'lucide-react';
import { volunteerWidgetService, VolunteerProgress } from '../lib/volunteerWidgetService';

const VolunteerWidget: React.FC = () => {
  const [progress, setProgress] = useState<VolunteerProgress | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [description, setDescription] = useState('');
  const [goalHours, setGoalHours] = useState('100');
  const [hoursHistory, setHoursHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgress();
    loadHistory();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await volunteerWidgetService.getWidgetData();
      if (data) {
        setProgress(data);
        setGoalHours(data.goalHours.toString());
      } else {
        // Initialize with default data
        const totalHours = await volunteerWidgetService.getTotalVolunteerHours();
        const initialProgress = await volunteerWidgetService.calculateProgress(totalHours, 100);
        setProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await volunteerWidgetService.getVolunteerHoursHistory();
      setHoursHistory(history.slice(-10).reverse()); // Show last 10 entries
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleAddHours = async () => {
    if (!hoursToAdd || isNaN(Number(hoursToAdd))) return;
    
    setLoading(true);
    try {
      await volunteerWidgetService.logVolunteerHours(
        Number(hoursToAdd), 
        'manual-entry',
        description
      );
      
      setHoursToAdd('');
      setDescription('');
      await loadProgress();
      await loadHistory();
    } catch (error) {
      console.error('Error adding hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalUpdate = async () => {
    if (!goalHours || isNaN(Number(goalHours)) || !progress) return;
    
    try {
      const updatedProgress = await volunteerWidgetService.calculateProgress(
        progress.currentHours,
        Number(goalHours),
        progress.completedOpportunities,
        progress.ongoingOpportunities
      );
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!progress) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Volunteer Hours Tracker
          </CardTitle>
          <CardDescription>Loading your volunteer progress...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Volunteer Hours Tracker
          </CardTitle>
          <CardDescription>
            Track your volunteer hours and sync with your iPhone widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{progress.currentHours} hours</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Goal: {progress.goalHours}h
              </Badge>
            </div>
            
            <Progress value={progress.percentage} className="h-3" />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{progress.percentage}% complete</span>
              <span>{volunteerWidgetService.getProgressMessage(progress)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{progress.completedOpportunities}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold">{progress.ongoingOpportunities}</div>
              <div className="text-sm text-muted-foreground">Ongoing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log Volunteer Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="0.0"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal Hours</Label>
              <Input
                id="goal"
                type="number"
                min="1"
                placeholder="100"
                value={goalHours}
                onChange={(e) => setGoalHours(e.target.value)}
                onBlur={handleGoalUpdate}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <Button 
            onClick={handleAddHours} 
            disabled={!hoursToAdd || loading}
            className="w-full"
          >
            {loading ? 'Adding...' : 'Add Hours'}
          </Button>
        </CardContent>
      </Card>

      {/* History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Activity
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} History
            </Button>
          </CardTitle>
        </CardHeader>
        {showHistory && (
          <CardContent>
            {hoursHistory.length > 0 ? (
              <div className="space-y-3">
                {hoursHistory.map((entry, index) => (
                  <div key={entry.id || index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{entry.hours} hours</div>
                      {entry.description && (
                        <div className="text-sm text-muted-foreground">{entry.description}</div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(entry.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No volunteer hours logged yet. Start tracking your impact!
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Widget Sync Info */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="text-sm font-medium">iPhone Widget Sync</div>
            <div className="text-xs text-muted-foreground">
              Your progress automatically syncs to your iPhone widget for quick access
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {formatDate(progress.lastUpdated)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerWidget;
