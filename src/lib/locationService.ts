import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface OpportunityWithDistance {
  id: string;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // in miles
  [key: string]: any;
}

class LocationService {
  private userLocation: UserLocation | null = null;
  private isLocationEnabled = false;

  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Fallback for web - use browser geolocation
        return await this.getBrowserLocation();
      }

      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          console.log('Location permission denied');
          return null;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      this.isLocationEnabled = true;
      console.log('✅ Location detected:', this.userLocation);
      return this.userLocation;

    } catch (error) {
      console.error('Location error:', error);
      this.isLocationEnabled = false;
      return null;
    }
  }

  private async getBrowserLocation(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.userLocation = location;
          this.isLocationEnabled = true;
          resolve(location);
        },
        (error) => {
          console.error('Browser geolocation error:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Sort opportunities by distance from user location
  async sortOpportunitiesByDistance(opportunities: any[]): Promise<OpportunityWithDistance[]> {
    if (!this.userLocation && !(await this.getCurrentLocation())) {
      // Return opportunities as-is if no location available
      return opportunities.map(opp => ({
        ...opp,
        distance: undefined
      }));
    }

    if (!this.userLocation) return opportunities;

    const opportunitiesWithDistance = opportunities.map(opportunity => {
      let distance: number | undefined = undefined;

      if (opportunity.latitude && opportunity.longitude) {
        distance = this.calculateDistance(
          this.userLocation!.latitude,
          this.userLocation!.longitude,
          opportunity.latitude,
          opportunity.longitude
        );
      }

      return {
        ...opportunity,
        distance
      };
    });

    // Sort by distance - closest first, then opportunities without location
    return opportunitiesWithDistance.sort((a, b) => {
      if (a.distance === undefined && b.distance === undefined) return 0;
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
  }

  getUserLocation(): UserLocation | null {
    return this.userLocation;
  }

  isLocationServiceEnabled(): boolean {
    return this.isLocationEnabled;
  }

  formatDistance(distance: number | undefined): string {
    if (distance === undefined) return '';
    if (distance < 1) {
      return `${(distance * 5280).toFixed(0)} ft away`;
    }
    return `${distance.toFixed(1)} mi away`;
  }
}

export const locationService = new LocationService();
