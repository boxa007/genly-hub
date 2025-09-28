import { useState } from "react";
import { Plus, X, ExternalLink, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CompetitorsStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CompetitorsStep = ({ formData, updateFormData }: CompetitorsStepProps) => {
  const [competitors, setCompetitors] = useState<string[]>(
    formData.competitors || ["", "", ""]
  );

  const addCompetitor = () => {
    if (competitors.length < 10) {
      const newCompetitors = [...competitors, ""];
      setCompetitors(newCompetitors);
      updateFormData('competitors', newCompetitors);
    }
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      const newCompetitors = competitors.filter((_, i) => i !== index);
      setCompetitors(newCompetitors);
      updateFormData('competitors', newCompetitors);
    }
  };

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...competitors];
    newCompetitors[index] = value;
    setCompetitors(newCompetitors);
    updateFormData('competitors', newCompetitors);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Competitor Analysis
        </h3>
        <p className="text-text-secondary text-lg">
          We'll analyze your competitors' LinkedIn content to identify content gaps, 
          trending topics, and opportunities for differentiation.
        </p>
      </div>

      {/* Instructions */}
      <div className="card-glass p-6 rounded-xl border border-accent-blue/20">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-accent-blue" />
          What We'll Analyze
        </h4>
        <ul className="text-text-secondary text-sm space-y-2">
          <li>• Content themes and topics they cover</li>
          <li>• Posting frequency and engagement patterns</li>
          <li>• Content formats (posts, articles, videos)</li>
          <li>• Audience engagement and response</li>
          <li>• Content gaps you can capitalize on</li>
        </ul>
      </div>

      {/* Competitor Inputs */}
      <div className="space-y-6">
        <Label className="text-white font-medium text-lg flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-accent-purple" />
          Competitor LinkedIn URLs
        </Label>

        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder={`https://linkedin.com/in/competitor-${index + 1} or https://linkedin.com/company/competitor-${index + 1}`}
                  className="input-glass"
                  value={competitor}
                  onChange={(e) => updateCompetitor(index, e.target.value)}
                />
              </div>
              
              {competitors.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCompetitor(index)}
                  className="text-white/60 hover:text-error hover:bg-error/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add Competitor Button */}
        {competitors.length < 10 && (
          <Button
            variant="ghost"
            onClick={addCompetitor}
            className="btn-glass w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Competitor ({competitors.length}/10)
          </Button>
        )}

        <p className="text-text-muted text-sm">
          Add both individual profiles and company pages of your main competitors. 
          We recommend at least 3-5 for comprehensive analysis.
        </p>
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6 rounded-xl border border-accent-purple/20">
          <h5 className="text-accent-purple font-semibold mb-3">Direct Competitors</h5>
          <p className="text-text-secondary text-sm">
            Companies or individuals offering similar products/services to the same target audience. 
            These are your primary competition for mindshare.
          </p>
        </div>

        <div className="card-glass p-6 rounded-xl border border-accent-cyan/20">
          <h5 className="text-accent-cyan font-semibold mb-3">Thought Leaders</h5>
          <p className="text-text-secondary text-sm">
            Industry influencers and experts who share content in your space. 
            They may not compete directly but influence your audience.
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="card-glass p-6 rounded-xl border border-success/20">
        <h4 className="text-success font-semibold mb-3">💡 Good Examples</h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-white font-medium">Individual Profiles:</span>
            <span className="text-text-secondary ml-2">linkedin.com/in/marketing-expert-name</span>
          </div>
          <div>
            <span className="text-white font-medium">Company Pages:</span>
            <span className="text-text-secondary ml-2">linkedin.com/company/competitor-company</span>
          </div>
          <div>
            <span className="text-white font-medium">Industry Leaders:</span>
            <span className="text-text-secondary ml-2">Top voices in your industry niche</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorsStep;