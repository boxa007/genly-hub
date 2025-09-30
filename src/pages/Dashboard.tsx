import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import ContentLibrary from "@/components/dashboard/ContentLibrary";
import ScheduleCalendar from "@/components/dashboard/ScheduleCalendar";
import Analytics from "@/components/dashboard/Analytics";
import Settings from "@/components/dashboard/Settings";
import Billing from "@/components/dashboard/Billing";
import Integrations from "@/components/dashboard/Integrations";

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
        return <Integrations />;
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