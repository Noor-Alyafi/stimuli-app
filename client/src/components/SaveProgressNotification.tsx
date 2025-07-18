import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SaveProgressNotificationProps {
  show: boolean;
  onClose: () => void;
}

export function SaveProgressNotification({ show, onClose }: SaveProgressNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="m-4"
          >
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Save className="text-cyan" size={24} />
                    <h3 className="font-inter font-semibold text-navy">Save Your Progress</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  You're currently using demo mode. Your progress will be lost when you leave. 
                  Sign in to save your XP, achievements, and training history permanently.
                </p>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-navy hover:bg-navy/90 text-white"
                    onClick={() => {
                      window.location.href = "/api/login";
                    }}
                  >
                    Save Progress
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                  >
                    Continue Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}