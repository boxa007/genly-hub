import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
}

const plans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for professionals getting started with LinkedIn content",
    features: [
      "20 AI-generated posts per month",
      "5 lead magnets",
      "Basic analytics",
      "Content library",
      "Email support"
    ],
    popular: false,
    gradient: "from-gray-500 to-gray-600"
  },
  {
    name: "Professional",
    price: 79,
    period: "month",
    description: "Ideal for active professionals and small teams",
    features: [
      "100 AI-generated posts per month",
      "20 lead magnets",
      "Advanced analytics",
      "Content scheduling",
      "Buffer integration",
      "Priority support",
      "Custom templates"
    ],
    popular: true,
    gradient: "from-purple-500 to-blue-500"
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For agencies and large teams who need unlimited access",
    features: [
      "Unlimited AI-generated posts",
      "Unlimited lead magnets",
      "Advanced team collaboration",
      "White-label solution",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 priority support"
    ],
    popular: false,
    gradient: "from-blue-500 to-cyan-500"
  }
];

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 to-navy-900"></div>
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-white">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Choose Your
            <br />
            <span className="text-gradient">Growth Plan</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Start free, upgrade as you grow. All plans include our core AI features 
            and premium support to help you succeed on LinkedIn.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative card-glass card-hover rounded-2xl overflow-hidden animate-fade-in ${
                plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-text-secondary text-sm mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-text-secondary ml-2">/{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5 mr-3" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-3 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'btn-hero'
                      : 'btn-glass hover:bg-white/20'
                  }`}
                >
                  {plan.popular ? 'Start Free Trial' : 'Get Started'}
                </Button>

                {/* Money Back Guarantee */}
                {plan.popular && (
                  <p className="text-center text-text-muted text-sm mt-4">
                    14-day money-back guarantee
                  </p>
                )}
              </div>

              {/* Background Glow Effect */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-glass p-6 rounded-xl text-left">
              <h4 className="font-semibold text-white mb-3">Can I change plans anytime?</h4>
              <p className="text-text-secondary">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div className="card-glass p-6 rounded-xl text-left">
              <h4 className="font-semibold text-white mb-3">Is there a free trial?</h4>
              <p className="text-text-secondary">Yes, we offer a 14-day free trial with full access to all Professional plan features.</p>
            </div>
            
            <div className="card-glass p-6 rounded-xl text-left">
              <h4 className="font-semibold text-white mb-3">What payment methods do you accept?</h4>
              <p className="text-text-secondary">We accept all major credit cards, PayPal, and offer annual billing with a 20% discount.</p>
            </div>
            
            <div className="card-glass p-6 rounded-xl text-left">
              <h4 className="font-semibold text-white mb-3">Do you offer refunds?</h4>
              <p className="text-text-secondary">Yes, we offer a 30-day money-back guarantee on all paid plans, no questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;