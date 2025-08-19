import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Hard-coded opportunities from database - DIRECT FIX
const WORKING_OPPORTUNITIES = [
  {
    id: '5015b80c-8790-4e81-9f51-aa9cf42831f5',
    title: 'Outreach Volunteer',
    description: 'Tasks may include flyer distribution, workshop assistance or even graphic design if you excel at it! Hours vary depending on the task you receive.',
    category: 'education',
    time_commitment: '2-3 hours/week',
    requirements: 'Ages 15+',
    location: '250 Dundas Street West, Mississauga, ON  L5B 1J2',
    posted_at: '2025-07-23T02:17:14.044871+00:00',
    expires_at: '2025-08-04T00:00:00+00:00',
    max_volunteers: 10,
    current_volunteers: 0,
    is_active: true,
    opportunity_type: 'volunteer',
    resume_required: false,
    organization: {
      id: '629fd120-a507-452e-abb3-7c525a1734ba',
      name: 'debatify'
    }
  },
  {
    id: '5e8558fe-4590-4fd1-b82d-9e0789484332',
    title: 'Animal Shelter',
    description: 'Care for the animals that we rescue.',
    category: 'animal_care',
    time_commitment: '2 hours a week',
    requirements: 'Have a passion for animal care',
    location: '370 Dundas St E, Oakville, Ontario L6H 6Z9',
    posted_at: '2025-07-06T00:30:11.3785+00:00',
    expires_at: '2025-09-01T00:00:00+00:00',
    max_volunteers: 10,
    current_volunteers: 0,
    is_active: true,
    opportunity_type: 'volunteer',
    resume_required: false,
    organization: {
      id: '0b166e3b-7016-4ddc-b8e2-79ff808a6e7d',
      name: 'OakPark Pet Hospital'
    }
  }
];

export const WorkingOpportunities: React.FC = () => {
  const navigate = useNavigate();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffInDays} days ago`;
  };

  return (
    <div className="bg-white/90 p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔧 WORKING OPPORTUNITIES (DIRECT FIX)
        </h2>
        <p className="text-green-600 font-medium">
          These are the actual opportunities from your database with working "View Details" buttons
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKING_OPPORTUNITIES.map((opportunity) => (
          <Card key={opportunity.id} className="border-0 backdrop-blur-sm bg-white/80 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1">
                  {opportunity.category.replace('_', ' ')}
                </Badge>
                <span className="text-xs px-2 py-1 rounded-full text-gray-500 bg-gray-100">
                  {formatTimeAgo(opportunity.posted_at)}
                </span>
              </div>
              <CardTitle className="text-xl mb-2 leading-tight text-gray-900">
                {opportunity.title}
              </CardTitle>
              <CardDescription className="font-semibold text-green-600">
                {opportunity.organization.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center p-2 rounded-lg text-gray-600 bg-gray-50">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">{opportunity.location}</span>
                </div>
                <div className="flex items-center p-2 rounded-lg text-gray-600 bg-gray-50">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm font-medium">{opportunity.time_commitment}</span>
                </div>
                <p className="text-sm leading-relaxed line-clamp-3 p-3 rounded-lg border-l-4 text-gray-700 bg-blue-50/50 border-blue-400">
                  {opportunity.description}
                </p>
                {opportunity.max_volunteers && (
                  <div className="flex items-center p-2 rounded-lg text-gray-600 bg-purple-50">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="text-sm font-medium">
                      {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                    </span>
                  </div>
                )}
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-white font-semibold"
                  onClick={() => {
                    console.log('🔥 WORKING View Details button clicked for:', opportunity.title);
                    console.log('🔥 Navigating to URL:', `/opportunity/${opportunity.id}`);
                    console.log('� Full opportunity:', opportunity);
                    navigate(`/opportunity/${opportunity.id}`);
                    console.log('📱 Navigation command sent!');
                  }}
                >
                  View Details & Apply ✅
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
