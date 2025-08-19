import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DatabaseStats {
  opportunities: number;
  organizations: number;
  profiles: number;
}

interface SampleOpportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  opportunity_type: string;
  is_active: boolean;
  organization: {
    name: string;
  };
}

export const DatabaseDebugger: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [sampleOpportunities, setSampleOpportunities] = useState<SampleOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Starting database debug check...');
      
      // Check opportunities count
      const { count: oppCount, error: oppError } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true });
      
      if (oppError) throw oppError;
      
      // Check organizations count  
      const { count: orgCount, error: orgError } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true });
        
      if (orgError) throw orgError;
      
      // Check profiles count
      const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (profileError) throw profileError;

      setStats({
        opportunities: oppCount || 0,
        organizations: orgCount || 0,
        profiles: profileCount || 0
      });

      // Get sample opportunities
      const { data: opportunities, error: sampleError } = await supabase
        .from('opportunities')
        .select(`
          id,
          title,
          description,
          location,
          opportunity_type,
          is_active,
          organization:organizations (
            name
          )
        `)
        .limit(5);
        
      if (sampleError) throw sampleError;
      
      setSampleOpportunities(opportunities || []);
      
      console.log('✅ Database check complete:', {
        stats: { opportunities: oppCount, organizations: orgCount, profiles: profileCount },
        sampleOpportunities: opportunities
      });
      
    } catch (err: any) {
      console.error('❌ Database check failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSampleOpportunity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🆕 Creating sample opportunity...');
      
      // First check if we have an organization
      const { data: orgs, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .limit(1);
        
      if (orgError) throw orgError;
      
      if (!orgs || orgs.length === 0) {
        throw new Error('No organizations found. Please create an organization first.');
      }
      
      const sampleOpportunity = {
        title: 'Test Opportunity - Debugging',
        description: 'This is a test opportunity created for debugging purposes.',
        category: 'Community Service',
        time_commitment: 'Part-time',
        requirements: 'No specific requirements',
        location: 'San Francisco, CA',
        opportunity_type: 'volunteer',
        max_volunteers: 10,
        current_volunteers: 0,
        is_active: true,
        organization_id: orgs[0].id,
        posted_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
      
      const { data, error } = await supabase
        .from('opportunities')
        .insert([sampleOpportunity])
        .select();
        
      if (error) throw error;
      
      console.log('✅ Sample opportunity created:', data);
      
      // Refresh the data
      await checkDatabase();
      
    } catch (err: any) {
      console.error('❌ Failed to create sample opportunity:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Database Debugger</CardTitle>
        <CardDescription>
          Debug database connectivity and check opportunity data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={checkDatabase} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Checking...' : 'Refresh Database Stats'}
          </Button>
          <Button 
            onClick={createSampleOpportunity} 
            disabled={loading}
            variant="default"
          >
            {loading ? 'Creating...' : 'Create Sample Opportunity'}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {stats && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <h3 className="font-semibold mb-2">Database Statistics:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Opportunities: {stats.opportunities}</li>
              <li>Organizations: {stats.organizations}</li>
              <li>Profiles: {stats.profiles}</li>
            </ul>
          </div>
        )}
        
        {sampleOpportunities.length > 0 && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <h3 className="font-semibold mb-2">Sample Opportunities:</h3>
            <div className="space-y-2">
              {sampleOpportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-3 rounded border">
                  <div className="font-medium">{opp.title}</div>
                  <div className="text-sm text-gray-600">
                    {opp.organization?.name} • {opp.location} • {opp.opportunity_type}
                  </div>
                  <div className="text-sm">Active: {opp.is_active ? 'Yes' : 'No'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
