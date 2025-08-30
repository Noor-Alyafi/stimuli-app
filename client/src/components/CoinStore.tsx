import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useStaticStore, useStaticCoinTransactions } from '@/hooks/useStaticData';
import { useStaticAuth } from '@/hooks/useStaticAuth';
import { Coins, ShoppingCart, Package, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationSystem, useNotifications } from '@/components/NotificationSystem';

export default function CoinStoreMain() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const { user, refreshUser } = useStaticAuth();
  const { storeItems, inventory, purchaseItem } = useStaticStore();
  const { transactions } = useStaticCoinTransactions();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    notifications,
    removeNotification,
    showCoinsSpent,
    showGeneral,
  } = useNotifications();

  const categories = [
    { id: 'all', name: 'All Items', icon: ShoppingCart },
    { id: 'seeds', name: 'Tree Seeds', icon: Sparkles },
    { id: 'boosters', name: 'Boosters', icon: TrendingUp },
    { id: 'decorations', name: 'Decorations', icon: Package },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory);

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'tree_seed': return '🌱';
      case 'tree_fertilizer': return '💧';
      case 'decoration': return '✨';
      default: return '📦';
    }
  };

  const getUserItemQuantity = (itemId: string) => {
    const inventoryItem = inventory.find(inv => inv.storeItemId === itemId);
    return inventoryItem?.quantity || 0;
  };

  const handlePurchase = async (itemId: string, quantity: number = 1) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      purchaseItem(itemId, quantity);
      
      // Show animated coin spending notification
      const item = storeItems.find(item => item.id === itemId);
      if (item) {
        showCoinsSpent(item.price, `${item.name} Purchased!`);
      }
      
      showGeneral('🎉 Purchase successful! Item added to your inventory.', 'success');
      refreshUser(); // Refresh user data to show updated coins
    } catch (error: any) {
      toast({ 
        title: 'Purchase failed', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Please log in to access the store.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coin Store</h1>
          <p className="text-muted-foreground">Spend your earned coins on seeds, boosters, and decorations</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full">
          <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <span className="font-semibold text-yellow-700 dark:text-yellow-300">
            {user.coins || 0} coins
          </span>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const userQuantity = getUserItemQuantity(item.id);
              const canAfford = (user.coins || 0) >= item.price;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{getItemIcon(item.itemType)}</div>
                        <Badge variant={canAfford ? "default" : "secondary"}>
                          <Coins className="h-3 w-3 mr-1" />
                          {item.price}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="text-sm flex-grow">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-grow flex flex-col justify-end pt-0">
                      <div className="space-y-3">
                        {userQuantity > 0 && (
                          <div className="flex items-center justify-center">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                              <Package className="h-3 w-3 mr-1" />
                              Owned: {userQuantity}
                            </Badge>
                          </div>
                        )}
                        
                        <Button
                          onClick={() => handlePurchase(item.id)}
                          disabled={!canAfford || isLoading}
                          className="w-full"
                          variant={canAfford ? "default" : "secondary"}
                        >
                          {!canAfford ? "Insufficient Coins" : isLoading ? "Purchasing..." : "Purchase"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Coins className="h-4 w-4" />
                    <span className="font-medium">
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export CoinStore function for backward compatibility  
export function CoinStore() {
  return <CoinStoreMain />;
}