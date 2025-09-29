import { useState } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FolderOpen, 
  Calendar, 
  BarChart3, 
  Link, 
  CreditCard, 
  Settings,
  Menu,
  X,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { id: 'library', icon: FolderOpen, label: 'Content Library', path: '/dashboard/library' },
  { id: 'schedule', icon: Calendar, label: 'Schedule', path: '/dashboard/schedule' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { id: 'integrations', icon: Link, label: 'Integrations', path: '/dashboard/integrations' },
  { id: 'billing', icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/dashboard/settings' }
];

const createContentItem = { id: 'create', icon: PlusCircle, label: 'Create Content', path: '/create-post' };

interface DashboardLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ activeTab, onTabChange, children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-primary rounded-lg blur animate-pulse-slow opacity-50"></div>
              </div>
              <span className="text-xl font-bold text-white">ContentGen</span>
            </div>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Create Content Button */}
            <button
              onClick={() => {
                window.location.href = '/create-post';
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-text-secondary hover:text-white hover:bg-white/5"
            >
              <createContentItem.icon className="w-5 h-5" />
              <span className="font-medium">{createContentItem.label}</span>
            </button>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-600/30' 
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">John Smith</p>
                <p className="text-text-secondary text-xs truncate">Professional Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-navy-900 border-b border-white/10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ContentGen</span>
          </div>
          
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-navy-900 to-navy-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;