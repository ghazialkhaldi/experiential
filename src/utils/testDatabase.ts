// Quick database test to check opportunity availability
import { supabase } from '@/integrations/supabase/client';

export const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Check opportunities count
    const { data: opportunities, error: opError } = await supabase
      .from('opportunities')
      .select('id, title, is_active, opportunity_type')
      .eq('is_active', true);
      
    console.log('📊 Opportunities found:', opportunities?.length || 0);
    if (opportunities && opportunities.length > 0) {
      console.log('🎯 Sample opportunities:', opportunities.slice(0, 3));
    }
    
    // Test 2: Check organizations
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name');
      
    console.log('🏢 Organizations found:', orgs?.length || 0);
    
    // Test 3: Check if there are any volunteer opportunities specifically
    const { data: volunteerOpps, error: volError } = await supabase
      .from('opportunities')
      .select('id, title')
      .eq('is_active', true)
      .eq('opportunity_type', 'volunteer');
      
    console.log('🤝 Volunteer opportunities:', volunteerOpps?.length || 0);
    
    return {
      opportunitiesCount: opportunities?.length || 0,
      organizationsCount: orgs?.length || 0,
      volunteerOpportunitiesCount: volunteerOpps?.length || 0,
      errors: { opError, orgError, volError }
    };
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { error };
  }
};
