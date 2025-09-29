import { useState } from "react";
import { Sparkles, MessageSquare, GraduationCap, Megaphone, Building, ArrowRight, Copy, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const contentTypes = [
  {
    id: 'engagement',
    icon: MessageSquare,
    title: 'Engagement Post',
    description: 'Spark conversations and build community',
    gradient: 'from-purple-500 to-blue-500'
  },
  {
    id: 'educational',
    icon: GraduationCap,
    title: 'Educational Post',
    description: 'Share knowledge and establish expertise',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'lead-magnet',
    icon: Megaphone,
    title: 'Lead Magnet',
    description: 'Generate leads with valuable content',
    gradient: 'from-cyan-500 to-teal-500'
  },
  {
    id: 'company-update',
    icon: Building,
    title: 'Company Update',
    description: 'Share company news and milestones',
    gradient: 'from-teal-500 to-green-500'
  }
];

const CreateContent = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    imageStyle: 'realistic_photo',
    length: 'medium',
    includeHashtags: true,
    includeCTA: true
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedType || !formData.topic) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated content based on type
    const mockContent = {
      engagement: `🚀 Just had an incredible conversation with a potential client who said something that stopped me in my tracks...

"We've been trying to solve this problem for 3 years, and in 30 minutes you've given us a completely new perspective."

This reminded me why I love what we do at our company. It's not just about the solution – it's about seeing the problem differently.

What's the most surprising insight you've gained from a client conversation? 👇

#BusinessStrategy #ClientSuccess #Innovation`,

      educational: `📊 The biggest mistake I see companies make with LinkedIn? Treating it like Facebook.

Here's what works instead:

✅ Share industry insights, not personal updates
✅ Start conversations, don't just broadcast  
✅ Comment meaningfully on others' posts
✅ Use data to back up your points
✅ Ask questions that matter to your audience

LinkedIn rewards authentic professional engagement. The algorithm can tell the difference.

Which of these do you struggle with most? Let's discuss below 👇

#LinkedInStrategy #B2BMarketing #ProfessionalNetworking`,

      'lead-magnet': `🎯 Want to know the exact framework we use to generate 10x more qualified leads?

I just published our complete "Lead Generation Blueprint" that includes:

→ The 5-step qualification process
→ Email templates that convert at 23%
→ Follow-up sequences that close deals
→ Real examples from our clients

This is the same system that helped our clients generate over $2M in new revenue last quarter.

Drop a comment with "BLUEPRINT" and I'll send you the free guide 👇

#LeadGeneration #SalesStrategy #B2BMarketing`,

      'company-update': `🎉 Exciting news! We just hit a major milestone at ContentGen...

We've now helped over 10,000 professionals create viral LinkedIn content, generating over 2 million posts and driving incredible engagement for our community.

But here's what makes me most proud: The success stories.

Like Sarah, who went from 200 to 5,000 followers in 6 months.
Or Mike, who landed 3 new clients just from his LinkedIn content.
Or the team at TechCorp who increased their lead generation by 400%.

This is just the beginning. Thank you to our amazing community for trusting us with your LinkedIn growth! 🙏

#Milestone #Community #ContentGeneration #LinkedIn`
    };

    setGeneratedContent(mockContent[selectedType as keyof typeof mockContent] || '');
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const handleSaveToLibrary = async () => {
    if (!user || !generatedContent) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: formData.topic,
          body: generatedContent,
          content_type: selectedType,
          tone: formData.tone,
          image_style: formData.imageStyle,
          status: 'draft'
        });
      
      if (error) throw error;
      
      toast({
        title: "Saved!",
        description: "Content saved to your library.",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save content.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!user || !generatedContent) return;
    
    setIsScheduling(true);
    try {
      // For now, just save as scheduled - in real app would show date picker
      const scheduledDate = new Date();
      scheduledDate.setHours(scheduledDate.getHours() + 24); // Schedule for tomorrow
      
      const { error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: formData.topic,
          body: generatedContent,
          content_type: selectedType,
          tone: formData.tone,
          image_style: formData.imageStyle,
          status: 'scheduled',
          scheduled_at: scheduledDate.toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Scheduled!",
        description: "Post scheduled for tomorrow.",
      });
    } catch (error: any) {
      toast({
        title: "Schedule failed",
        description: error.message || "Failed to schedule post.",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  if (!selectedType) {
    return (
      <div className="space-y-8 max-w-6xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Create New Content
          </h1>
          <p className="text-text-secondary text-lg">
            Choose the type of content you'd like to create with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="card-glass card-hover p-8 rounded-2xl cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-all">
                  {type.title}
                </h3>
                
                <p className="text-text-secondary">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedTypeData = contentTypes.find(t => t.id === selectedType);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedType('')}
            className="btn-glass"
          >
            ← Back
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">
              Create {selectedTypeData?.title}
            </h1>
            <p className="text-text-secondary">
              {selectedTypeData?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Form */}
        <div className="card-glass rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Content Settings
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-white font-medium">
                Topic or Theme
              </Label>
              <Input
                id="topic"
                placeholder="e.g., Marketing automation best practices"
                className="input-glass mt-2"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              />
            </div>

            <div>
              <Label className="text-white font-medium">Tone</Label>
              <Select
                value={formData.tone}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}
              >
                <SelectTrigger className="input-glass mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-white/20">
                  <SelectItem value="professional" className="text-white">Professional</SelectItem>
                  <SelectItem value="casual" className="text-white">Casual</SelectItem>
                  <SelectItem value="thought-leader" className="text-white">Thought Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white font-medium">Image Style</Label>
              <Select
                value={formData.imageStyle}
                onValueChange={(value) => setFormData(prev => ({ ...prev, imageStyle: value }))}
              >
                <SelectTrigger className="input-glass mt-2">
                  <SelectValue placeholder="Select image style" />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-white/20">
                  <SelectItem value="realistic_photo" className="text-white">Realistic Photo</SelectItem>
                  <SelectItem value="digital_illustration" className="text-white">Digital Illustration</SelectItem>
                  <SelectItem value="abstract_art" className="text-white">Abstract Art</SelectItem>
                  <SelectItem value="minimalist" className="text-white">Minimalist</SelectItem>
                  <SelectItem value="3d_render" className="text-white">3D Render</SelectItem>
                  <SelectItem value="watercolor" className="text-white">Watercolor</SelectItem>
                  <SelectItem value="line_art" className="text-white">Line Art</SelectItem>
                  <SelectItem value="corporate" className="text-white">Corporate/Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white font-medium">Length</Label>
              <Select
                value={formData.length}
                onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}
              >
                <SelectTrigger className="input-glass mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-white/20">
                  <SelectItem value="short" className="text-white">Short (50-100 words)</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium (100-200 words)</SelectItem>
                  <SelectItem value="long" className="text-white">Long (200+ words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeHashtags}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeHashtags: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">Include hashtags</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeCTA}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeCTA: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">Include call-to-action</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!formData.topic || isGenerating}
            className="w-full btn-hero"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Generating Content...
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        <div className="card-glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            LinkedIn Preview
          </h2>

          {generatedContent ? (
            <div className="space-y-6">
              {/* LinkedIn Post Preview */}
              <div className="bg-white rounded-lg p-6 text-gray-900">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                  <div>
                    <p className="font-semibold">John Smith</p>
                    <p className="text-gray-600 text-sm">Senior Marketing Manager • 1st</p>
                    <p className="text-gray-500 text-xs">2h • 🌐</p>
                  </div>
                </div>
                
                <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                  {generatedContent}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <span>👍</span>
                      <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <span>💬</span>
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <span>🔄</span>
                      <span className="text-sm">Repost</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-600">
                      <span>📤</span>
                      <span className="text-sm">Send</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Button onClick={handleCopy} className="btn-glass flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Content
                </Button>
                
                <Button 
                  onClick={handleSaveToLibrary} 
                  disabled={isSaving}
                  className="btn-glass flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save to Library'}
                </Button>
                
                <Button 
                  onClick={handleSchedulePost}
                  disabled={isScheduling}
                  className="btn-hero flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {isScheduling ? 'Scheduling...' : 'Schedule Post'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Generate content to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;