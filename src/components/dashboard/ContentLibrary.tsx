import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Calendar, Edit, Trash2, Share, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";


const ContentLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content library.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;
      
      setContent(prev => prev.filter(item => item.id !== contentId));
      toast({
        title: "Deleted",
        description: "Content deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content.",
        variant: "destructive",
      });
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.content_type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/20 text-success';
      case 'scheduled':
        return 'bg-warning/20 text-warning';
      case 'draft':
        return 'bg-white/20 text-white';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'educational':
        return 'bg-accent-purple/20 text-accent-purple';
      case 'engagement':
        return 'bg-accent-blue/20 text-accent-blue';
      case 'lead-magnet':
      case 'lead_magnet':
        return 'bg-accent-cyan/20 text-accent-cyan';
      case 'company-update':
      case 'company_update':
        return 'bg-success/20 text-success';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const getImageStyleBadge = (imageStyle: string) => {
    const styles: Record<string, string> = {
      'realistic_photo': 'Realistic Photo',
      'digital_illustration': 'Digital Illustration',
      'abstract_art': 'Abstract Art',
      'minimalist': 'Minimalist',
      '3d_render': '3D Render',
      'watercolor': 'Watercolor',
      'line_art': 'Line Art',
      'corporate': 'Corporate'
    };
    return styles[imageStyle] || imageStyle;
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Content Library
          </h1>
          <p className="text-text-secondary text-lg">
            Manage and organize all your LinkedIn content
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}
          >
            <Grid className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search content..."
                className="input-glass pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="input-glass w-48">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent className="bg-navy-800 border-white/20">
              <SelectItem value="all" className="text-white">All Types</SelectItem>
              <SelectItem value="educational" className="text-white">Educational</SelectItem>
              <SelectItem value="engagement" className="text-white">Engagement</SelectItem>
              <SelectItem value="lead-magnet" className="text-white">Lead Magnet</SelectItem>
              <SelectItem value="company-update" className="text-white">Company Update</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="input-glass w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-navy-800 border-white/20">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="published" className="text-white">Published</SelectItem>
              <SelectItem value="scheduled" className="text-white">Scheduled</SelectItem>
              <SelectItem value="draft" className="text-white">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Grid/List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-secondary mt-4">Loading your content...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item, index) => (
            <div 
              key={item.id}
              className="card-glass card-hover rounded-2xl p-6 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(item.content_type)}`}>
                      {item.content_type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.image_style && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-300">
                        {getImageStyleBadge(item.image_style)}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg leading-tight mb-2 group-hover:text-gradient transition-all">
                    {item.title}
                  </h3>
                </div>
                
                <Button variant="ghost" size="icon" className="text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview */}
              <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                {item.body.substring(0, 100)}...
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-text-secondary text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 font-medium">
                    {item.status === 'published' ? 'Published' : item.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/60 hover:text-error h-8 w-8"
                    onClick={() => handleDeleteContent(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass rounded-2xl p-6">
          <div className="space-y-4">
            {filteredContent.map((item, index) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(item.content_type)}`}>
                      {item.content_type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.image_style && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-300">
                        {getImageStyleBadge(item.image_style)}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1 group-hover:text-gradient transition-all">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span>{item.status === 'published' ? 'Published' : item.status === 'scheduled' ? 'Scheduled' : 'Draft'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/60 hover:text-error h-8 w-8"
                    onClick={() => handleDeleteContent(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
          <p className="text-text-secondary mb-6">
            Try adjusting your search terms or filters
          </p>
          <Button className="btn-glass">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;