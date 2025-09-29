import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-accent-purple hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-lg prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing and using ContentGen, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">2. Service Description</h2>
            <p className="text-text-secondary leading-relaxed">
              ContentGen is an AI-powered platform that analyzes publicly available LinkedIn data to create personalized content recommendations and strategies for professional networking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">3. Data Collection and Use</h2>
            <p className="text-text-secondary leading-relaxed">
              We collect and analyze publicly available information from LinkedIn profiles, company websites, and competitor data that you provide. This information is used solely to generate personalized content recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">4. User Responsibilities</h2>
            <p className="text-text-secondary leading-relaxed">
              You are responsible for providing accurate information and ensuring you have the right to share any data you provide to our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">5. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              ContentGen shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">6. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-accent-purple mb-4">7. Contact Information</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at support@contentgen.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;