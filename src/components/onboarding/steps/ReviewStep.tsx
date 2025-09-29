import { CheckCircle, ExternalLink, Building, Target, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ReviewStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
}

const ReviewStep = ({ formData, termsAgreed, setTermsAgreed }: ReviewStepProps) => {
  const filledCompetitors = formData.competitors?.filter((c: string) => c.trim() !== "") || [];
  
  const isComplete = formData.linkedinUrl && 
                    formData.websiteUrl && 
                    formData.companyDescription && 
                    formData.mainMessage && 
                    formData.icpDescription && 
                    formData.industry && 
                    formData.companySize &&
                    filledCompetitors.length >= 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Review Your Information
        </h3>
        <p className="text-text-secondary text-lg">
          Please review all the information below. Once you start data collection, 
          we'll analyze everything to create your personalized content strategy.
        </p>
      </div>

      {/* LinkedIn Profile Section */}
      <div className="card-glass p-6 rounded-xl border border-accent-blue/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-accent-blue" />
            LinkedIn Profile
          </h4>
          {formData.linkedinUrl ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
        </div>
        
        <div className="text-text-secondary">
          <p className="font-medium text-white mb-1">Profile URL:</p>
          <p className="break-all">{formData.linkedinUrl || "Not provided"}</p>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="card-glass p-6 rounded-xl border border-accent-purple/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center">
            <Building className="w-5 h-5 mr-2 text-accent-purple" />
            Company Information
          </h4>
          {formData.websiteUrl && formData.companyDescription && formData.mainMessage ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
        </div>
        
        <div className="space-y-3 text-text-secondary">
          <div>
            <p className="font-medium text-white mb-1">Website:</p>
            <p className="break-all">{formData.websiteUrl || "Not provided"}</p>
          </div>
          
          <div>
            <p className="font-medium text-white mb-1">Company Description:</p>
            <p className="text-sm">{formData.companyDescription || "Not provided"}</p>
          </div>
          
          <div>
            <p className="font-medium text-white mb-1">Main LinkedIn Message:</p>
            <p className="text-sm">{formData.mainMessage || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="card-glass p-6 rounded-xl border border-accent-cyan/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center">
            <Target className="w-5 h-5 mr-2 text-accent-cyan" />
            Target Audience (ICP)
          </h4>
          {formData.icpDescription && formData.industry && formData.companySize ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
        </div>
        
        <div className="space-y-3 text-text-secondary">
          <div>
            <p className="font-medium text-white mb-1">ICP Description:</p>
            <p className="text-sm">{formData.icpDescription || "Not provided"}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-white mb-1">Industry:</p>
              <p className="text-sm">{formData.industry || "Not provided"}</p>
            </div>
            
            <div>
              <p className="font-medium text-white mb-1">Company Size:</p>
              <p className="text-sm">{formData.companySize || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors Section */}
      <div className="card-glass p-6 rounded-xl border border-success/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2 text-success" />
            Competitors ({filledCompetitors.length})
          </h4>
          {filledCompetitors.length >= 1 ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
        </div>
        
        <div className="space-y-2 text-text-secondary">
          {filledCompetitors.length > 0 ? (
            filledCompetitors.map((competitor: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <p className="text-sm break-all">{competitor}</p>
              </div>
            ))
          ) : (
            <p className="text-sm">No competitors added</p>
          )}
        </div>
      </div>

      {/* Completion Status */}
      <div className="card-glass p-6 rounded-xl border border-accent-purple/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold">Ready to Start?</h4>
          {isComplete ? (
            <CheckCircle className="w-6 h-6 text-success" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-warning" />
          )}
        </div>
        
        {isComplete ? (
          <div className="space-y-3">
            <p className="text-success font-medium">✅ All required information provided</p>
            <p className="text-text-secondary text-sm">
              We're ready to start analyzing your data. This process typically takes 2-3 minutes 
              and will create your personalized content strategy.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-warning font-medium">⚠️ Please complete all required fields</p>
            <p className="text-text-secondary text-sm">
              Some required information is missing. Please go back and fill in all fields 
              to proceed with data collection.
            </p>
          </div>
        )}
      </div>

      {/* What Happens Next */}
      <div className="card-glass p-6 rounded-xl border border-white/10">
        <h4 className="text-white font-semibold mb-4">What Happens Next?</h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent-purple font-bold text-sm">1</span>
            </div>
            <div>
              <p className="text-white font-medium">LinkedIn Profile Analysis</p>
              <p className="text-text-secondary text-sm">We'll analyze your profile, posts, and engagement patterns</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent-blue font-bold text-sm">2</span>
            </div>
            <div>
              <p className="text-white font-medium">Website & Brand Analysis</p>
              <p className="text-text-secondary text-sm">Extract key messaging, values, and content themes from your website</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent-cyan/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent-cyan font-bold text-sm">3</span>
            </div>
            <div>
              <p className="text-white font-medium">Competitor Research</p>
              <p className="text-text-secondary text-sm">Analyze competitor content to identify opportunities and gaps</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-success font-bold text-sm">4</span>
            </div>
            <div>
              <p className="text-white font-medium">AI Strategy Creation</p>
              <p className="text-text-secondary text-sm">Generate your personalized content strategy and templates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start gap-3 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <input
          type="checkbox"
          id="terms-agreement"
          checked={termsAgreed}
          onChange={(e) => setTermsAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-1"
        />
        <label htmlFor="terms-agreement" className="text-sm text-gray-400">
          I agree to the{' '}
          <button 
            onClick={() => window.open('#', '_blank')} 
            className="text-purple-400 underline hover:text-purple-300 transition-colors"
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button 
            onClick={() => window.open('#', '_blank')} 
            className="text-purple-400 underline hover:text-purple-300 transition-colors"
          >
            Privacy Policy
          </button>
          . I understand that ContentGen will analyze publicly available LinkedIn data to create personalized content recommendations.
        </label>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;