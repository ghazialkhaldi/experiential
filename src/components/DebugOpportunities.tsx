import React from 'react';
import { Button } from '@/components/ui/button';
import { checkOpportunityData, createSampleOpportunity } from '@/utils/debugOpportunities';

const DebugOpportunities = () => {
  const handleCheckData = async () => {
    const result = await checkOpportunityData();
    console.log('Check result:', result);
  };
  
  const handleCreateSample = async () => {
    const result = await createSampleOpportunity();
    console.log('Create result:', result);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button 
        onClick={handleCheckData}
        variant="outline"
        size="sm"
        className="bg-blue-500 text-white"
      >
        Check Opportunities
      </Button>
      <Button 
        onClick={handleCreateSample}
        variant="outline"
        size="sm"
        className="bg-green-500 text-white"
      >
        Create Sample
      </Button>
    </div>
  );
};

export default DebugOpportunities;
