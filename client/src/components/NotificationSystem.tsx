import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap, Sparkles, CheckCircle, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'xp' | 'coins' | 'spending' | 'achievement' | 'congratulations' | 'success' | 'error';
  message: string;
  amount?: number;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      const duration = notification.duration || 4000;
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, duration);
      
      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'xp':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'coins':
        return <Coins className="w-5 h-5 text-yellow-500" />;
      case 'spending':
        return <Coins className="w-5 h-5 text-red-400" />;
      case 'achievement':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'congratulations':
        return <Gift className="w-5 h-5 text-pink-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <CheckCircle className="w-5 h-5 text-red-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'xp':
        return 'from-yellow-400 to-orange-500';
      case 'coins':
        return 'from-yellow-500 to-amber-600';
      case 'spending':
        return 'from-red-400 to-pink-500';
      case 'achievement':
        return 'from-purple-400 to-indigo-500';
      case 'congratulations':
        return 'from-pink-400 to-rose-500';
      case 'success':
        return 'from-green-400 to-emerald-500';
      case 'error':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-green-400 to-emerald-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2" data-testid="notification-system">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className={`
              relative overflow-hidden rounded-xl p-4 shadow-lg backdrop-blur-sm
              bg-gradient-to-r ${getColor(notification.type)}
              text-white min-w-[250px] max-w-[350px]
            `}
            data-testid={`notification-${notification.type}`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {getIcon(notification.type)}
              </motion.div>
              
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {notification.message}
                </div>
                {notification.amount && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mt-1"
                  >
                    {notification.type === 'spending' ? '-' : '+'}
                    {notification.amount}
                    {notification.type === 'xp' ? ' XP' : notification.type === 'coins' || notification.type === 'spending' ? ' coins' : ''}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Animated background sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ 
                    opacity: 0, 
                    x: Math.random() * 200, 
                    y: Math.random() * 80 
                  }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 200, 
                    y: Math.random() * 80 
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.3, 
                    repeat: Infinity 
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook to manage notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showXPGain = (amount: number, message: string = "XP Gained!") => {
    addNotification({ type: 'xp', message, amount });
  };

  const showCoinsGained = (amount: number, message: string = "Coins Earned!") => {
    addNotification({ type: 'coins', message, amount });
  };

  const showCoinsSpent = (amount: number, message: string = "Coins Spent") => {
    addNotification({ type: 'spending', message, amount });
  };

  const showCongratulations = (message: string, xp?: number, coins?: number) => {
    addNotification({ 
      type: 'congratulations', 
      message: `🎉 ${message}${xp ? ` +${xp} XP` : ''}${coins ? ` +${coins} coins` : ''}`,
      duration: 5000 
    });
  };

  const showAchievement = (message: string) => {
    addNotification({ type: 'achievement', message, duration: 6000 });
  };

  const showGeneral = (message: string, type: 'success' | 'error' = 'success') => {
    addNotification({ type, message, duration: 3000 });
  };

  return {
    notifications,
    removeNotification,
    showXPGain,
    showCoinsGained,
    showCoinsSpent,
    showCongratulations,
    showAchievement,
    showGeneral,
  };
}