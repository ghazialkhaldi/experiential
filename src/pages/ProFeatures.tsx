import { useState } from "react";
import { Crown, Zap, Star, Clock, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useMode } from "@/contexts/ModeContext";
import { Link } from "react-router-dom";

const ProFeatures = () => {
  const { subscribed, subscription_tier, createCheckoutSession, loading } = useSubscription();
  const { user } = useAuth();
  const { isInternshipMode } = useMode();

  const features = [
    {
      icon: TrendingUp,
      title: "Priority Application Placement",
      description: `Your applications appear first when ${isInternshipMode ? 'companies' : 'organizations'} review candidates, giving you maximum visibility.`,
      highlight: true
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Your applications are processed immediately and marked with Pro status for instant recognition.",
      highlight: true
    },
    {
      icon: Star,
      title: "Premium Badge",
      description: "Stand out with a premium badge that shows your commitment to excellence.",
      highlight: false
    },
    {
      icon: Clock,
      title: "Early Access Features",
      description: "Get access to new features before they're released to the general public.",
      highlight: false
    }
  ];

  const stats = [
    { label: "Higher Response Rate", value: "3x" },
    { label: "Faster Processing", value: "Instant" },
    { label: "Premium Support", value: "24/7" }
  ];

  return (
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className={`h-12 w-12 mr-3 ${isInternshipMode ? 'text-yellow-400' : 'text-purple-600'}`} />
            <h1 className={`text-4xl font-bold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
              Experiential Pro
            </h1>
          </div>
          <p className={`text-xl ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Get your {isInternshipMode ? 'internship applications' : 'volunteer applications'} seen first. 
            Stand out from the crowd with premium placement and priority processing.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className={`text-center ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardContent className="pt-6">
                <div className={`text-3xl font-bold ${isInternshipMode ? 'text-yellow-400' : 'text-purple-600'} mb-2`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className={`${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} ${feature.highlight ? 'ring-2 ring-purple-500' : ''}`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isInternshipMode ? 'bg-gray-700' : 'bg-purple-100'}`}>
                    <feature.icon className={`h-6 w-6 ${isInternshipMode ? 'text-yellow-400' : 'text-purple-600'}`} />
                  </div>
                  <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                    {feature.highlight && (
                      <Badge className="ml-2 bg-purple-600 text-white">Featured</Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing */}
        <Card className={`max-w-md mx-auto ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
              Pro Subscription
            </CardTitle>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-4xl font-bold ${isInternshipMode ? 'text-yellow-400' : 'text-purple-600'}`}>
                $4.99
              </span>
              <span className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                /month
              </span>
            </div>
            <CardDescription className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Cancel anytime. No hidden fees.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {['Priority application placement', 'Instant processing', 'Premium badge', 'Early access features'].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {subscribed ? (
              <div className="space-y-3">
                <div className={`text-center p-3 rounded-lg ${isInternshipMode ? 'bg-green-900/50' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <Crown className={`h-5 w-5 ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`font-semibold ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`}>
                      Pro Active
                    </span>
                  </div>
                  <p className={`text-sm ${isInternshipMode ? 'text-green-300' : 'text-green-600'} mt-1`}>
                    You're all set! Your applications are being prioritized.
                  </p>
                </div>
                <Link to="/billing">
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={createCheckoutSession}
                disabled={loading || !user}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3"
              >
                {loading ? (
                  "Processing..."
                ) : !user ? (
                  <>
                    <Link to="/auth" className="flex items-center space-x-2">
                      <span>Sign In to Join Pro</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Crown className="h-5 w-5 mr-2" />
                    Join Pro Now
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className={`${isInternshipMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
          >
            ← Back to {isInternshipMode ? 'Internships' : 'Opportunities'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProFeatures;