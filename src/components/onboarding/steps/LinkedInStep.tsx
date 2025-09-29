import { useState } from "react";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkedInStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const LinkedInStep = ({ formData, updateFormData }: LinkedInStepProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateLinkedInUrl = async (url: string) => {
    if (!url) {
      setIsValid(null);
      return;
    }

    setIsValidating(true);
    
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isLinkedInUrl = url.includes('linkedin.com/in/') || url.includes('linkedin.com/company/');
    setIsValid(isLinkedInUrl);
    setIsValidating(false);
  };

  const handleUrlChange = (value: string) => {
    updateFormData('linkedinUrl', value);
    validateLinkedInUrl(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Let's Start with Your LinkedIn Profile
        </h3>
        <p className="text-text-secondary text-lg">
          We'll analyze your LinkedIn profile to understand your professional brand 
          and create content that matches your voice and expertise.
        </p>
      </div>

      {/* LinkedIn URL Input */}
      <div className="space-y-4">
        <Label htmlFor="linkedinUrl" className="text-white font-medium text-lg">
          Your LinkedIn Profile URL
        </Label>
        
        <div className="relative">
          <Input
            id="linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            className="input-glass text-lg py-4 pr-12"
            value={formData.linkedinUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValidating ? (
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            ) : isValid === true ? (
              <CheckCircle className="w-6 h-6 text-success" />
            ) : isValid === false ? (
              <AlertCircle className="w-6 h-6 text-error" />
            ) : null}
          </div>
        </div>

        {/* Validation Messages */}
        {isValid === false && (
          <p className="text-error text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Please enter a valid LinkedIn profile URL
          </p>
        )}
        
        {isValid === true && (
          <p className="text-success text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            LinkedIn profile URL validated successfully
          </p>
        )}
      </div>

      {/* Help Text */}
      <div className="card-glass p-6 rounded-xl border border-white/10">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-accent-blue" />
          How to find your LinkedIn URL
        </h4>
        
        <ol className="text-text-secondary space-y-2 text-sm">
          <li className="flex items-start">
            <span className="bg-accent-purple w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">1</span>
            Go to your LinkedIn profile page
          </li>
          <li className="flex items-start">
            <span className="bg-accent-purple w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">2</span>
            Click on "Contact info" or look at your browser's address bar
          </li>
          <li className="flex items-start">
            <span className="bg-accent-purple w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">3</span>
            Copy the URL that looks like: linkedin.com/in/yourname
          </li>
        </ol>
      </div>

      {/* Preview Card (when valid) */}
      {isValid && formData.linkedinUrl && (
        <div className="card-glass p-6 rounded-xl animate-fade-in">
          <h4 className="text-white font-semibold mb-4">Profile Preview</h4>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JS</span>
            </div>
            
            <div>
              <h5 className="text-white font-semibold">John Smith</h5>
              <p className="text-text-secondary">Senior Marketing Manager at TechCorp</p>
              <p className="text-text-muted text-sm">500+ connections</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-text-secondary text-sm">
              ✅ We'll analyze your profile content, posts, and engagement patterns
              <br />
              ✅ Create content that matches your professional voice and expertise
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInStep;