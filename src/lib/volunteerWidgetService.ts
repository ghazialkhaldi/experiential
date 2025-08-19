import { Preferences } from '@capacitor/preferences';

export interface VolunteerProgress {
  currentHours: number;
  goalHours: number;
  percentage: number;
  completedOpportunities: number;
  ongoingOpportunities: number;
  lastUpdated: string;
}

class VolunteerWidgetService {
  private readonly WIDGET_DATA_KEY = 'volunteer_widget_data';
  private readonly USER_HOURS_KEY = 'user_volunteer_hours';

  // Update widget data that will be shown in iOS widget
  async updateWidgetData(progress: VolunteerProgress): Promise<void> {
    try {
      const widgetData = {
        ...progress,
        lastUpdated: new Date().toISOString()
      };

      await Preferences.set({
        key: this.WIDGET_DATA_KEY,
        value: JSON.stringify(widgetData)
      });

      console.log('✅ Widget data updated:', widgetData);
    } catch (error) {
      console.error('Error updating widget data:', error);
    }
  }

  // Get current volunteer progress for widget
  async getWidgetData(): Promise<VolunteerProgress | null> {
    try {
      const result = await Preferences.get({ key: this.WIDGET_DATA_KEY });
      if (result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error('Error getting widget data:', error);
      return null;
    }
  }

  // Calculate progress from user's volunteer data
  async calculateProgress(
    currentHours: number, 
    goalHours: number = 100,
    completedCount: number = 0,
    ongoingCount: number = 0
  ): Promise<VolunteerProgress> {
    const percentage = Math.min(Math.round((currentHours / goalHours) * 100), 100);
    
    const progress: VolunteerProgress = {
      currentHours: Math.round(currentHours * 10) / 10, // Round to 1 decimal
      goalHours,
      percentage,
      completedOpportunities: completedCount,
      ongoingOpportunities: ongoingCount,
      lastUpdated: new Date().toISOString()
    };

    // Update widget with new progress
    await this.updateWidgetData(progress);
    
    return progress;
  }

  // Log volunteer hours and update widget
  async logVolunteerHours(hours: number, opportunityId: string, description: string = ''): Promise<void> {
    try {
      // Get existing hours data
      const existingData = await Preferences.get({ key: this.USER_HOURS_KEY });
      let hoursLog: any[] = [];
      
      if (existingData.value) {
        hoursLog = JSON.parse(existingData.value);
      }

      // Add new entry
      const newEntry = {
        id: Date.now().toString(),
        hours,
        opportunityId,
        description,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };

      hoursLog.push(newEntry);

      // Save updated log
      await Preferences.set({
        key: this.USER_HOURS_KEY,
        value: JSON.stringify(hoursLog)
      });

      // Calculate total hours and update widget
      const totalHours = hoursLog.reduce((sum, entry) => sum + entry.hours, 0);
      await this.calculateProgress(totalHours);

      console.log('✅ Logged volunteer hours:', newEntry);
    } catch (error) {
      console.error('Error logging volunteer hours:', error);
    }
  }

  // Get total volunteer hours
  async getTotalVolunteerHours(): Promise<number> {
    try {
      const result = await Preferences.get({ key: this.USER_HOURS_KEY });
      if (result.value) {
        const hoursLog = JSON.parse(result.value);
        return hoursLog.reduce((sum: number, entry: any) => sum + entry.hours, 0);
      }
      return 0;
    } catch (error) {
      console.error('Error getting total hours:', error);
      return 0;
    }
  }

  // Get volunteer hours history
  async getVolunteerHoursHistory(): Promise<any[]> {
    try {
      const result = await Preferences.get({ key: this.USER_HOURS_KEY });
      if (result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      console.error('Error getting hours history:', error);
      return [];
    }
  }

  // Format progress for display
  formatProgress(progress: VolunteerProgress): string {
    return `${progress.currentHours}/${progress.goalHours} hours (${progress.percentage}%)`;
  }

  // Get progress status message
  getProgressMessage(progress: VolunteerProgress): string {
    if (progress.percentage >= 100) {
      return '🎉 Goal achieved!';
    } else if (progress.percentage >= 75) {
      return '🔥 Almost there!';
    } else if (progress.percentage >= 50) {
      return '💪 Halfway there!';
    } else if (progress.percentage >= 25) {
      return '📈 Making progress!';
    } else {
      return '🌟 Just getting started!';
    }
  }
}

export const volunteerWidgetService = new VolunteerWidgetService();
