import { useState, useEffect } from "react";
import { CreditCard, Calendar, DollarSign, AlertCircle, Crown, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useMode } from "@/contexts/ModeContext";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Billing = () => {
  const { subscribed, subscription_tier, subscription_end, manageSubscription, loading } = useSubscription();
  const { user } = useAuth();
  const { isInternshipMode } = useMode();
  
  // Mock payment history - in a real app, this would come from Stripe
  const paymentHistory = [
    {
      id: "1",
      date: "2024-01-15",
      amount: 4.99,
      status: "paid",
      description: "Pro Subscription - Monthly"
    },
    {
      id: "2", 
      date: "2023-12-15",
      amount: 4.99,
      status: "paid",
      description: "Pro Subscription - Monthly"
    },
    {
      id: "3",
      date: "2023-11-15", 
      amount: 4.99,
      status: "paid",
      description: "Pro Subscription - Monthly"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <Card className={`w-full max-w-md ${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardHeader className="text-center">
            <AlertCircle className={`h-12 w-12 mx-auto mb-4 ${isInternshipMode ? 'text-red-400' : 'text-red-600'}`} />
            <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
              Authentication Required
            </CardTitle>
            <CardDescription className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Please sign in to view your billing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/auth">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
              Billing & Subscription
            </h1>
            <p className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Manage your Pro subscription and view payment history
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Status */}
          <div className="space-y-6">
            <Card className={`${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                  <Crown className="h-5 w-5" />
                  <span>Subscription Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscribed ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Current Plan
                      </span>
                      <Badge className="bg-purple-600 text-white">
                        {subscription_tier || 'Pro'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Status
                      </span>
                      <Badge className="bg-green-600 text-white">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Next Billing
                      </span>
                      <span className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                        {subscription_end ? formatDate(subscription_end) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Amount
                      </span>
                      <span className={`font-semibold ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                        $4.99/month
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className={`h-12 w-12 mx-auto mb-4 ${isInternshipMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <p className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                      You don't have an active Pro subscription
                    </p>
                    <Link to="/pro">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manage Subscription */}
            {subscribed && (
              <Card className={`${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <CardTitle className={`${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                    Subscription Management
                  </CardTitle>
                  <CardDescription className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Update payment method, view invoices, or cancel your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={manageSubscription}
                    disabled={loading}
                    className="w-full flex items-center space-x-2"
                    variant="outline"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Manage Subscription</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <p className={`text-xs ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>
                    This will open Stripe's secure customer portal
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment History */}
          <div>
            <Card className={`${isInternshipMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                  <Calendar className="h-5 w-5" />
                  <span>Payment History</span>
                </CardTitle>
                <CardDescription className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your recent subscription payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscribed ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className={`p-4 rounded-lg border ${isInternshipMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className={`h-4 w-4 ${isInternshipMode ? 'text-green-400' : 'text-green-600'}`} />
                            <span className={`font-medium ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                              ${payment.amount.toFixed(2)}
                            </span>
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className={`text-sm ${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {payment.description}
                        </p>
                        <p className={`text-xs ${isInternshipMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {formatDate(payment.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className={`h-12 w-12 mx-auto mb-4 ${isInternshipMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <p className={`${isInternshipMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      No payment history available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;