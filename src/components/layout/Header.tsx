import { useState } from "react";
import { Menu, X, Zap, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated?: boolean;
  onAuthClick?: () => void;
}

const Header = ({ isAuthenticated = false, onAuthClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-navy-900/80 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur animate-pulse-slow opacity-50"></div>
            </div>
            <span className="text-xl font-bold text-white">ContentGen</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <User className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={onAuthClick}
                >
                  Sign In
                </Button>
                <Button
                  className="btn-hero"
                  onClick={onAuthClick}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-navy-900/95 backdrop-blur-xl border-b border-white/10 animate-slide-down">
            <nav className="px-4 py-6 space-y-4">
              <a href="#features" className="block nav-link">Features</a>
              <a href="#pricing" className="block nav-link">Pricing</a>
              <a href="#about" className="block nav-link">About</a>
              <a href="#contact" className="block nav-link">Contact</a>
              <div className="pt-4 border-t border-white/10 space-y-3">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" className="text-white hover:bg-white/10 flex-1">
                      Settings
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10 flex-1">
                      Profile
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:bg-white/10"
                      onClick={onAuthClick}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full btn-hero"
                      onClick={onAuthClick}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;