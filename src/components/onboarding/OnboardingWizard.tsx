import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LinkedInStep from "./steps/LinkedInStep";
import CompanyStep from "./steps/CompanyStep";
import ICPStep from "./steps/ICPStep";
import CompetitorsStep from "./steps/CompetitorsStep";
import ReviewStep from "./steps/ReviewStep";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, title: "LinkedIn Profile", component: LinkedInStep },
  { id: 2, title: "Company Info", component: CompanyStep },
  { id: 3, title: "Target Audience", component: ICPStep },
  { id: 4, title: "Competitors", component: CompetitorsStep },
  { id: 5, title: "Review & Submit", component: ReviewStep }
];

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    linkedinUrl: "",
    websiteUrl: "",
    companyDescription: "",
    mainMessage: "",
    icpDescription: "",
    industry: "",
    companySize: "",
    competitors: ["", "", ""],
    termsAccepted: true
  });

  const currentStepData = steps.find(step => step.id === currentStep);
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  // Check if current step data is complete
  const getIsComplete = () => {
    const filledCompetitors = formData.competitors?.filter((c: string) => c.trim() !== "") || [];
    
    return formData.linkedinUrl && 
           formData.websiteUrl && 
           formData.companyDescription && 
           formData.mainMessage && 
           formData.icpDescription && 
           formData.industry && 
           formData.companySize && 
           filledCompetitors.length > 0 && 
           formData.termsAccepted;
  };

  const isComplete = getIsComplete();

  const handleNext = async () => {
    if (isLastStep) {
      // Validate form before saving
      if (!isComplete) {
        toast({
          title: "Заполните все поля",
          description: "Пожалуйста, заполните все обязательные поля перед началом сбора данных.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.termsAccepted) {
        toast({
          title: "Примите условия",
          description: "Необходимо принять условия использования для продолжения.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      console.log('Starting data save with form data:', formData);
      
      // Save all onboarding data to Supabase
      const success = await handleSaveData();
      setIsLoading(false);
      
      if (success) {
        toast({
          title: "Данные сохранены!",
          description: "Начинаем сбор данных для анализа.",
        });
        onComplete();
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSaveData = async () => {
    try {
      console.log('Getting user...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        toast({
          title: "Ошибка авторизации",
          description: "Не удалось получить данные пользователя. Попробуйте войти заново.",
          variant: "destructive",
        });
        return false;
      }

      console.log('User found:', user.id);
      console.log('Saving company data...');

      // Save company data
      const companyData = {
        user_id: user.id,
        linkedin_url: formData.linkedinUrl,
        website_url: formData.websiteUrl,
        company_description: formData.companyDescription,
        main_message: formData.mainMessage,
        icp_description: formData.icpDescription,
        industry: formData.industry,
        company_size: formData.companySize,
        data_collection_status: 'in_progress'
      };

      console.log('Company data to save:', companyData);

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();

      if (companyError) {
        console.error('Error saving company data:', companyError);
        toast({
          title: "Ошибка сохранения",
          description: `Не удалось сохранить данные компании: ${companyError.message}`,
          variant: "destructive",
        });
        return false;
      }

      console.log('Company saved successfully:', company);

      // Save competitors
      console.log('Saving competitors...');
      const competitorData = formData.competitors
        .filter(competitor => competitor.trim())
        .map(competitor => ({
          company_id: company.id,
          name: competitor,
          linkedin_url: `https://linkedin.com/company/${competitor.toLowerCase().replace(/\s+/g, '-')}`,
          website_url: `https://${competitor.toLowerCase().replace(/\s+/g, '')}.com`
        }));

      console.log('Competitor data to save:', competitorData);

      if (competitorData.length > 0) {
        const { error: competitorsError } = await supabase
          .from('competitors')
          .insert(competitorData);

        if (competitorsError) {
          console.error('Error saving competitors:', competitorsError);
          toast({
            title: "Ошибка сохранения",
            description: `Не удалось сохранить данные конкурентов: ${competitorsError.message}`,
            variant: "destructive",
          });
          return false;
        }
        console.log('Competitors saved successfully');
      }

      // Update user profile to mark onboarding as completed
      console.log('Updating user profile...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: "Ошибка обновления",
          description: `Не удалось обновить профиль: ${profileError.message}`,
          variant: "destructive",
        });
        return false;
      }

      console.log('Profile updated successfully');
      return true;

    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Неожиданная ошибка",
        description: `Произошла ошибка при сохранении данных: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!currentStepData) return null;

  const StepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step.id < currentStep 
                    ? 'bg-success border-success text-white' 
                    : step.id === currentStep
                    ? 'border-purple-600 bg-navy-800 text-purple-400'
                    : 'border-white/20 bg-navy-800 text-white/40'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                    step.id < currentStep ? 'bg-success' : 'bg-white/10'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Step {currentStep} of {steps.length}: {currentStepData.title}
            </h2>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="card-glass rounded-2xl p-8 mb-8 animate-fade-in">
          <StepComponent 
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep}
            className="btn-glass"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <div className="text-center text-text-secondary">
            <span className="text-sm">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          <Button
            onClick={handleNext}
            disabled={isLastStep && (!isComplete || isLoading)}
            className="btn-hero"
          >
            {isLoading ? 'Сохранение...' : isLastStep ? 'Start Data Collection' : 'Continue'}
            {!isLastStep && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;