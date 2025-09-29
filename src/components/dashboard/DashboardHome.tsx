import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, TrendingUp, FileText, Calendar, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import EditPostModal from "@/components/dashboard/EditPostModal";

interface DashboardHomeProps {
  onTabChange?: (tab: string) => void;
}

const DashboardHome = ({ onTabChange }: DashboardHomeProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [stats, setStats] = useState([
    {
      label: "Posts Created",
      value: "0",
      change: "+0%",
      icon: FileText,
      color: "text-purple-400"
    },
    {
      label: "Total Engagement",
      value: "0",
      change: "+0%",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      label: "Posts Scheduled",
      value: "0",
      change: "+0",
      icon: Calendar,
      color: "text-cyan-400"
    },
    {
      label: "Followers Gained",
      value: "0",
      change: "+0%",
      icon: Users,
      color: "text-success"
    }
  ]);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setUserName(data?.full_name || 'there');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserName('there');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch content stats
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (contentError) throw contentError;

      // Calculate stats
      const totalPosts = content?.length || 0;
      const scheduledPosts = content?.filter(c => c.status === 'scheduled').length || 0;
      const publishedPosts = content?.filter(c => c.status === 'published').length || 0;

      setStats([
        {
          label: "Posts Created",
          value: totalPosts.toString(),
          change: "+12%",
          icon: FileText,
          color: "text-purple-400"
        },
        {
          label: "Total Engagement",
          value: "0", // Would calculate from actual engagement data
          change: "+0%",
          icon: TrendingUp,
          color: "text-blue-400"
        },
        {
          label: "Posts Scheduled",
          value: scheduledPosts.toString(),
          change: `+${scheduledPosts}`,
          icon: Calendar,
          color: "text-cyan-400"
        },
        {
          label: "Published Posts",
          value: publishedPosts.toString(),
          change: `+${publishedPosts}`,
          icon: Users,
          color: "text-success"
        }
      ]);

      // Set recent content
      setRecentContent(content?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      return diffHours === 0 ? 'Just now' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const handleEditPost = (content: any) => {
    setEditingContent(content);
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hello, {loadingProfile ? '...' : userName}! 👋
          </h1>
          <p className="text-text-secondary text-lg">
            Ready to create amazing content today?
          </p>
        </div>
        
        <Button 
          className="btn-hero mt-4 md:mt-0"
          onClick={() => navigate('/create-post')}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Content
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="card-glass card-hover p-6 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-white/10 to-white/5 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-success text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="card-glass card-hover p-6 rounded-2xl group cursor-pointer"
          onClick={() => navigate('/create-post')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">AI Content Generator</h3>
          <p className="text-text-secondary">Create engaging posts with AI assistance in seconds</p>
        </div>

        <div 
          className="card-glass card-hover p-6 rounded-2xl group cursor-pointer"
          onClick={() => onTabChange?.('schedule')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Schedule Posts</h3>
          <p className="text-text-secondary">Plan and schedule your content for optimal times</p>
        </div>

        <div 
          className="card-glass card-hover p-6 rounded-2xl group cursor-pointer"
          onClick={() => onTabChange?.('analytics')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">View Analytics</h3>
          <p className="text-text-secondary">Track performance and optimize your strategy</p>
        </div>
      </div>

      {/* Recent Content */}
      <div className="card-glass rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Content</h2>
          <Button 
            variant="ghost" 
            className="text-purple-400 hover:text-blue-400"
            onClick={() => onTabChange?.('library')}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-text-secondary mt-2">Loading content...</p>
            </div>
          ) : recentContent.length > 0 ? (
            recentContent.map((content, index) => (
              <div 
                key={content.id}
                onClick={() => handleEditPost(content)}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                {/* Image thumbnail if available */}
                {content.image_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    <img 
                      src={content.image_url} 
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1 group-hover:text-gradient transition-all">
                    {content.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-md">
                      {content.content_type.replace('_', ' ')}
                    </span>
                    <span>{formatDate(content.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    content.status === 'published' 
                      ? 'bg-success/20 text-success' 
                      : content.status === 'scheduled'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-white/20 text-white'
                  }`}>
                    {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">No content created yet.</p>
              <Button 
                className="btn-hero mt-4"
                onClick={() => navigate('/create-post')}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tips & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Performance Insights
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-text-secondary">Best posting time</span>
              <span className="text-white font-medium">Tuesday 9-11 AM</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-text-secondary">Top performing content</span>
              <span className="text-white font-medium">Educational posts</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-text-secondary">Engagement rate</span>
              <span className="text-success font-medium">+34% this week</span>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-400" />
            Content Ideas
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <p className="text-white font-medium mb-1">Industry trend analysis</p>
              <p className="text-text-secondary text-sm">Share insights about recent changes in your industry</p>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <p className="text-white font-medium mb-1">Client success story</p>
              <p className="text-text-secondary text-sm">Highlight a recent win with lessons learned</p>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <p className="text-white font-medium mb-1">Behind-the-scenes</p>
              <p className="text-text-secondary text-sm">Show your work process or team culture</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      {editingContent && (
        <EditPostModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          content={editingContent}
          onSuccess={() => {
            fetchDashboardData();
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardHome;