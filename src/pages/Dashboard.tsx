import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import CreateContent from "@/components/dashboard/CreateContent";
import ContentLibrary from "@/components/dashboard/ContentLibrary";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'create':
        return <CreateContent />;
      case 'library':
        return <ContentLibrary />;
      case 'schedule':
        return (
          <div className="card-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Schedule Coming Soon</h2>
            <p className="text-text-secondary">Calendar scheduling feature is in development.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="card-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Analytics Coming Soon</h2>
            <p className="text-text-secondary">Detailed analytics dashboard is in development.</p>
          </div>
        );
      case 'integrations':
        return (
          <div className="card-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Integrations Coming Soon</h2>
            <p className="text-text-secondary">Buffer and other integrations are in development.</p>
          </div>
        );
      case 'billing':
        return (
          <div className="card-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Billing Coming Soon</h2>
            <p className="text-text-secondary">Billing and subscription management is in development.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="card-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Settings Coming Soon</h2>
            <p className="text-text-secondary">Account settings and preferences are in development.</p>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveComponent()}
    </DashboardLayout>
  );
};

export default Dashboard;