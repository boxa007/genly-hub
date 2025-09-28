import { 
  Brain, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Users, 
  Zap,
  Target,
  BarChart3,
  MessageSquare
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description: "Advanced AI creates engaging, personalized LinkedIn content that resonates with your audience and drives engagement.",
    gradient: "from-purple-500 to-blue-500"
  },
  {
    icon: Target,
    title: "Audience Targeting",
    description: "Smart targeting based on your ICP and industry insights to ensure your content reaches the right professionals.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Optimize posting times based on your audience's activity patterns for maximum reach and engagement.",
    gradient: "from-cyan-500 to-teal-500"
  },
  {
    icon: FileText,
    title: "Multiple Content Types",
    description: "Generate various content formats: engagement posts, educational content, lead magnets, and company updates.",
    gradient: "from-teal-500 to-green-500"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track engagement metrics, audience growth, and content performance to optimize your LinkedIn strategy.",
    gradient: "from-green-500 to-yellow-500"
  },
  {
    icon: MessageSquare,
    title: "Buffer Integration",
    description: "Seamlessly publish and schedule your content across platforms with our Buffer integration.",
    gradient: "from-yellow-500 to-orange-500"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-800"></div>
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-white">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <br />
            <span className="text-gradient">Dominate LinkedIn</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you create, schedule, and optimize 
            your LinkedIn content for maximum professional impact.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-glass card-hover p-8 rounded-2xl group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="card-glass p-8 rounded-2xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-accent-purple mr-3" />
              <h3 className="text-2xl font-bold text-white">Ready to Transform Your LinkedIn Presence?</h3>
            </div>
            
            <p className="text-text-secondary mb-8 text-lg">
              Join thousands of professionals who are already creating viral content and growing their personal brands.
            </p>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center text-text-secondary">
                <Users className="w-5 h-5 mr-2 text-accent-blue" />
                <span>10,000+ Active Users</span>
              </div>
              <div className="flex items-center text-text-secondary">
                <Zap className="w-5 h-5 mr-2 text-accent-purple" />
                <span>2M+ Posts Generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;