import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CLEANUP-OPPORTUNITIES] Starting cleanup process");

    // Use service role key for administrative operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get current date for comparison
    const today = new Date().toISOString().split('T')[0];
    console.log("[CLEANUP-OPPORTUNITIES] Current date:", today);

    // Find expired opportunities
    const { data: expiredOpportunities, error: fetchError } = await supabase
      .from('opportunities')
      .select('id, title, end_date, organization:organizations(name)')
      .lt('end_date', today)
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`Failed to fetch expired opportunities: ${fetchError.message}`);
    }

    console.log(`[CLEANUP-OPPORTUNITIES] Found ${expiredOpportunities?.length || 0} expired opportunities`);

    if (!expiredOpportunities || expiredOpportunities.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No expired opportunities to clean up",
        cleaned: 0,
        date: today
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Delete expired opportunities
    const { error: deleteError } = await supabase
      .from('opportunities')
      .delete()
      .lt('end_date', today)
      .eq('is_active', true);

    if (deleteError) {
      throw new Error(`Failed to delete expired opportunities: ${deleteError.message}`);
    }

    // Log each cleaned opportunity
    expiredOpportunities.forEach(opp => {
      console.log(`[CLEANUP-OPPORTUNITIES] Deleted: ${opp.title} (ID: ${opp.id}, End Date: ${opp.end_date})`);
    });

    const cleanedCount = expiredOpportunities.length;
    console.log(`[CLEANUP-OPPORTUNITIES] Successfully cleaned up ${cleanedCount} expired opportunities`);

    return new Response(JSON.stringify({ 
      message: "Cleanup completed successfully",
      cleaned: cleanedCount,
      opportunities: expiredOpportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        endDate: opp.end_date,
        organization: opp.organization?.name
      })),
      date: today
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("[CLEANUP-OPPORTUNITIES] Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});