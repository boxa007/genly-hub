import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [termsAgreed, setTermsAgreed] = useState(true); // по умолчанию TRUE
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    linkedinUrl: "",
    websiteUrl: "",
    companyDescription: "",
    mainMessage: "",
    icpDescription: "",
    industry: "",
    companySize: "",
    competitors: ["", "", ""]
  });

  const currentStepData = steps.find(step => step.id === currentStep);
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  const sendWebhook = async (email: string) => {
    try {
      const payload = {
        email: email
      };

      const response = await fetch('https://kuts.air2.top/webhook/start-data-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Webhook response:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Webhook error:', error);
      // Не останавливаем процесс из-за ошибки webhook
      return { success: false, error: error.message };
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleStartDataCollection();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStartDataCollection = async () => {
    // Проверка согласия с Terms
    if (!termsAgreed) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Сохранить данные в Supabase
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          linkedin_url: formData.linkedinUrl,
          website_url: formData.websiteUrl,
          company_description: formData.companyDescription,
          main_message: formData.mainMessage,
          icp_description: formData.icpDescription,
          industry: formData.industry,
          company_size: formData.companySize,
          data_collection_status: 'in_progress'
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Сохранить конкурентов
      const competitorData = formData.competitors
        .filter(competitor => competitor.trim())
        .map(competitor => ({
          company_id: company.id,
          name: competitor,
          linkedin_url: `https://linkedin.com/company/${competitor.toLowerCase().replace(/\s+/g, '-')}`,
          website_url: `https://${competitor.toLowerCase().replace(/\s+/g, '')}.com`
        }));

      if (competitorData.length > 0) {
        const { error: competitorsError } = await supabase
          .from('competitors')
          .insert(competitorData);

        if (competitorsError) throw competitorsError;
      }

      // Обновить профиль пользователя
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Отправить webhook (не блокирует процесс)
      const webhookResult = await sendWebhook(user.email);

      if (webhookResult.success) {
        console.log('Webhook sent successfully');
      } else {
        console.warn('Webhook failed, but continuing:', webhookResult.error);
      }

      // Перенаправить в dashboard (независимо от результата webhook)
      onComplete();

    } catch (error) {
      console.error('Error during onboarding completion:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
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
                    ? 'border-accent-purple bg-navy-800 text-accent-purple'
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
            {...(currentStep === 5 && { termsAgreed, setTermsAgreed })}
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
            disabled={isLastStep && (!termsAgreed || loading)}
            className="btn-hero disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Starting...' : isLastStep ? 'Start Data Collection' : 'Continue'}
            {!isLastStep && !loading && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;