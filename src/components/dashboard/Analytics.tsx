import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, FileText, Calendar, Eye, ThumbsUp, Share2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  avgEngagement: number;
  totalViews: number;
}

interface ContentByType {
  type: string;
  count: number;
}

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    scheduledPosts: 0,
    draftPosts: 0,
    avgEngagement: 0,
    totalViews: 0
  });
  const [contentByType, setContentByType] = useState<ContentByType[]>([]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const content = data || [];
      
      // Calculate stats
      const newStats = {
        totalPosts: content.length,
        publishedPosts: content.filter(c => c.status === 'published').length,
        scheduledPosts: content.filter(c => c.status === 'scheduled').length,
        draftPosts: content.filter(c => c.status === 'draft').length,
        avgEngagement: Math.floor(Math.random() * 100), // Mock data
        totalViews: Math.floor(Math.random() * 10000) // Mock data
      };
      
      setStats(newStats);
      
      // Calculate content by type
      const typeCount: { [key: string]: number } = {};
      content.forEach(c => {
        typeCount[c.content_type] = (typeCount[c.content_type] || 0) + 1;
      });
      
      const typeData = Object.entries(typeCount).map(([type, count]) => ({
        type: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count
      }));
      
      setContentByType(typeData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const activityData = [
    { date: 'Mon', posts: 2 },
    { date: 'Tue', posts: 3 },
    { date: 'Wed', posts: 1 },
    { date: 'Thu', posts: 4 },
    { date: 'Fri', posts: 2 },
    { date: 'Sat', posts: 1 },
    { date: 'Sun', posts: 3 }
  ];

  const engagementData = [
    { date: 'Week 1', engagement: 45 },
    { date: 'Week 2', engagement: 67 },
    { date: 'Week 3', engagement: 52 },
    { date: 'Week 4', engagement: 89 }
  ];

  const COLORS = ['hsl(var(--accent-purple))', 'hsl(var(--accent-blue))', 'hsl(var(--accent-cyan))', 'hsl(var(--success-green))'];

  if (loading) {
    return (
      <div className="card-glass rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-text-secondary">Track your content performance and engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-success text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Total Posts</h3>
          <p className="text-3xl font-bold text-white">{stats.totalPosts}</p>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-success text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Total Views</h3>
          <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-success text-sm font-medium">+15%</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Avg. Engagement</h3>
          <p className="text-3xl font-bold text-white">{stats.avgEngagement}%</p>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Published</h3>
          <p className="text-3xl font-bold text-white">{stats.publishedPosts}</p>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Scheduled</h3>
          <p className="text-3xl font-bold text-white">{stats.scheduledPosts}</p>
        </Card>

        <Card className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Drafts</h3>
          <p className="text-3xl font-bold text-white">{stats.draftPosts}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="card-glass p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card-bg))', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="posts" fill="hsl(var(--accent-purple))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Trend */}
        <Card className="card-glass p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ThumbsUp className="w-5 h-5 mr-2 text-purple-400" />
            Engagement Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card-bg))', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(var(--accent-blue))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent-blue))', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Content Distribution */}
        {contentByType.length > 0 && (
          <Card className="card-glass p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-purple-400" />
              Content by Type
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {contentByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card-bg))', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;
