import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, Trash2 } from "lucide-react";

interface UserProfile {
  full_name: string;
  email: string;
  subscription_tier: string;
}

interface Company {
  id: string;
  linkedin_url: string | null;
  website_url: string | null;
  company_description: string | null;
  main_message: string | null;
  icp_description: string | null;
  company_size: string | null;
  industry: string | null;
}

interface Competitor {
  id: string;
  name: string;
  website_url: string | null;
  linkedin_url: string | null;
}

interface Document {
  id: string;
  name: string;
  path: string;
  created_at: string;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({ full_name: '', email: '', subscription_tier: 'trial' });
  const [company, setCompany] = useState<Company | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', website_url: '', linkedin_url: '' });

  useEffect(() => {
    if (user) {
      fetchAllSettings();
    }
  }, [user]);

  const fetchAllSettings = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('full_name, email, subscription_tier')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch company
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setCompany(companyData);

      // Fetch competitors
      if (companyData) {
        const { data: competitorsData } = await supabase
          .from('competitors')
          .select('*')
          .eq('company_id', companyData.id);

        setCompetitors(competitorsData || []);
      }

      // Fetch documents
      const { data: filesData } = await supabase
        .storage
        .from('company_documents')
        .list(user?.id);

      if (filesData) {
        const docsWithDetails = filesData.map(file => ({
          id: file.id,
          name: file.name,
          path: `${user?.id}/${file.name}`,
          created_at: file.created_at
        }));
        setDocuments(docsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          email: profile.email
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveICP = async () => {
    try {
      if (!company) {
        // Create company if doesn't exist
        const { error } = await supabase
          .from('companies')
          .insert({
            user_id: user?.id,
            icp_description: '',
            company_size: '',
            industry: ''
          });

        if (error) throw error;
        await fetchAllSettings();
      } else {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update({
            icp_description: company.icp_description,
            company_size: company.company_size,
            industry: company.industry
          })
          .eq('id', company.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "ICP information updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveCompany = async () => {
    try {
      if (!company) {
        // Create company if doesn't exist
        const { error } = await supabase
          .from('companies')
          .insert({
            user_id: user?.id,
            linkedin_url: '',
            website_url: '',
            company_description: '',
            main_message: ''
          });

        if (error) throw error;
        await fetchAllSettings();
      } else {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update({
            linkedin_url: company.linkedin_url,
            website_url: company.website_url,
            company_description: company.company_description,
            main_message: company.main_message
          })
          .eq('id', company.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Company information updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddCompetitor = async () => {
    if (!newCompetitor.name || !company) return;

    try {
      const { error } = await supabase
        .from('competitors')
        .insert({
          company_id: company.id,
          name: newCompetitor.name,
          website_url: newCompetitor.website_url,
          linkedin_url: newCompetitor.linkedin_url
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Competitor added successfully.",
      });

      setNewCompetitor({ name: '', website_url: '', linkedin_url: '' });
      fetchAllSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompetitor = async (competitorId: string) => {
    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', competitorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Competitor deleted successfully.",
      });

      fetchAllSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const filePath = `${user?.id}/${file.name}`;
      
      const { error } = await supabase.storage
        .from('company_documents')
        .upload(filePath, file);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });

      fetchAllSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async (path: string, name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('company_documents')
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from('company_documents')
        .remove([path]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully.",
      });

      fetchAllSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-text-secondary text-lg">Manage your account and preferences</p>
      </div>

      {/* User Information */}
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">User Information</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-white mb-2">Full Name</Label>
            <Input
              id="fullName"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="input-glass"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white mb-2">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="input-glass"
            />
          </div>
          <Button onClick={handleSaveProfile} className="btn-hero">
            Save Profile
          </Button>
        </div>
      </div>

      {/* ICP Information */}
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">ICP (Ideal Customer Profile)</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="icpDescription" className="text-white mb-2">ICP Description</Label>
            <Textarea
              id="icpDescription"
              value={company?.icp_description || ''}
              onChange={(e) => setCompany({ ...company!, icp_description: e.target.value })}
              className="input-glass min-h-[100px]"
              placeholder="Describe your ideal customer profile..."
            />
          </div>
          <div>
            <Label htmlFor="companySize" className="text-white mb-2">Company Size</Label>
            <Select
              value={company?.company_size || ''}
              onValueChange={(value) => setCompany({ ...company!, company_size: value })}
            >
              <SelectTrigger className="input-glass">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-white/20">
                <SelectItem value="1-10" className="text-white">1-10 employees</SelectItem>
                <SelectItem value="11-50" className="text-white">11-50 employees</SelectItem>
                <SelectItem value="51-200" className="text-white">51-200 employees</SelectItem>
                <SelectItem value="201-500" className="text-white">201-500 employees</SelectItem>
                <SelectItem value="500+" className="text-white">500+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="industry" className="text-white mb-2">Industry</Label>
            <Input
              id="industry"
              value={company?.industry || ''}
              onChange={(e) => setCompany({ ...company!, industry: e.target.value })}
              className="input-glass"
              placeholder="e.g., Technology, Healthcare, Finance..."
            />
          </div>
          <Button onClick={handleSaveICP} className="btn-hero">
            Save ICP Info
          </Button>
        </div>
      </div>

      {/* Company Information */}
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="linkedinUrl" className="text-white mb-2">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={company?.linkedin_url || ''}
              onChange={(e) => setCompany({ ...company!, linkedin_url: e.target.value })}
              className="input-glass"
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            <Label htmlFor="websiteUrl" className="text-white mb-2">Website URL</Label>
            <Input
              id="websiteUrl"
              value={company?.website_url || ''}
              onChange={(e) => setCompany({ ...company!, website_url: e.target.value })}
              className="input-glass"
              placeholder="https://yourcompany.com"
            />
          </div>
          <div>
            <Label htmlFor="companyDescription" className="text-white mb-2">Company Description</Label>
            <Textarea
              id="companyDescription"
              value={company?.company_description || ''}
              onChange={(e) => setCompany({ ...company!, company_description: e.target.value })}
              className="input-glass min-h-[100px]"
              placeholder="Describe what your company does..."
            />
          </div>
          <div>
            <Label htmlFor="mainMessage" className="text-white mb-2">Main Message</Label>
            <Textarea
              id="mainMessage"
              value={company?.main_message || ''}
              onChange={(e) => setCompany({ ...company!, main_message: e.target.value })}
              className="input-glass min-h-[100px]"
              placeholder="What's your key message or value proposition?"
            />
          </div>
          <Button onClick={handleSaveCompany} className="btn-hero">
            Save Company Info
          </Button>
        </div>
      </div>

      {/* Competitors */}
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Competitors</h2>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Competitor Name"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
              className="input-glass"
            />
            <Input
              placeholder="Website URL"
              value={newCompetitor.website_url}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, website_url: e.target.value })}
              className="input-glass"
            />
            <Input
              placeholder="LinkedIn URL"
              value={newCompetitor.linkedin_url}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, linkedin_url: e.target.value })}
              className="input-glass"
            />
          </div>
          <Button onClick={handleAddCompetitor} className="btn-hero">
            Add Competitor
          </Button>
        </div>

        <div className="space-y-3">
          {competitors.map((competitor) => (
            <div key={competitor.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{competitor.name}</p>
                <div className="flex gap-4 mt-1">
                  {competitor.website_url && (
                    <a href={competitor.website_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary text-sm hover:text-white">
                      Website
                    </a>
                  )}
                  {competitor.linkedin_url && (
                    <a href={competitor.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-text-secondary text-sm hover:text-white">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCompetitor(competitor.id)}
                className="text-white/60 hover:text-error"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Documents & Resources */}
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Documents & Resources</h2>
        
        <div className="mb-6">
          <Label htmlFor="document-upload" className="btn-hero cursor-pointer inline-flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Label>
          <Input
            id="document-upload"
            type="file"
            onChange={handleUploadDocument}
            className="hidden"
          />
        </div>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{doc.name}</p>
                <p className="text-text-secondary text-sm">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownloadDocument(doc.path, doc.name)}
                  className="text-white/60 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDocument(doc.path)}
                  className="text-white/60 hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
