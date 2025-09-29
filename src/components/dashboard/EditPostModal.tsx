import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Save, Upload, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Content {
  id: string;
  title: string;
  body: string;
  content_type: string;
  tone: string;
  image_style: string;
  status: string;
  scheduled_at: string | null;
  image_url?: string | null;
}

interface EditPostModalProps {
  content: Content | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const contentTypes = [
  { id: 'engagement', label: 'Engagement' },
  { id: 'educational', label: 'Educational' },
  { id: 'lead-magnet', label: 'Lead Magnet' },
  { id: 'company-update', label: 'Company Update' }
];

const EditPostModal = ({ content, open, onOpenChange, onSuccess }: EditPostModalProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    content_type: 'engagement',
    tone: 'professional',
    image_style: 'realistic_photo',
    status: 'draft',
    scheduled_at: null as Date | null,
    image_url: null as string | null
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        body: content.body,
        content_type: content.content_type,
        tone: content.tone,
        image_style: content.image_style,
        status: content.status,
        scheduled_at: content.scheduled_at ? new Date(content.scheduled_at) : null,
        image_url: content.image_url || null
      });
    }
  }, [content]);

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: null }));
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ 
        ...prev, 
        image_url: reader.result as string 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!content) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('content')
        .update({
          title: formData.title,
          body: formData.body,
          content_type: formData.content_type,
          tone: formData.tone,
          image_style: formData.image_style,
          status: formData.status,
          scheduled_at: formData.scheduled_at?.toISOString() || null,
          image_url: formData.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', content.id);
      
      if (error) throw error;
      
      toast({
        title: "Saved!",
        description: "Content updated successfully.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to update content.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-navy-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Edit Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="title" className="text-white font-medium">Title</Label>
            <Input
              id="title"
              placeholder="Post title"
              className="input-glass mt-2"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="body" className="text-white font-medium">Content</Label>
            <Textarea
              id="body"
              placeholder="Post content"
              className="input-glass mt-2 min-h-[200px]"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            />
          </div>

          {/* Image Section */}
          <div>
            <Label className="text-white font-medium">Post Image</Label>
            
            {formData.image_url ? (
              <div className="mt-2 relative">
                {/* Image Preview */}
                <div className="rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src={formData.image_url} 
                    alt="Post image"
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 btn-glass"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Image
                  </Button>
                  
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadImage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full btn-glass"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Replace Image
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors">
                    <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60">Click to upload an image</p>
                    <p className="text-white/40 text-sm mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div>
            <Label className="text-white font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="input-glass mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-white/20">
                <SelectItem value="draft" className="text-white">Draft</SelectItem>
                <SelectItem value="scheduled" className="text-white">Scheduled</SelectItem>
                <SelectItem value="published" className="text-white">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'scheduled' && (
            <div>
              <Label className="text-white font-medium">Scheduled Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal input-glass mt-2",
                      !formData.scheduled_at && "text-white/60"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduled_at ? format(formData.scheduled_at, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-navy-800 border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.scheduled_at || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, scheduled_at: date || null }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="btn-glass"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.body}
              className="btn-hero"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;
