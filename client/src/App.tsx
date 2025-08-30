import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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
import { SaveProgressNotification } from "@/components/SaveProgressNotification";
import { SaveProgressModal } from "@/components/SaveProgressModal";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      <SaveProgressNotification 
        show={showSaveNotification} 
        onClose={() => setShowSaveNotification(false)} 
      />
      <SaveProgressModal 
        isOpen={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
