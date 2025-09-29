import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button 
          onClick={() => window.history.back()} 
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-lg prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">1. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed">
              We collect information you provide directly to us, such as your LinkedIn profile URL, company website, business description, target audience details, and competitor information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">2. How We Use Your Information</h2>
            <p className="text-text-secondary leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mt-4">
              <li>Analyze your brand and content strategy</li>
              <li>Generate personalized content recommendations</li>
              <li>Improve our AI algorithms and service quality</li>
              <li>Communicate with you about our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">3. Data Security</h2>
            <p className="text-text-secondary leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">4. Data Sharing</h2>
            <p className="text-text-secondary leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">5. Data Retention</h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your information for as long as necessary to provide our services or as required by law. You may request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">6. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed">
              You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">7. Changes to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">8. Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@contentgen.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;