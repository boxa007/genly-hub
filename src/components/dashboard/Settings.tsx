import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Building, Users, FileText, Plus, Trash2, Download, Upload } from "lucide-react";

interface UserProfile {
  full_name: string;
  email: string;
}

interface Company {
  id: string;
  linkedin_url: string;
  website_url: string;
  company_description: string;
  main_message: string;
  icp_description: string;
  industry: string;
  company_size: string;
}

interface Competitor {
  id: string;
  name: string;
  website_url: string;
  linkedin_url: string;
}

interface Document {
  name: string;
  created_at: string;
  metadata: any;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({ full_name: '', email: '' });
  const [company, setCompany] = useState<Company | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', website_url: '', linkedin_url: '' });

  useEffect(() => {
    if (user) {
      fetchAllSettings();
    }
  }, [user]);

  const fetchAllSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) {
        setProfile({ full_name: profileData.full_name, email: profileData.email });
      }

      // Fetch company
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
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
      const { data: documentsData } = await supabase.storage
        .from('company_documents')
        .list(user.id);
      
      setDocuments(documentsData || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ full_name: profile.full_name })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({ title: "Saved!", description: "Profile updated successfully." });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!user || !company) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update(company)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({ title: "Saved!", description: "Company information updated successfully." });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompetitor = async () => {
    if (!user || !company || !newCompetitor.name) return;
    
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
      
      toast({ title: "Added!", description: "Competitor added successfully." });
      setNewCompetitor({ name: '', website_url: '', linkedin_url: '' });
      fetchAllSettings();
    } catch (error: any) {
      toast({ title: "Add failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({ title: "Deleted!", description: "Competitor removed successfully." });
      fetchAllSettings();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(true);
    
    try {
      const { error } = await supabase.storage
        .from('company_documents')
        .upload(`${user.id}/${file.name}`, file);
      
      if (error) throw error;
      
      toast({ title: "Uploaded!", description: "Document uploaded successfully." });
      fetchAllSettings();
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadDocument = async (fileName: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.storage
        .from('company_documents')
        .download(`${user.id}/${fileName}`);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    } catch (error: any) {
      toast({ title: "Download failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteDocument = async (fileName: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.storage
        .from('company_documents')
        .remove([`${user.id}/${fileName}`]);
      
      if (error) throw error;
      
      toast({ title: "Deleted!", description: "Document deleted successfully." });
      fetchAllSettings();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="card-glass rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card className="card-glass p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <User className="w-6 h-6 mr-2 text-purple-400" />
          Profile Information
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="text-white">Full Name</Label>
            <Input
              className="input-glass mt-2"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-white">Email</Label>
            <Input
              className="input-glass mt-2"
              value={profile.email}
              disabled
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="btn-hero">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>

      {/* Company */}
      {company && (
        <Card className="card-glass p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Building className="w-6 h-6 mr-2 text-purple-400" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">LinkedIn URL</Label>
              <Input
                className="input-glass mt-2"
                value={company.linkedin_url || ''}
                onChange={(e) => setCompany({ ...company, linkedin_url: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-white">Website URL</Label>
              <Input
                className="input-glass mt-2"
                value={company.website_url || ''}
                onChange={(e) => setCompany({ ...company, website_url: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-white">Industry</Label>
              <Input
                className="input-glass mt-2"
                value={company.industry || ''}
                onChange={(e) => setCompany({ ...company, industry: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-white">Company Size</Label>
              <Input
                className="input-glass mt-2"
                value={company.company_size || ''}
                onChange={(e) => setCompany({ ...company, company_size: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-white">Company Description</Label>
              <Textarea
                className="input-glass mt-2"
                value={company.company_description || ''}
                onChange={(e) => setCompany({ ...company, company_description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-white">Main Message</Label>
              <Textarea
                className="input-glass mt-2"
                value={company.main_message || ''}
                onChange={(e) => setCompany({ ...company, main_message: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-white">ICP Description</Label>
              <Textarea
                className="input-glass mt-2"
                value={company.icp_description || ''}
                onChange={(e) => setCompany({ ...company, icp_description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveCompany} disabled={saving} className="btn-hero mt-4">
            {saving ? 'Saving...' : 'Save Company Info'}
          </Button>
        </Card>
      )}

      {/* Competitors */}
      <Card className="card-glass p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2 text-purple-400" />
          Competitors
        </h2>
        
        <div className="space-y-4 mb-6">
          {competitors.map((competitor) => (
            <div key={competitor.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
              <div>
                <h3 className="text-white font-medium">{competitor.name}</h3>
                {competitor.website_url && (
                  <p className="text-text-secondary text-sm">{competitor.website_url}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCompetitor(competitor.id)}
                className="text-error hover:text-error"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-white font-medium mb-4">Add Competitor</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Competitor name"
              className="input-glass"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
            />
            <Input
              placeholder="Website URL"
              className="input-glass"
              value={newCompetitor.website_url}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, website_url: e.target.value })}
            />
            <Input
              placeholder="LinkedIn URL"
              className="input-glass"
              value={newCompetitor.linkedin_url}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, linkedin_url: e.target.value })}
            />
          </div>
          <Button onClick={handleAddCompetitor} className="btn-glass mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Competitor
          </Button>
        </div>
      </Card>

      {/* Documents */}
      <Card className="card-glass p-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-purple-400" />
          Documents & Resources
        </h2>
        <p className="text-text-secondary mb-6">
          Upload documents about your company (presentations, case studies, product sheets, etc.)
        </p>

        <div className="space-y-4 mb-6">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
              <div>
                <h3 className="text-white font-medium">{doc.name}</h3>
                <p className="text-text-secondary text-sm">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadDocument(doc.name)}
                  className="text-text-secondary hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDocument(doc.name)}
                  className="text-error hover:text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleUploadDocument}
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
            className="btn-hero"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
