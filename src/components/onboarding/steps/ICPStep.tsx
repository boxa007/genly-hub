import { Target, Users, Building2, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ICPStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const industries = [
  "Technology & Software",
  "Healthcare & Medical",
  "Financial Services",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Marketing & Advertising",
  "Consulting",
  "Real Estate",
  "Non-profit",
  "Other"
];

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees"
];

const ICPStep = ({ formData, updateFormData }: ICPStepProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Define Your Target Audience
        </h3>
        <p className="text-text-secondary text-lg">
          Understanding your Ideal Customer Profile (ICP) helps us create content 
          that resonates with the right people and drives meaningful engagement.
        </p>
      </div>

      {/* ICP Description */}
      <div className="space-y-4">
        <Label htmlFor="icpDescription" className="text-white font-medium text-lg flex items-center">
          <Target className="w-5 h-5 mr-2 text-accent-purple" />
          Ideal Customer Profile Description
        </Label>
        
        <Textarea
          id="icpDescription"
          placeholder="Describe your ideal customers: Who are they? What challenges do they face? What are their goals? What industries are they in?"
          className="input-glass min-h-[140px] resize-none"
          value={formData.icpDescription}
          onChange={(e) => updateFormData('icpDescription', e.target.value)}
        />
        
        <div className="flex items-center justify-between text-sm">
          <p className="text-text-muted">
            Be specific about demographics, pain points, and professional characteristics.
          </p>
          <span className="text-text-secondary">
            {formData.icpDescription.length}/400
          </span>
        </div>
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <Label className="text-white font-medium text-lg flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-accent-blue" />
          Primary Industry
        </Label>
        
        <Select
          value={formData.industry}
          onValueChange={(value) => updateFormData('industry', value)}
        >
          <SelectTrigger className="input-glass">
            <SelectValue placeholder="Select your primary industry" />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border-white/20">
            {industries.map((industry) => (
              <SelectItem 
                key={industry} 
                value={industry}
                className="text-white hover:bg-white/10"
              >
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <p className="text-text-muted text-sm">
          This helps us tailor content to your industry's specific language and trends.
        </p>
      </div>

      {/* Company Size */}
      <div className="space-y-4">
        <Label className="text-white font-medium text-lg flex items-center">
          <Users className="w-5 h-5 mr-2 text-accent-cyan" />
          Target Company Size
        </Label>
        
        <Select
          value={formData.companySize}
          onValueChange={(value) => updateFormData('companySize', value)}
        >
          <SelectTrigger className="input-glass">
            <SelectValue placeholder="Select typical company size of your targets" />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border-white/20">
            {companySizes.map((size) => (
              <SelectItem 
                key={size} 
                value={size}
                className="text-white hover:bg-white/10"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <p className="text-text-muted text-sm">
          Different company sizes have different challenges and decision-making processes.
        </p>
      </div>

      {/* ICP Examples */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-success" />
          ICP Example Templates
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-glass p-6 rounded-xl border border-accent-purple/20">
            <h5 className="text-accent-purple font-semibold mb-3">B2B SaaS Example</h5>
            <p className="text-text-secondary text-sm">
              "Marketing managers at mid-size B2B companies (50-500 employees) who struggle with 
              lead generation and attribution. They're tech-savvy but overwhelmed by too many tools 
              and need better ROI visibility."
            </p>
          </div>

          <div className="card-glass p-6 rounded-xl border border-accent-blue/20">
            <h5 className="text-accent-blue font-semibold mb-3">Consultant Example</h5>
            <p className="text-text-secondary text-sm">
              "C-level executives at growing companies who need strategic guidance on digital 
              transformation. They value expertise and results over cost, and prefer working 
              with proven thought leaders."
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card-glass p-6 rounded-xl border border-success/20">
        <h4 className="text-success font-semibold mb-3">💡 Pro Tips for Better Targeting</h4>
        <ul className="text-text-secondary text-sm space-y-2">
          <li>• Focus on specific pain points rather than generic descriptions</li>
          <li>• Include where they typically get information (LinkedIn, industry publications, etc.)</li>
          <li>• Mention their typical decision-making process and timeline</li>
          <li>• Consider their level of awareness about solutions like yours</li>
        </ul>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ICPStep;