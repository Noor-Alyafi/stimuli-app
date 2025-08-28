import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  gradient?: string;
  shadow?: boolean;
}

export function EnhancedCard({ 
  children, 
  className, 
  hoverScale = 1.02, 
  gradient = "from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
  shadow = true 
}: EnhancedCardProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn(
        "border-2 transition-all duration-300",
        `bg-gradient-to-br ${gradient}`,
        shadow && "shadow-lg hover:shadow-xl",
        "rounded-2xl border-purple-200 dark:border-purple-700",
        "hover:border-purple-300 dark:hover:border-purple-600",
        className
      )}>
        {children}
      </Card>
    </motion.div>
  );
}

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GameCard({ children, className }: GameCardProps) {
  return (
    <EnhancedCard 
      className={cn(
        "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
        "border-amber-200 dark:border-amber-700",
        "hover:border-amber-300 dark:hover:border-amber-600",
        "shadow-xl hover:shadow-2xl",
        "mx-auto max-w-4xl",
        className
      )}
      hoverScale={1.01}
    >
      {children}
    </EnhancedCard>
  );
}

interface ProductCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ProductCard({ children, className }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(139, 69, 219, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn(
        "h-full flex flex-col",
        "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50",
        "dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20",
        "border-2 border-purple-200 dark:border-purple-700",
        "hover:border-purple-300 dark:hover:border-purple-600",
        "rounded-2xl shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        className
      )}>
        {children}
      </Card>
    </motion.div>
  );
}