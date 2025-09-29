import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import ContentLibrary from "@/components/dashboard/ContentLibrary";
import ScheduleCalendar from "@/components/dashboard/ScheduleCalendar";
import Analytics from "@/components/dashboard/Analytics";
import Settings from "@/components/dashboard/Settings";
import Billing from "@/components/dashboard/Billing";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome onTabChange={setActiveTab} />;
      case 'library':
        return <ContentLibrary />;
      case 'schedule':
        return <ScheduleCalendar />;
      case 'analytics':
        return <Analytics />;
      case 'integrations':
        return (
          <div className="card-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Integrations Coming Soon</h2>
            <p className="text-text-secondary">Buffer and other integrations are in development.</p>
          </div>
        );
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome onTabChange={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveComponent()}
    </DashboardLayout>
  );
};

export default Dashboard;