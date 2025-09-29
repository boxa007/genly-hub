import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for individuals and small teams",
    features: [
      "10 AI-generated posts per month",
      "Basic analytics",
      "1 social media account",
      "Email support",
    ],
    buttonText: "Upgrade to Starter",
    variant: "outline" as const,
    isPopular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing businesses and agencies",
    features: [
      "50 AI-generated posts per month",
      "Advanced analytics & insights",
      "5 social media accounts",
      "Priority support",
      "Content calendar",
      "Team collaboration",
    ],
    buttonText: "Upgrade to Professional",
    variant: "default" as const,
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited AI-generated posts",
      "Custom analytics & reporting",
      "Unlimited accounts",
      "24/7 priority support",
      "Advanced content calendar",
      "API access",
      "Custom integrations",
    ],
    buttonText: "Upgrade to Enterprise",
    variant: "outline" as const,
    isPopular: false,
  },
];

const Billing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptionTier, setSubscriptionTier] = useState<string>("trial");

  useEffect(() => {
    if (user) {
      fetchSubscriptionTier();
    }
  }, [user]);

  const fetchSubscriptionTier = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("subscription_tier")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching subscription tier:", error);
      return;
    }

    if (data) {
      setSubscriptionTier(data.subscription_tier);
    }
  };

  const formatTierName = (tier: string) => {
    if (tier === "trial") return "Trial (14 days free)";
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Upgrade Coming Soon",
      description: `${planName} plan upgrade will be available soon.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="card-glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Billing & Plans</h2>
        <p className="text-text-secondary mb-6">
          Current Plan: <span className="text-white font-semibold">{formatTierName(subscriptionTier)}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border ${
                plan.isPopular
                  ? "border-primary bg-primary/5"
                  : "border-white/10 bg-black/20"
              } p-6 backdrop-blur-sm`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-text-secondary text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-text-secondary">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                className="w-full"
                onClick={() => handleUpgrade(plan.name)}
                disabled={subscriptionTier.toLowerCase() === plan.name.toLowerCase()}
              >
                {subscriptionTier.toLowerCase() === plan.name.toLowerCase()
                  ? "Current Plan"
                  : plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-text-secondary text-sm text-center mt-6">
          All plans include a 14-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default Billing;
