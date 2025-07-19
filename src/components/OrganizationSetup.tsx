import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface OrganizationSetupProps {
  onComplete: () => void;
  initialData?: any;
}

const OrganizationSetup: React.FC<OrganizationSetupProps> = ({ onComplete, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationCategory: '',
    organizationDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load data from props or localStorage
    const loadInitialData = () => {
      let dataToLoad = initialData;
      
      if (!dataToLoad) {
        const incompleteData = localStorage.getItem('incompleteOrgData');
        if (incompleteData) {
          dataToLoad = JSON.parse(incompleteData);
        }
      }

      if (dataToLoad) {
        setFormData({
          organizationName: dataToLoad.name || '',
          organizationCategory: dataToLoad.category || '',
          organizationDescription: dataToLoad.description || '',
          address: dataToLoad.address_line1 || '',
          city: dataToLoad.city || '',
          state: dataToLoad.state || '',
          zipCode: dataToLoad.zip_code || ''
        });
      }
    };

    loadInitialData();
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to complete your organization setup.",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        { field: 'organizationName', label: 'Organization Name' },
        { field: 'address', label: 'Address' },
        { field: 'city', label: 'City' },
        { field: 'state', label: 'State' },
        { field: 'zipCode', label: 'ZIP Code' }
      ];
      
      const missingFields = requiredFields.filter(
        ({ field }) => !formData[field as keyof typeof formData]?.trim()
      );

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        });
        return;
      }

      const orgPayload = {
        user_id: user.id,
        name: formData.organizationName,
        category: formData.organizationCategory || null,
        description: formData.organizationDescription || null,
        address_line1: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      };

      console.log('Submitting organization data:', orgPayload);

      const { error } = await supabase
        .from('organizations')
        .insert(orgPayload);

      if (error) {
        console.error('Error saving organization:', error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: error.message || "Could not save organization data. Please try again.",
        });
        return;
      }

      // Clear incomplete data from localStorage
      localStorage.removeItem('incompleteOrgData');

      toast({
        title: "Organization Profile Complete!",
        description: "Your organization has been set up successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Error in organization setup:', error);
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Building2 className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">Complete Your Setup</span>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <CardTitle>Organization Information Required</CardTitle>
            </div>
            <CardDescription>
              Please complete your organization profile to continue using Experiential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationCategory">Organization Category</Label>
                <Select 
                  value={formData.organizationCategory} 
                  onValueChange={(value) => handleInputChange('organizationCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="animal_care">Animal Care</SelectItem>
                    <SelectItem value="community_service">Community Service</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationDescription">Organization Description</Label>
                <Input
                  id="organizationDescription"
                  value={formData.organizationDescription}
                  onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                  placeholder="Brief description of your organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="ZIP Code"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationSetup;