import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, isSameDay } from "date-fns";
import { Clock, Edit, Trash2 } from "lucide-react";
import EditPostModal from "./EditPostModal";
import { useToast } from "@/hooks/use-toast";

interface ScheduledContent {
  id: string;
  title: string;
  body: string;
  content_type: string;
  tone: string;
  image_style: string;
  status: string;
  scheduled_at: string;
  created_at: string;
}

const ScheduleCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<ScheduledContent | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchScheduledContent();
    }
  }, [user]);

  const fetchScheduledContent = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .not('scheduled_at', 'is', null)
        .order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      
      setScheduledContent(data || []);
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Deleted!",
        description: "Scheduled post deleted successfully.",
      });
      
      fetchScheduledContent();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete content.",
        variant: "destructive",
      });
    }
  };

  const handleEditContent = (content: ScheduledContent) => {
    setEditingContent(content);
    setEditModalOpen(true);
  };

  const selectedDateContent = scheduledContent.filter(content => 
    selectedDate && content.scheduled_at && isSameDay(new Date(content.scheduled_at), selectedDate)
  );

  const datesWithContent = scheduledContent.map(content => new Date(content.scheduled_at));

  return (
    <div className="space-y-6">
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Scheduled Content</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="pointer-events-auto w-full"
                  modifiers={{
                    scheduled: datesWithContent
                  }}
                  modifiersStyles={{
                    scheduled: {
                      backgroundColor: 'hsl(var(--accent-purple) / 0.3)',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-text-secondary text-sm mb-1">Total Scheduled</p>
                  <p className="text-3xl font-bold text-white">{scheduledContent.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-text-secondary text-sm mb-1">This Week</p>
                  <p className="text-3xl font-bold text-white">
                    {scheduledContent.filter(c => {
                      const date = new Date(c.scheduled_at);
                      const today = new Date();
                      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return date >= today && date <= weekFromNow;
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Date Posts */}
            <div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>
                
                {selectedDateContent.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateContent.map((content) => (
                      <Card key={content.id} className="bg-white/5 border-white/10 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white line-clamp-1">{content.title}</h4>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContent(content)}
                              className="text-text-secondary hover:text-white h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-text-secondary hover:text-error h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm line-clamp-2 mb-2">
                          {content.body}
                        </p>
                        <div className="flex items-center text-xs text-text-muted">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(content.scheduled_at), "h:mm a")}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">
                    No posts scheduled for this date.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <EditPostModal
        content={editingContent}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={fetchScheduledContent}
      />
    </div>
  );
};

export default ScheduleCalendar;
