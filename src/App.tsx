import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import Landing from "./pages/Landing";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

type AppState = 'landing' | 'onboarding' | 'dashboard';

const App = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile?.onboarding_completed) {
            setAppState('dashboard');
          } else {
            setAppState('onboarding');
          }
        } else {
          setAppState('landing');
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user has completed onboarding
        supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.onboarding_completed) {
              setAppState('dashboard');
            } else {
              setAppState('onboarding');
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // This will be handled by the auth state change listener
  };

  const handleOnboardingComplete = () => {
    setAppState('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <Router>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/*" element={renderCurrentView()} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
