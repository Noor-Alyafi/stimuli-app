import { useState } from "react";
import { Home, Gamepad2, TrendingUp, Trophy, BookOpen, User as UserIcon, LogOut, Save, ShoppingCart, TreePine, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "training", label: "Training", icon: Gamepad2 },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "store", label: "Store", icon: ShoppingCart },
  { id: "garden", label: "Garden", icon: TreePine },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-navy to-cyan rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Head outline */}
                  <path d="M20 30 Q20 20 30 20 L70 20 Q80 20 80 30 L80 70 Q80 80 70 80 L30 80 Q20 80 20 70 Z" fill="white" stroke="white" strokeWidth="2"/>
                  {/* Brain sections */}
                  <path d="M25 25 Q50 20 75 25 Q75 40 50 35 Q25 40 25 25" fill="white"/>
                  <path d="M25 45 Q50 40 75 45 Q75 60 50 55 Q25 60 25 45" fill="white"/>
                  <path d="M25 65 Q50 60 75 65 Q75 75 50 75 Q25 75 25 65" fill="white"/>
                  {/* Brain detail lines */}
                  <path d="M30 30 Q45 25 60 30" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none"/>
                  <path d="M30 50 Q45 45 60 50" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none"/>
                  <path d="M30 70 Q45 65 60 70" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none"/>
                </svg>
              </div>
              <h1 className="text-2xl font-inter font-bold text-navy">Stimuli</h1>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-full">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {user?.coins || 0}
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                <i className="fas fa-fire text-orange-500"></i>
                <span className="text-sm font-medium text-gray-700">
                  {user?.streak || 0} Day Streak
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.level || 1}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const event = new CustomEvent('showSaveModal');
                  window.dispatchEvent(event);
                }}
                className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                title="Save your progress"
              >
                <Save size={16} />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    isActive
                      ? "border-navy text-navy"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
