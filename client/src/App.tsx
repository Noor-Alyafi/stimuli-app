import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Training from "@/pages/Training";
import ProgressPage from "@/pages/Progress";
import Achievements from "@/pages/Achievements";
import Journal from "@/pages/Journal";
import Store from "@/pages/Store";
import Garden from "@/pages/Garden";
import AuthPage from "@/components/auth/AuthPage";
import { SaveProgressNotification } from "@/components/SaveProgressNotification";
import { Switch, Route } from "wouter";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Show save notification when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      setShowSaveNotification(true);
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute 
        path="/*" 
        component={() => (
          <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-auto">
              {renderContent()}
            </div>
            <SaveProgressNotification 
              show={showSaveNotification} 
              onClose={() => setShowSaveNotification(false)} 
            />
          </div>
        )}
      />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
