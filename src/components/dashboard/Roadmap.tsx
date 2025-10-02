import { CheckCircle2, Clock, Rocket } from "lucide-react";

const Roadmap = () => {
  const releases = [
    {
      number: 1,
      date: "August 1, 2025",
      status: "completed",
      title: "Closed Beta",
      featuresAdded: [
        "LinkedIn post text generation"
      ],
      clientGets: [
        "Automatic LinkedIn content creation"
      ]
    },
    {
      number: 2,
      date: "September 2, 2025",
      status: "completed",
      title: "Open Beta",
      featuresAdded: [
        "Onboarding form (ICP, company message, target audience)",
        "4-theme content generation based on briefing",
        "Enhanced text generation"
      ],
      clientGets: [
        "Fill out form once → system generates diverse content across 4 themes",
        "Content tailored to specific business"
      ]
    },
    {
      number: 3,
      date: "October 15, 2025",
      status: "planned",
      title: "RAG & Document Upload",
      featuresAdding: [
        "RAG database about client",
        "Document upload system (databases, company info)",
        "Data enrichment from uploaded information",
        "More unique and personalized content"
      ],
      clientGets: [
        "Content created from real company data",
        "Much more relevant and unique posts",
        "Upload company news, cases, documents → everything transforms into LinkedIn content"
      ]
    },
    {
      number: 4,
      date: "November 1, 2025",
      status: "planned",
      title: "Automatic Prospect Search",
      featuresAdding: [
        "Automatic prospect search based on ICP",
        "Automatic connection requests (20 people per day)",
        "Targeting by client-specified criteria"
      ],
      clientGets: [
        "System finds target audience automatically",
        "20 new contacts daily on autopilot",
        "Network growth without manual work"
      ]
    },
    {
      number: 5,
      date: "November 20, 2025",
      status: "planned",
      title: "Connection Automation",
      featuresAdding: [
        "Automatic approval of incoming connection requests",
        "Filtering and qualification of incoming contacts"
      ],
      clientGets: [
        "All incoming requests processed automatically",
        "System decides who to accept into network",
        "Complete networking automation"
      ]
    },
    {
      number: 6,
      date: "December 10, 2025",
      status: "planned",
      title: "Lead Magnet Generation",
      featuresAdding: [
        "Automatic lead magnet generation",
        "Creation of checklists, guides, PDF materials",
        "Adapted to client's ICP"
      ],
      clientGets: [
        "System creates valuable materials to attract leads",
        "Lead magnets generated automatically for target audience"
      ]
    },
    {
      number: 7,
      date: "January 5, 2026",
      status: "planned",
      title: "Lead Magnet Distribution",
      featuresAdding: [
        "Automatic lead magnet distribution",
        "Sending materials to interested contacts",
        "Trigger-based sending system"
      ],
      clientGets: [
        "Lead magnets automatically sent to right people",
        "System determines optimal sending moment",
        "Interest-to-lead conversion on autopilot"
      ]
    },
    {
      number: 8,
      date: "February 1, 2026",
      status: "planned",
      title: "Message Sequences",
      featuresAdding: [
        "Automatic message sequences (auto-sequence)",
        "Personalized sequences for different segments",
        "Follow-up messages"
      ],
      clientGets: [
        "System conducts conversations with prospects",
        "Automatic nurturing through message series",
        "Converting cold contacts to warm leads"
      ]
    },
    {
      number: 9,
      date: "March 1, 2026",
      status: "planned",
      title: "Final Release - Full Automation",
      featuresAdding: [
        "Automatic commenting on prospects' posts",
        "Social Selling: likes, reactions, engagement",
        "Full LinkedIn activity automation"
      ],
      clientGets: [
        "FULLY AUTONOMOUS SYSTEM",
        "System comments, likes, and engages with target audience automatically",
        "Zero manual work: set it up → forget it → grow",
        "Closed loop: content → search → connection → conversation → lead magnet → conversion"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Rocket className="w-10 h-10 text-brand-cyan" />
          <h1 className="text-4xl font-bold text-white">
            Profilink - Release Roadmap
          </h1>
        </div>
        <p className="text-text-secondary text-lg">
          Our journey to building the ultimate LinkedIn automation platform
        </p>
      </div>

      {/* Releases Timeline */}
      <div className="space-y-6 mb-12">
        {releases.map((release) => (
          <div
            key={release.number}
            className="card-glass p-6 rounded-xl border border-white/10 hover:border-brand-cyan/30 transition-all duration-300"
          >
            {/* Release Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl font-bold text-white">
                    Release {release.number}
                  </span>
                  {release.status === "completed" ? (
                    <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>Planned</span>
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-sm">{release.date}</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-brand-cyan mb-4">
              {release.title}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Features Added/Adding */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>
                    {release.status === "completed" ? "Features Added:" : "Features Adding:"}
                  </span>
                </h4>
                <ul className="space-y-2">
                  {(release.featuresAdded || release.featuresAdding)?.map((feature, idx) => (
                    <li key={idx} className="text-text-secondary text-sm flex items-start space-x-2">
                      <span className="text-brand-cyan mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Client Gets */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Client Gets:</span>
                </h4>
                <ul className="space-y-2">
                  {release.clientGets.map((benefit, idx) => (
                    <li key={idx} className="text-text-secondary text-sm flex items-start space-x-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Value Section */}
      <div className="card-gradient p-8 rounded-xl border border-white/20 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
          <span>🎯</span>
          <span>Final Value After All Releases</span>
        </h2>

        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-brand-cyan">Client Receives:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "✅ Automatic content creation",
              "✅ Automatic target audience search",
              "✅ Automatic networking",
              "✅ Automatic conversations and nurturing",
              "✅ Automatic lead magnet delivery",
              "✅ Automatic Social Selling",
              "✅ Full cycle from awareness to client"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-white font-medium">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-text-secondary font-medium">Time Investment:</span>
            <span className="text-white font-bold">0-10 minutes per week (optional)</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-text-secondary font-medium">Result:</span>
            <span className="text-brand-cyan font-bold text-xl">
              Set it and forget it LinkedIn growth machine 🚀
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
