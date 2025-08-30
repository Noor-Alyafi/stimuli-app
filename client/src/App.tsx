import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Training from "@/pages/Training";
import ProgressPage from "@/pages/Progress";
import Achievements from "@/pages/Achievements";
import Journal from "@/pages/Journal";
import Store from "@/pages/Store";
import Garden from "@/pages/Garden";
import Landing from "@/pages/Landing";
import { SaveProgressModal } from "@/components/SaveProgressModal";
import { AuthProvider, useStaticAuth } from "@/hooks/useStaticAuth";
import { LocalStorageManager } from "@/lib/localStorage";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { user, isLoading } = useStaticAuth();

  // Initialize local storage data
  useEffect(() => {
    LocalStorageManager.initializeData();
  }, []);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Show save modal when user leaves the page or clicks save button
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      setShowSaveModal(true);
      event.preventDefault();
      event.returnValue = 'You have unsaved progress. Would you like to save your progress before leaving?';
    };

    const handleShowSaveModal = () => {
      setShowSaveModal(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('showSaveModal', handleShowSaveModal);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('showSaveModal', handleShowSaveModal);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "training":
        return <Training />;
      case "progress":
        return <ProgressPage />;
      case "achievements":
        return <Achievements />;
      case "journal":
        return <Journal />;
      case "store":
        return <Store />;
      case "garden":
        return <Garden />;
      default:
        return <Home />;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-navy to-cyan rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="30" r="15" fill="white"/>
              <circle cx="35" cy="60" r="8" fill="white"/>
              <circle cx="65" cy="60" r="8" fill="white"/>
              <circle cx="50" cy="80" r="6" fill="white"/>
            </svg>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Landing page if user is not authenticated
  if (!user) {
    return <Landing />;
  }

  // Show main app if user is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      <SaveProgressModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
