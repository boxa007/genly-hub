import { useState, useEffect } from "react";
import { ExternalLink, CheckCircle, Key, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Integrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState("");
  const [existingIntegration, setExistingIntegration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchIntegration();
    }
  }, [user]);

  const fetchIntegration = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'buffer')
      .maybeSingle();

    if (data) {
      setExistingIntegration(data);
      setAccessToken('');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    if (!accessToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Buffer access token",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    if (existingIntegration) {
      const { error } = await supabase
        .from('integrations')
        .update({
          access_token: accessToken,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingIntegration.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update Buffer integration",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Buffer integration updated successfully"
        });
        fetchIntegration();
      }
    } else {
      const { error } = await supabase
        .from('integrations')
        .insert({
          user_id: user.id,
          platform: 'buffer',
          access_token: accessToken,
          is_active: true
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save Buffer integration",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Buffer integration connected successfully"
        });
        fetchIntegration();
      }
    }

    setIsSaving(false);
    setAccessToken('');
  };

  const handleDisconnect = async () => {
    if (!existingIntegration) return;

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', existingIntegration.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect Buffer",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Buffer integration disconnected"
      });
      setExistingIntegration(null);
      setAccessToken('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your Buffer account to schedule and publish your content
        </p>
      </div>

      <div className="card-glass rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Buffer</h3>
              <p className="text-muted-foreground text-sm">Social media scheduling</p>
            </div>
          </div>

          {existingIntegration && (
            <div className="flex items-center space-x-2 bg-success/20 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-success text-sm font-medium">Connected</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="bufferToken" className="text-foreground font-medium">
            Buffer Access Token
          </Label>
          
          <Input
            id="bufferToken"
            type="password"
            placeholder={existingIntegration ? "••••••••••••••••" : "Enter your Buffer access token"}
            className="input-glass"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />

          {existingIntegration && (
            <p className="text-muted-foreground text-sm">
              Token is securely stored. Enter a new token to update.
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleSave}
            disabled={isSaving || !accessToken.trim()}
            className="btn-glass flex-1"
          >
            {isSaving ? "Saving..." : existingIntegration ? "Update Token" : "Save Token"}
          </Button>

          {existingIntegration && (
            <Button
              onClick={handleDisconnect}
              variant="destructive"
              className="btn-glass"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>

        <div className="card-glass p-6 rounded-xl border border-border/50 bg-background/20">
          <h4 className="text-foreground font-semibold mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-primary" />
            How to get your Buffer access token
          </h4>
          
          <ol className="text-muted-foreground space-y-3 text-sm">
            <li className="flex items-start">
              <span className="bg-primary w-6 h-6 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
              <div>
                Go to <a href="https://developers.buffer.com/developers/apps/create" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Buffer Developers</a> and create a new app
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-primary w-6 h-6 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
              <div>
                Fill in the app details (name, description, and callback URL)
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-primary w-6 h-6 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
              <div>
                Once created, you'll see your <strong className="text-foreground">Access Token</strong> in the app dashboard
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-primary w-6 h-6 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
              <div>
                Copy the access token and paste it in the field above
              </div>
            </li>
          </ol>

          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-muted-foreground text-xs flex items-start">
              <span className="mr-2">🔒</span>
              Your token is securely stored and encrypted. We never share your credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="card-glass rounded-2xl p-8 text-center opacity-60">
        <h3 className="text-xl font-bold text-foreground mb-2">More Integrations Coming Soon</h3>
        <p className="text-muted-foreground">LinkedIn, Twitter, and more platforms are in development</p>
      </div>
    </div>
  );
};

export default Integrations;
