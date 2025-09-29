import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import Landing from "./pages/Landing";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";

const queryClient = new QueryClient();

type AppState = 'landing' | 'onboarding' | 'dashboard';

const App = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Set loading timeout as fallback
    const setLoadingTimeout = () => {
      timeoutId = setTimeout(() => {
        console.warn('Loading timeout reached, falling back to landing');
        setLoading(false);
        setAppState('landing');
      }, 10000);
    };

    const clearLoadingTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    const checkUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Profile fetch error:', error);
          setAppState('landing');
        } else if (profile?.onboarding_completed) {
          setAppState('dashboard');
        } else {
          setAppState('onboarding');
        }
      } catch (err) {
        console.error('Profile check failed:', err);
        setAppState('landing');
      } finally {
        clearLoadingTimeout();
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        clearLoadingTimeout();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setLoadingTimeout();
          await checkUserProfile(session.user.id);
        } else {
          setAppState('landing');
          setLoading(false);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        setLoadingTimeout();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          setAppState('landing');
          clearLoadingTimeout();
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkUserProfile(session.user.id);
        } else {
          setAppState('landing');
          clearLoadingTimeout();
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setAppState('landing');
        clearLoadingTimeout();
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      clearLoadingTimeout();
    };
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
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderCurrentView = () => {
    if (appState === 'dashboard') {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      );
    }

    switch (appState) {
      case 'landing':
        return <Landing onAuthSuccess={handleAuthSuccess} />;
      case 'onboarding':
        return <OnboardingWizard onComplete={handleOnboardingComplete} />;
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
