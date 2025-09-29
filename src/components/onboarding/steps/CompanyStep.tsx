import { Globe, Building, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CompanyStep = ({ formData, updateFormData }: CompanyStepProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Tell Us About Your Company
        </h3>
        <p className="text-text-secondary text-lg">
          This information helps us create content that aligns with your company's 
          brand voice, values, and business objectives.
        </p>
      </div>

      {/* Website URL */}
      <div className="space-y-4">
        <Label htmlFor="websiteUrl" className="text-white font-medium text-lg flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-400" />
          Company Website URL
        </Label>
        
        <Input
          id="websiteUrl"
          type="url"
          placeholder="https://yourcompany.com"
          className="input-glass text-lg py-4"
          value={formData.websiteUrl}
          onChange={(e) => updateFormData('websiteUrl', e.target.value)}
        />
        
        <p className="text-text-muted text-sm">
          We'll analyze your website to understand your products, services, and brand messaging.
        </p>
      </div>

      {/* Company Description */}
      <div className="space-y-4">
        <Label htmlFor="companyDescription" className="text-white font-medium text-lg flex items-center">
          <Building className="w-5 h-5 mr-2 text-purple-400" />
          Company Description
        </Label>
        
        <Textarea
          id="companyDescription"
          placeholder="Describe what your company does, your mission, values, and what makes you unique..."
          className="input-glass min-h-[120px] resize-none"
          value={formData.companyDescription}
          onChange={(e) => updateFormData('companyDescription', e.target.value)}
        />
        
        <div className="flex items-center justify-between text-sm">
          <p className="text-text-muted">
            Include your industry, key products/services, and company values.
          </p>
          <span className="text-text-secondary">
            {formData.companyDescription.length}/500
          </span>
        </div>
      </div>

      {/* Main LinkedIn Message */}
      <div className="space-y-4">
        <Label htmlFor="mainMessage" className="text-white font-medium text-lg flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
          Main LinkedIn Message
        </Label>
        
        <Textarea
          id="mainMessage"
          placeholder="What's the core message you want to communicate on LinkedIn? What should people know about your expertise or company?"
          className="input-glass min-h-[120px] resize-none"
          value={formData.mainMessage}
          onChange={(e) => updateFormData('mainMessage', e.target.value)}
        />
        
        <div className="flex items-center justify-between text-sm">
          <p className="text-text-muted">
            This will be the foundation for all your LinkedIn content themes.
          </p>
          <span className="text-text-secondary">
            {formData.mainMessage.length}/300
          </span>
        </div>
      </div>

      {/* Example Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6 rounded-xl border border-blue-600/20">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-400" />
            Good Company Description
          </h4>
          <p className="text-text-secondary text-sm">
            "We're a B2B SaaS company that helps marketing teams automate their content workflow. 
            Our platform integrates with 50+ tools and has helped 10,000+ marketers save 20 hours per week."
          </p>
        </div>

        <div className="card-glass p-6 rounded-xl border border-purple-600/20">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
            Good LinkedIn Message
          </h4>
          <p className="text-text-secondary text-sm">
            "I share insights about marketing automation and help teams build scalable content processes. 
            My goal is to show how the right tools and strategy can transform marketing operations."
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStep;