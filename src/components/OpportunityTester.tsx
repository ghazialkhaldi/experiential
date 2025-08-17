import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OpportunityDetailDialog from '@/components/OpportunityDetailDialog';

export const OpportunityTester: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-run test on component mount
  useEffect(() => {
    testDirectQuery();
  }, []);

  const testDirectQuery = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Testing direct opportunity query...');
      
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          organization:organizations (
            name,
            id
          )
        `)
        .eq('is_active', true)
        .eq('opportunity_type', 'volunteer')
        .order('posted_at', { ascending: false });

      console.log('📊 Direct query result:', { 
        dataCount: data?.length || 0, 
        error: error?.message || null,
        data: data || []
      });

      if (error) {
        throw error;
      }

      setOpportunities(data || []);
      
    } catch (err: any) {
      console.error('❌ Direct query failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Opportunity Tester</CardTitle>
        <CardDescription>
          Test direct database queries for opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testDirectQuery} 
          disabled={loading}
          variant="default"
        >
          {loading ? 'Testing...' : 'Test Direct Query'}
        </Button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {opportunities.length > 0 && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <h3 className="font-semibold mb-2">Found {opportunities.length} opportunities:</h3>
            <div className="space-y-2">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-3 rounded border">
                  <div className="font-medium">{opp.title}</div>
                  <div className="text-sm text-gray-600">
                    Org: {opp.organization?.name || 'No org'} | 
                    Location: {opp.location} | 
                    Type: {opp.opportunity_type} |
                    Active: {opp.is_active ? 'Yes' : 'No'}
                  </div>
                  <div className="text-xs text-gray-500">ID: {opp.id}</div>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      console.log('🧪 Testing dialog with opportunity:', opp.id);
                      setSelectedOpportunity(opp);
                      setDialogOpen(true);
                    }}
                  >
                    Test Dialog
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && opportunities.length === 0 && !error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            No opportunities found. Click "Test Direct Query" to check database.
          </div>
        )}
      </CardContent>
      
      {/* Test Dialog */}
      <OpportunityDetailDialog
        opportunity={selectedOpportunity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Card>
  );
};
