import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { StoreItem, User, CoinTransaction, UserInventory } from '@shared/schema';
import { Coins, ShoppingCart, Package, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationSystem, useNotifications } from '@/components/NotificationSystem';

export default function CoinStore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    notifications,
    removeNotification,
    showCoinsSpent,
    showGeneral,
  } = useNotifications();

  // Fetch user data for coins
  const { data: user } = useQuery<User>({ queryKey: ['/api/auth/user'] });

  // Fetch store items
  const { data: storeItems = [], isLoading: itemsLoading } = useQuery<StoreItem[]>({
    queryKey: ['/api/store'],
  });

  // Fetch user inventory
  const { data: inventory = [] } = useQuery<UserInventory[]>({
    queryKey: ['/api/inventory'],
  });

  // Fetch coin transactions
  const { data: transactions = [] } = useQuery<CoinTransaction[]>({
    queryKey: ['/api/coins/transactions'],
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => 
      apiRequest('POST', '/api/store/purchase', { itemId, quantity }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coins/transactions'] });
      
      // Show animated coin spending notification
      const item = storeItems.find(item => item.id === data.itemId);
      if (item) {
        showCoinsSpent(item.price, `${item.name} Purchased!`);
      }
      
      showGeneral('🎉 Purchase successful! Item added to your inventory.', 'success');
    },
    onError: (error) => {
      toast({ 
        title: 'Purchase failed', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

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

  const getUserItemQuantity = (itemId: number) => {
    const inventoryItem = inventory.find(inv => inv.storeItemId === itemId);
    return inventoryItem?.quantity || 0;
  };

  if (itemsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NotificationSystem notifications={notifications} onRemove={removeNotification} />
      <div className="space-y-6">
      {/* Header with coin balance */}
      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <div>
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            🏪 Coin Store
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Spend your hard-earned coins on tree seeds and growth boosters!
          </motion.p>
        </div>
        <motion.div 
          className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-lg border border-yellow-300 dark:border-yellow-700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Coins className="h-6 w-6 text-yellow-500" />
          <span className="text-yellow-600 dark:text-yellow-400" data-testid="text-store-coins">{user?.coins || 0}</span>
        </motion.div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-1 rounded-xl">
          <TabsTrigger 
            value="store" 
            data-testid="tab-store"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
          >
            🏪 Store
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            data-testid="tab-inventory"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
          >
            📦 My Items
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            data-testid="tab-transactions"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
          >
            📊 History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  data-testid={`button-category-${category.id}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Store items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={item.id}
              >
                <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-blue-200 dark:hover:border-blue-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <motion.span 
                          className="text-3xl"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {getItemIcon(item.itemType)}
                        </motion.span>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                          {item.name}
                        </span>
                      </CardTitle>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Badge 
                          variant="secondary" 
                          className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                        >
                          {item.category}
                        </Badge>
                      </motion.div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                      {item.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-3 py-1 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">{item.price}</span>
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => purchaseMutation.mutate({ itemId: item.id, quantity: 1 })}
                      disabled={purchaseMutation.isPending || (user?.coins || 0) < item.price}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`button-buy-${item.id}`}
                    >
                      {purchaseMutation.isPending ? '⏳ Purchasing...' : '🛒 Buy Now'}
                    </Button>
                  </motion.div>

                  {getUserItemQuantity(item.id) > 0 && (
                    <p className="text-xs text-center text-green-600">
                      You own {getUserItemQuantity(item.id)}
                    </p>
                  )}
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Items Available</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new items!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {inventory.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Empty Inventory</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't purchased any items yet.
                </p>
                <Button onClick={() => setSelectedCategory('all')}>
                  Browse Store
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => {
                const storeItem = storeItems.find(si => si.id === item.storeItemId);
                if (!storeItem) return null;

                return (
                  <Card key={item.id}>
                    <CardHeader className="text-center pb-3">
                      <div className="text-4xl mb-2">{getItemIcon(storeItem.itemType)}</div>
                      <CardTitle className="text-lg">{storeItem.name}</CardTitle>
                      <CardDescription className="text-sm">{storeItem.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        Quantity: {item.quantity}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        Purchased: {item.purchasedAt ? new Date(item.purchasedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {transactions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Transactions</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your coin transaction history will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your coin earning and spending history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transactions.slice(0, 10).map((transaction, index) => (
                  <div key={transaction.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.amount > 0 
                            ? 'bg-green-100 dark:bg-green-900/20' 
                            : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          <Coins className={`h-4 w-4 ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                    </div>
                    {index < transactions.slice(0, 10).length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}