import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Landing from "./pages/Landing";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

type AppState = 'landing' | 'onboarding' | 'dashboard';

const App = () => {
  const [appState, setAppState] = useState<AppState>('landing');

  const handleAuthSuccess = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = () => {
    setAppState('dashboard');
  };

  const renderCurrentView = () => {
    switch (appState) {
      case 'landing':
        return <Landing onAuthSuccess={handleAuthSuccess} />;
      case 'onboarding':
        return <OnboardingWizard onComplete={handleOnboardingComplete} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Landing onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {renderCurrentView()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
