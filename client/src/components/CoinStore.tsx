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

export default function CoinStore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      apiRequest('/api/store/purchase', { 
        method: 'POST', 
        body: { itemId, quantity } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coins/transactions'] });
      toast({ title: 'Purchase successful!', description: 'Item added to your inventory.' });
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
    <div className="space-y-6">
      {/* Header with coin balance */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Coin Store</h2>
          <p className="text-gray-600 dark:text-gray-400">Spend your hard-earned coins on tree seeds and growth boosters!</p>
        </div>
        <div className="flex items-center gap-2 text-xl font-bold">
          <Coins className="h-6 w-6 text-yellow-500" />
          <span className="text-yellow-600" data-testid="text-store-coins">{user?.coins || 0}</span>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList>
          <TabsTrigger value="store" data-testid="tab-store">Store</TabsTrigger>
          <TabsTrigger value="inventory" data-testid="tab-inventory">My Items</TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">Transaction History</TabsTrigger>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-3">
                  <div className="text-4xl mb-2">{getItemIcon(item.itemType)}</div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-yellow-600">{item.price}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => purchaseMutation.mutate({ itemId: item.id, quantity: 1 })}
                    disabled={purchaseMutation.isPending || (user?.coins || 0) < item.price}
                    className="w-full"
                    data-testid={`button-buy-${item.id}`}
                  >
                    {purchaseMutation.isPending ? 'Purchasing...' : 'Buy Now'}
                  </Button>

                  {getUserItemQuantity(item.id) > 0 && (
                    <p className="text-xs text-center text-green-600">
                      You own {getUserItemQuantity(item.id)}
                    </p>
                  )}
                </CardContent>
              </Card>
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
                        Purchased: {new Date(item.purchasedAt).toLocaleDateString()}
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
                            {new Date(transaction.createdAt).toLocaleDateString()}
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
  );
}