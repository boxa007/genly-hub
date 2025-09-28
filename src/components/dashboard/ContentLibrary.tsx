import { useState } from "react";
import { Search, Filter, Grid, List, Calendar, Edit, Trash2, Share, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockContent = [
  {
    id: 1,
    title: "5 Marketing Automation Mistakes That Are Costing You Leads",
    type: "Educational Post",
    status: "Published",
    engagement: "127 likes, 23 comments",
    date: "2024-01-15",
    preview: "📊 The biggest mistake I see companies make with LinkedIn? Treating it like Facebook...",
    hashtags: ["#MarketingAutomation", "#LeadGeneration", "#B2BMarketing"]
  },
  {
    id: 2,
    title: "Just had an incredible conversation with a client...",
    type: "Engagement Post",
    status: "Published",
    engagement: "89 likes, 15 comments",
    date: "2024-01-14",
    preview: "🚀 Just had an incredible conversation with a potential client who said something that stopped me in my tracks...",
    hashtags: ["#ClientSuccess", "#BusinessStrategy", "#Innovation"]
  },
  {
    id: 3,
    title: "The Ultimate Guide to B2B Content Marketing",
    type: "Lead Magnet",
    status: "Scheduled",
    engagement: "45 downloads",
    date: "2024-01-16",
    preview: "🎯 Want to know the exact framework we use to generate 10x more qualified leads?...",
    hashtags: ["#ContentMarketing", "#B2B", "#LeadGeneration"]
  },
  {
    id: 4,
    title: "Behind the Scenes: How We Built Our Marketing Team",
    type: "Company Update",
    status: "Draft",
    engagement: "-",
    date: "2024-01-13",
    preview: "🎉 Exciting news! We just hit a major milestone at ContentGen...",
    hashtags: ["#TeamBuilding", "#CompanyUpdate", "#Growth"]
  },
  {
    id: 5,
    title: "3 LinkedIn Profile Optimization Tips",
    type: "Educational Post",
    status: "Published",
    engagement: "156 likes, 31 comments",
    date: "2024-01-12",
    preview: "✨ Your LinkedIn profile is your digital business card. Here's how to make it shine...",
    hashtags: ["#LinkedIn", "#PersonalBrand", "#Professional"]
  },
  {
    id: 6,
    title: "What's Your Biggest Marketing Challenge?",
    type: "Engagement Post",
    status: "Published",
    engagement: "203 likes, 47 comments",
    date: "2024-01-11",
    preview: "❓ I'm curious - what's the biggest marketing challenge you're facing right now?...",
    hashtags: ["#Marketing", "#Community", "#Discussion"]
  }
];

const ContentLibrary = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-success/20 text-success';
      case 'Scheduled':
        return 'bg-warning/20 text-warning';
      case 'Draft':
        return 'bg-white/20 text-white';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Educational Post':
        return 'bg-accent-purple/20 text-accent-purple';
      case 'Engagement Post':
        return 'bg-accent-blue/20 text-accent-blue';
      case 'Lead Magnet':
        return 'bg-accent-cyan/20 text-accent-cyan';
      case 'Company Update':
        return 'bg-success/20 text-success';
      default:
        return 'bg-white/20 text-white';
    }
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
              <SelectItem value="Educational Post" className="text-white">Educational Post</SelectItem>
              <SelectItem value="Engagement Post" className="text-white">Engagement Post</SelectItem>
              <SelectItem value="Lead Magnet" className="text-white">Lead Magnet</SelectItem>
              <SelectItem value="Company Update" className="text-white">Company Update</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="input-glass w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-navy-800 border-white/20">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="Published" className="text-white">Published</SelectItem>
              <SelectItem value="Scheduled" className="text-white">Scheduled</SelectItem>
              <SelectItem value="Draft" className="text-white">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
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
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
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
                {item.preview}
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.hashtags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-accent-purple text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-text-secondary text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 font-medium">
                    {item.engagement}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-error h-8 w-8">
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
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1 group-hover:text-gradient transition-all">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>{item.engagement}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white h-8 w-8">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-error h-8 w-8">
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