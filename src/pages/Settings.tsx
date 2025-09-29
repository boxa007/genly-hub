import { useState, useEffect } from "react";
import { Edit, Save, X, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompanyData {
  id?: string;
  linkedin_url: string;
  website_url: string;
  company_description: string;
  main_message: string;
  icp_description: string;
  industry: string;
  company_size: string;
}

interface Competitor {
  id?: string;
  name: string;
  linkedin_url: string;
  website_url: string;
}

const Settings = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    linkedin_url: "",
    website_url: "",
    company_description: "",
    main_message: "",
    icp_description: "",
    industry: "",
    company_size: ""
  });
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [originalData, setOriginalData] = useState<{company: CompanyData, competitors: Competitor[]}>({
    company: companyData,
    competitors: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch company data
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (company) {
        setCompanyData(company);
        setOriginalData(prev => ({ ...prev, company }));

        // Fetch competitors
        const { data: competitorsData } = await supabase
          .from('competitors')
          .select('*')
          .eq('company_id', company.id);

        if (competitorsData) {
          setCompetitors(competitorsData);
          setOriginalData(prev => ({ ...prev, competitors: competitorsData }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - restore original data
      setCompanyData(originalData.company);
      setCompetitors(originalData.competitors);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update company data
      const { error: companyError } = await supabase
        .from('companies')
        .update({
          linkedin_url: companyData.linkedin_url,
          website_url: companyData.website_url,
          company_description: companyData.company_description,
          main_message: companyData.main_message,
          icp_description: companyData.icp_description,
          industry: companyData.industry,
          company_size: companyData.company_size
        })
        .eq('id', companyData.id);

      if (companyError) throw companyError;

      // Delete removed competitors
      const originalCompetitorIds = originalData.competitors.map(c => c.id).filter(Boolean);
      const currentCompetitorIds = competitors.map(c => c.id).filter(Boolean);
      const toDelete = originalCompetitorIds.filter(id => !currentCompetitorIds.includes(id));

      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('competitors')
          .delete()
          .in('id', toDelete);

        if (deleteError) throw deleteError;
      }

      // Update/Insert competitors
      for (const competitor of competitors) {
        if (competitor.id) {
          // Update existing
          const { error: updateError } = await supabase
            .from('competitors')
            .update({
              name: competitor.name,
              linkedin_url: competitor.linkedin_url,
              website_url: competitor.website_url
            })
            .eq('id', competitor.id);

          if (updateError) throw updateError;
        } else {
          // Insert new
          const { error: insertError } = await supabase
            .from('competitors')
            .insert({
              company_id: companyData.id,
              name: competitor.name,
              linkedin_url: competitor.linkedin_url,
              website_url: competitor.website_url
            });

          if (insertError) throw insertError;
        }
      }

      // Update original data
      setOriginalData({ company: companyData, competitors });
      setIsEditMode(false);

      toast({
        title: "Success!",
        description: "Settings saved successfully.",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: "", linkedin_url: "", website_url: "" }]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
    const updated = competitors.map((comp, i) => 
      i === index ? { ...comp, [field]: value } : comp
    );
    setCompetitors(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-text-secondary">Manage your company information and preferences</p>
          </div>
          
          <div className="flex space-x-3">
            {isEditMode ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleEditToggle}
                  className="btn-glass"
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="btn-hero"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleEditToggle}
                className="btn-hero"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            )}
          </div>
        </div>

        {/* Company Information */}
        <Card className="card-glass mb-8">
          <CardHeader>
            <CardTitle className="text-white">Company Information</CardTitle>
            <CardDescription className="text-text-secondary">
              Update your company details and LinkedIn profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="linkedin_url" className="text-white font-medium">
                  LinkedIn Profile URL
                </Label>
                <Input
                  id="linkedin_url"
                  value={companyData.linkedin_url}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  disabled={!isEditMode}
                  className="input-glass mt-2"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label htmlFor="website_url" className="text-white font-medium">
                  Website URL
                </Label>
                <Input
                  id="website_url"
                  value={companyData.website_url}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, website_url: e.target.value }))}
                  disabled={!isEditMode}
                  className="input-glass mt-2"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company_description" className="text-white font-medium">
                Company Description
              </Label>
              <Textarea
                id="company_description"
                value={companyData.company_description}
                onChange={(e) => setCompanyData(prev => ({ ...prev, company_description: e.target.value }))}
                disabled={!isEditMode}
                className="input-glass mt-2"
                rows={4}
                placeholder="Describe your company..."
              />
            </div>

            <div>
              <Label htmlFor="main_message" className="text-white font-medium">
                Main LinkedIn Message
              </Label>
              <Textarea
                id="main_message"
                value={companyData.main_message}
                onChange={(e) => setCompanyData(prev => ({ ...prev, main_message: e.target.value }))}
                disabled={!isEditMode}
                className="input-glass mt-2"
                rows={3}
                placeholder="Your main message for LinkedIn..."
              />
            </div>

            <div>
              <Label htmlFor="icp_description" className="text-white font-medium">
                Target Audience (ICP)
              </Label>
              <Textarea
                id="icp_description"
                value={companyData.icp_description}
                onChange={(e) => setCompanyData(prev => ({ ...prev, icp_description: e.target.value }))}
                disabled={!isEditMode}
                className="input-glass mt-2"
                rows={3}
                placeholder="Describe your ideal customer profile..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="industry" className="text-white font-medium">
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, industry: e.target.value }))}
                  disabled={!isEditMode}
                  className="input-glass mt-2"
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>

              <div>
                <Label htmlFor="company_size" className="text-white font-medium">
                  Company Size
                </Label>
                <Input
                  id="company_size"
                  value={companyData.company_size}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, company_size: e.target.value }))}
                  disabled={!isEditMode}
                  className="input-glass mt-2"
                  placeholder="e.g., 1-10, 50-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitors */}
        <Card className="card-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Competitors</CardTitle>
                <CardDescription className="text-text-secondary">
                  Manage your competitor list for content analysis
                </CardDescription>
              </div>
              {isEditMode && (
                <Button
                  onClick={addCompetitor}
                  variant="outline"
                  className="btn-glass"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Competitor
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {competitors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">No competitors added yet.</p>
                {isEditMode && (
                  <Button
                    onClick={addCompetitor}
                    className="btn-hero mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Competitor
                  </Button>
                )}
              </div>
            ) : (
              competitors.map((competitor, index) => (
                <div key={index} className="p-4 rounded-lg bg-navy-800/50 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Competitor {index + 1}</h4>
                    {isEditMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCompetitor(index)}
                        className="h-8 w-8 p-0 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white font-medium">Name</Label>
                      <Input
                        value={competitor.name}
                        onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                        disabled={!isEditMode}
                        className="input-glass mt-2"
                        placeholder="Company name"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white font-medium">LinkedIn URL</Label>
                      <Input
                        value={competitor.linkedin_url}
                        onChange={(e) => updateCompetitor(index, 'linkedin_url', e.target.value)}
                        disabled={!isEditMode}
                        className="input-glass mt-2"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white font-medium">Website URL</Label>
                      <Input
                        value={competitor.website_url}
                        onChange={(e) => updateCompetitor(index, 'website_url', e.target.value)}
                        disabled={!isEditMode}
                        className="input-glass mt-2"
                        placeholder="Website URL"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;