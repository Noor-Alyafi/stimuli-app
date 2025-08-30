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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
                  <path d="M8.5 9C8.78 9 9 8.78 9 8.5S8.78 8 8.5 8S8 8.22 8 8.5S8.22 9 8.5 9Z" fill="white"/>
                  <path d="M15.5 9C15.78 9 16 8.78 16 8.5S15.78 8 15.5 8S15 8.22 15 8.5S15.22 9 15.5 9Z" fill="white"/>
                  <path d="M12 6.5C10.62 6.5 9.5 7.62 9.5 9H10.5C10.5 8.17 11.17 7.5 12 7.5S13.5 8.17 13.5 9H14.5C14.5 7.62 13.38 6.5 12 6.5Z" fill="white"/>
                  <path d="M9 11.5C9 12.33 9.67 13 10.5 13H13.5C14.33 13 15 12.33 15 11.5H14C14 11.78 13.78 12 13.5 12H10.5C10.22 12 10 11.78 10 11.5H9Z" fill="white"/>
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
                onClick={() => window.location.href = "/api/login"}
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
