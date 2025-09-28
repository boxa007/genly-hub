import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent-purple/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-accent-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent-purple" />
          <span className="text-sm font-medium text-white">AI-Powered Content Generation</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Create Viral LinkedIn
          <br />
          <span className="text-gradient">Content in Minutes</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-text-secondary max-w-4xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Generate engaging LinkedIn posts, lead magnets, and company updates with AI. 
          Boost your professional presence and drive real business results.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={onGetStarted}
            className="btn-hero text-lg px-8 py-4 group"
          >
            Start Creating Content
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="ghost"
            className="btn-glass text-lg px-8 py-4"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-accent-purple mr-2" />
              <span className="text-3xl font-bold text-white">300%</span>
            </div>
            <p className="text-text-secondary">Increase in Engagement</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-accent-blue mr-2" />
              <span className="text-3xl font-bold text-white">10K+</span>
            </div>
            <p className="text-text-secondary">Active Users</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-accent-cyan mr-2" />
              <span className="text-3xl font-bold text-white">2M+</span>
            </div>
            <p className="text-text-secondary">Posts Generated</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-text-muted mb-6">Trusted by professionals at</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            {['Google', 'Microsoft', 'Apple', 'Meta', 'Netflix'].map((company) => (
              <div key={company} className="text-white font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;