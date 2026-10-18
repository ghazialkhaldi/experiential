import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { PageShell, RequireAuth } from '@/components/layout/PageShell';
import { Shield, Users } from 'lucide-react';

interface UserData {
  profiles: any[];
  organizations: any[];
  applications: any[];
  notifications: any[];
  volunteerHours: any[];
  savedOpportunities: any[];
  opportunityLikes: any[];
  subscribers: any[];
}

function AdminContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    profiles: [],
    organizations: [],
    applications: [],
    notifications: [],
    volunteerHours: [],
    savedOpportunities: [],
    opportunityLikes: [],
    subscribers: []
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const adminStatus = data?.role === 'admin';
    setIsAdmin(adminStatus);
    
    if (adminStatus) {
      fetchAllUserData();
    } else {
      setLoading(false);
    }
  };

  const fetchAllUserData = async () => {
    try {
      const [
        profilesRes,
        orgsRes,
        appsRes,
        notificationsRes,
        hoursRes,
        savedRes,
        likesRes,
        subscribersRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('organizations').select('*').order('created_at', { ascending: false }),
        supabase.from('applications').select('*, opportunities(title)').order('applied_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('volunteer_hours').select('*').order('date_completed', { ascending: false }),
        supabase.from('saved_opportunities').select('*, opportunities(title)').order('created_at', { ascending: false }),
        supabase.from('opportunity_likes').select('*, opportunities(title)').order('created_at', { ascending: false }),
        supabase.from('subscribers').select('*').order('created_at', { ascending: false })
      ]);

      setUserData({
        profiles: profilesRes.data || [],
        organizations: orgsRes.data || [],
        applications: appsRes.data || [],
        notifications: notificationsRes.data || [],
        volunteerHours: hoursRes.data || [],
        savedOpportunities: savedRes.data || [],
        opportunityLikes: likesRes.data || [],
        subscribers: subscribersRes.data || []
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div>
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have admin privileges to access this dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Card>
          <CardContent className="p-6">
            <p>Loading admin dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="text-muted-foreground">Everything in the database, newest first.</p>
      </div>

      <dl className="mb-8 flex flex-wrap gap-x-10 gap-y-3 border-y border-border py-4 text-sm">
        {[
          ['Users', userData.profiles.length],
          ['Organizations', userData.organizations.length],
          ['Applications', userData.applications.length],
          ['Hours logged', userData.volunteerHours.reduce((total, hour) => total + Number(hour.hours), 0)],
        ].map(([label, value]) => (
          <div key={label as string} className="flex items-baseline gap-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular text-lg font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>User Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.profiles.map((profile) => (
                    <div key={profile.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{profile.first_name} {profile.last_name}</h3>
                        <Badge variant={profile.role === 'admin' ? 'destructive' : profile.role === 'volunteer_searcher' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Age: {profile.age || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">Birthday: {profile.birthday}</p>
                      <p className="text-sm text-muted-foreground">ID: {profile.id}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.organizations.map((org) => (
                    <div key={org.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">{org.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {org.address_line1}, {org.city}, {org.state} {org.zip_code}
                      </p>
                      <p className="text-sm text-muted-foreground">User ID: {org.user_id}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{app.applicant_name}</h3>
                        <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Email: {app.applicant_email}</p>
                      <p className="text-sm text-muted-foreground">Opportunity: {app.opportunities?.title}</p>
                      <p className="text-sm text-muted-foreground">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant={notification.is_read ? 'secondary' : 'default'}>
                          {notification.is_read ? 'Read' : 'Unread'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">User ID: {notification.user_id}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.volunteerHours.map((hour) => (
                    <div key={hour.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{hour.title}</h3>
                      <p className="text-sm text-muted-foreground">Organization: {hour.organization}</p>
                      <p className="text-sm text-muted-foreground">Hours: {hour.hours}</p>
                      <p className="text-sm text-muted-foreground">Date: {hour.date_completed}</p>
                      <p className="text-sm text-muted-foreground">User ID: {hour.user_id}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.savedOpportunities.map((saved) => (
                    <div key={saved.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{saved.opportunities?.title}</h3>
                      <p className="text-sm text-muted-foreground">User ID: {saved.user_id}</p>
                      <p className="text-sm text-muted-foreground">Saved: {new Date(saved.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.opportunityLikes.map((like) => (
                    <div key={like.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{like.opportunities?.title}</h3>
                      <p className="text-sm text-muted-foreground">User ID: {like.user_id}</p>
                      <p className="text-sm text-muted-foreground">Liked: {new Date(like.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userData.subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{subscriber.email}</h3>
                        <Badge variant={subscriber.subscribed ? 'default' : 'secondary'}>
                          {subscriber.subscribed ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Tier: {subscriber.subscription_tier || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">User ID: {subscriber.user_id}</p>
                      {subscriber.subscription_end && (
                        <p className="text-sm text-muted-foreground">
                          Ends: {new Date(subscriber.subscription_end).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={fetchAllUserData} variant="outline">
          Refresh Data
        </Button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <PageShell>
      <RequireAuth message="Sign in with an admin account.">
        <AdminContent />
      </RequireAuth>
    </PageShell>
  );
}
