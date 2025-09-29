import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Copy, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ImageSettings, ImageData } from "@/components/dashboard/ImageSettings";
import { HookSelector } from "@/components/dashboard/HookSelector";
import { RegenerationToolbar } from "@/components/dashboard/RegenerationToolbar";
import { QuickSettingsMenu } from "@/components/dashboard/QuickSettingsMenu";
import { EditContentModal } from "@/components/dashboard/EditContentModal";

const contentTypes = [
  { id: 'engagement', label: 'Engagement' },
  { id: 'educational', label: 'Educational' },
  { id: 'lead-magnet', label: 'Lead Magnet' },
  { id: 'company-update', label: 'Company Update' }
];

const CreatePost = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
  const [selectedHookIndex, setSelectedHookIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showHookSelector, setShowHookSelector] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<'text' | 'image' | 'all' | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>({
    mode: 'generate',
    style: 'realistic_photo',
    template: 'none',
  });
  const [formData, setFormData] = useState({
    topic: '',
    contentType: searchParams.get('type') || 'engagement',
    tone: 'professional',
    length: 'medium',
    includeCTA: true
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && contentTypes.some(ct => ct.id === typeParam)) {
      setFormData(prev => ({ ...prev, contentType: typeParam }));
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!formData.topic) return;
    
    setIsGenerating(true);
    setShowHookSelector(false);
    setGeneratedContent('');
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate 4 different hooks
    const hooks = [
      `🚀 Just discovered something that completely changed my perspective on ${formData.topic}...`,
      `💡 Here's an uncomfortable truth about ${formData.topic} that nobody talks about...`,
      `📊 After analyzing 1000+ cases, I found the #1 mistake people make with ${formData.topic}...`,
      `🎯 Want to know the secret that top performers use for ${formData.topic}?`,
    ];
    
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

    const bodyContent = mockContent[formData.contentType as keyof typeof mockContent] || '';
    
    setGeneratedHooks(hooks);
    setGeneratedContent(bodyContent);
    setShowHookSelector(true);
    setSelectedHookIndex(-1);
    setIsGenerating(false);
  };

  const handleSelectHook = (index: number) => {
    setSelectedHookIndex(index);
    setShowHookSelector(false);
  };

  const handleRegenerateText = async () => {
    setIsRegenerating('text');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate new hooks
    const newHooks = [
      `🌟 This ${formData.topic} insight just blew my mind...`,
      `⚡ Stop doing ${formData.topic} the hard way. Here's what actually works...`,
      `🔥 The ${formData.topic} strategy that tripled our results...`,
      `💬 Real talk: What everyone gets wrong about ${formData.topic}...`,
    ];
    
    setGeneratedHooks(newHooks);
    setShowHookSelector(true);
    setSelectedHookIndex(-1);
    setIsRegenerating(null);
  };

  const handleRegenerateImage = async () => {
    setIsRegenerating('image');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Image regenerated",
      description: "New image generated successfully",
    });
    
    setIsRegenerating(null);
  };

  const handleSettingChange = (setting: string, value: any) => {
    setFormData(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Setting updated",
      description: `${setting} changed to ${value}`,
    });
  };

  const handleRegenerateAll = async () => {
    setIsRegenerating('all');
    await handleGenerate();
    setIsRegenerating(null);
  };

  const handleSaveEdit = (newContent: string) => {
    const fullContent = selectedHookIndex >= 0 
      ? `${generatedHooks[selectedHookIndex]}\n\n${newContent}`
      : newContent;
    setGeneratedContent(fullContent);
  };

  const getFinalContent = () => {
    if (selectedHookIndex >= 0 && generatedHooks.length > 0) {
      return `${generatedHooks[selectedHookIndex]}\n\n${generatedContent}`;
    }
    return generatedContent;
  };

  const handleCopy = () => {
    const content = getFinalContent();
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const handleSaveToLibrary = async () => {
    if (!user || !generatedContent) return;
    
    setIsSaving(true);
    try {
      const content = getFinalContent();
      const { error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: formData.topic,
          body: content,
          content_type: formData.contentType,
          tone: formData.tone,
          image_style: imageData?.style || 'realistic_photo',
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
      const content = getFinalContent();
      // For now, just save as scheduled - in real app would show date picker
      const scheduledDate = new Date();
      scheduledDate.setHours(scheduledDate.getHours() + 24); // Schedule for tomorrow
      
      const { error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: formData.topic,
          body: content,
          content_type: formData.contentType,
          tone: formData.tone,
          image_style: imageData?.style || 'realistic_photo',
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

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="btn-glass mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-white">Create Post</h1>
            <p className="text-text-secondary">Generate AI-powered LinkedIn content</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Content Settings */}
            <div className="card-glass rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              Content Settings
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-white font-medium">Post Type</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
                >
                  <SelectTrigger className="input-glass mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-800 border-white/20">
                    {contentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id} className="text-white">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              <div>
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

            {/* Image Settings */}
            <ImageSettings 
              onImageChange={setImageData}
              currentImage={imageData}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Hook Selector */}
            {showHookSelector && generatedHooks.length > 0 && (
              <HookSelector
                hooks={generatedHooks}
                postBody={generatedContent}
                onSelectHook={handleSelectHook}
              />
            )}

            {/* LinkedIn Preview */}
            {!showHookSelector && selectedHookIndex >= 0 && (
              <>
                {/* Regeneration Toolbar */}
                <RegenerationToolbar
                  onRegenerateText={handleRegenerateText}
                  onRegenerateImage={handleRegenerateImage}
                  onEditContent={() => setShowEditModal(true)}
                  hasImage={imageData?.mode === 'generate' || !!imageData?.file}
                  isRegenerating={isRegenerating}
                />

                <div className="card-glass rounded-2xl p-8 relative">
                  {/* Quick Settings Menu */}
                  <QuickSettingsMenu
                    currentTone={formData.tone}
                    currentLength={formData.length}
                    includeCTA={formData.includeCTA}
                    onSettingChange={handleSettingChange}
                    onRegenerateAll={handleRegenerateAll}
                  />

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      LinkedIn Preview
                    </h2>
                    {selectedHookIndex >= 0 && (
                      <Badge 
                        variant="outline" 
                        className="border-brand-purple text-brand-purple bg-brand-purple/10"
                      >
                        Hook {selectedHookIndex + 1} of {generatedHooks.length} selected
                      </Badge>
                    )}
                  </div>

            {selectedHookIndex >= 0 && generatedContent ? (
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
                    {getFinalContent()}
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
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save to Library
                  </Button>
                  
                  <Button 
                    onClick={handleSchedulePost} 
                    disabled={isScheduling}
                    className="btn-glass flex-1"
                  >
                    {isScheduling ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Calendar className="w-4 h-4 mr-2" />
                    )}
                    Schedule Post
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Generate</h3>
                <p className="text-text-secondary">
                  Fill in your topic and settings, then click "Generate Content" to see your LinkedIn post preview here.
                </p>
              </div>
            )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Content Modal */}
        <EditContentModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          content={generatedContent}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default CreatePost;