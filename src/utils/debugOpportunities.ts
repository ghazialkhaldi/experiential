// Development helper to create sample opportunities for testing
import { supabase } from '@/integrations/supabase/client';

export const createSampleOpportunity = async () => {
  try {
    console.log('🏗️ Creating sample opportunity for testing...');
    
    // First, check if we have any organizations
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, user_id')
      .limit(1);
      
    if (orgError) {
      console.error('❌ Error fetching organizations:', orgError);
      return { error: orgError };
    }
    
    if (!orgs || orgs.length === 0) {
      console.log('⚠️ No organizations found. Need to create an organization first.');
      return { error: 'No organizations available' };
    }
    
    const org = orgs[0];
    console.log('🏢 Using organization:', org.name);
    
    // Create a sample opportunity
    const sampleOpportunity = {
      organization_id: org.id,
      title: 'Community Garden Helper - TEST OPPORTUNITY',
      description: 'Help maintain our community garden by planting, weeding, and harvesting fresh vegetables for local families in need. This is a great opportunity to learn about sustainable agriculture while making a positive impact in your community.',
      category: 'environment',
      time_commitment: '2-4 hours per week',
      requirements: 'No experience necessary. Must be able to work outdoors.',
      location: '123 Garden St, San Francisco, CA 94102',
      max_volunteers: 5,
      current_volunteers: 2,
      opportunity_type: 'volunteer',
      is_active: true,
      resume_required: false
    };
    
    const { data, error } = await supabase
      .from('opportunities')
      .insert(sampleOpportunity)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error creating sample opportunity:', error);
      return { error };
    }
    
    console.log('✅ Sample opportunity created successfully:', data);
    return { data };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { error };
  }
};

export const checkOpportunityData = async () => {
  try {
    console.log('🔍 Checking opportunity data structure...');
    
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        organization:organizations (
          name,
          id
        )
      `)
      .eq('is_active', true)
      .limit(3);
      
    if (error) {
      console.error('❌ Error fetching opportunities:', error);
      return { error };
    }
    
    console.log('📊 Found opportunities:', opportunities?.length || 0);
    if (opportunities && opportunities.length > 0) {
      console.log('📋 Sample opportunity structure:', JSON.stringify(opportunities[0], null, 2));
    }
    
    return { opportunities };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { error };
  }
};
