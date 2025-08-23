import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { NotificationSystem, useNotifications } from '@/components/NotificationSystem';
import { UserTree, User, UserInventory, StoreItem } from '@shared/schema';
import { Coins, Sparkles, Droplet, TreePine, Plus, Package } from 'lucide-react';
import { TreeVisual3D } from './TreeVisual3D';
import { useLocation } from 'wouter';
import { PerfectCartoonTree } from './PerfectCartoonTree';
import { motion } from 'framer-motion';

interface TreeVisualProps {
  tree: UserTree;
  onWater: (treeId: number) => void;
  onGrow: (treeId: number) => void;
  onDecorate?: (treeId: number, decorationType: string) => void;
}

const TreeVisual: React.FC<TreeVisualProps> = ({ tree, onWater, onGrow, onDecorate }) => {
  const getGrowthLabel = (stage: number) => {
    const labels = ['Seed', 'Sprout', 'Sapling', 'Tree', 'Mature'];
    return labels[stage - 1] || 'Seed';
  };

  const getNextStageRequirement = (currentStage: number) => {
    const requirements = [0, 50, 150, 300, 500];
    return requirements[currentStage] || 500;
  };

  const nextReq = getNextStageRequirement(tree.growthStage || 1);
  const currentXP = tree.xpContributed || 0;
  const progressPercent = (tree.growthStage || 1) >= 5 ? 100 : (currentXP / nextReq) * 100;

  return (
    <Card className="h-full hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg capitalize">{tree.treeType} Tree</CardTitle>
        <CardDescription>{getGrowthLabel(tree.growthStage || 1)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <PerfectCartoonTree 
            type={tree.treeType} 
            stage={tree.growthStage || 1}
            xpContributed={tree.xpContributed || 0}
            decorations={tree.decorations as string[] || []}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        <Badge variant={(tree.growthStage || 1) >= 5 ? "default" : "secondary"} className="w-full justify-center">
          Stage {tree.growthStage || 1}/5
        </Badge>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP: {currentXP}</span>
            <span>Next: {nextReq}</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onWater(tree.id)}
            variant="outline"
            size="sm"
            className="flex-1"
            data-testid={`button-water-${tree.id}`}
          >
            <Droplet className="h-4 w-4 mr-1" />
            Water
          </Button>
          <Button
            onClick={() => onGrow(tree.id)}
            variant="outline"
            size="sm"
            className="flex-1"
            data-testid={`button-grow-${tree.id}`}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Grow (10 XP)
          </Button>
        </div>
        
        {/* Decoration Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onDecorate?.(tree.id, 'fairy_lights')}
            variant="secondary"
            size="sm"
            className="flex-1"
            data-testid={`button-lights-${tree.id}`}
          >
            ✨ Lights
          </Button>
          <Button
            onClick={() => onDecorate?.(tree.id, 'gnome')}
            variant="secondary"
            size="sm"
            className="flex-1"
            data-testid={`button-gnome-${tree.id}`}
          >
            🧙‍♂️ Gnome
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>Planted: {tree.plantedAt ? new Date(tree.plantedAt).toLocaleDateString() : 'Unknown'}</p>
          {tree.lastWatered && (
            <p>Watered: {new Date(tree.lastWatered).toLocaleDateString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function EnhancedGrowthTree() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const {
    notifications,
    removeNotification,
    showCoinsSpent,
    showXPGain,
  } = useNotifications();

  // Fetch user data for coins
  const { data: user } = useQuery<User>({ queryKey: ['/api/auth/user'] });

  // Fetch user's trees
  const { data: trees = [], isLoading } = useQuery<UserTree[]>({
    queryKey: ['/api/trees'],
  });

  // Fetch user inventory to check for available seeds
  const { data: inventory = [] } = useQuery<UserInventory[]>({
    queryKey: ['/api/inventory'],
  });

  // Fetch store items to get seed information
  const { data: storeItems = [] } = useQuery<StoreItem[]>({
    queryKey: ['/api/store'],
  });

  const seedItems = storeItems.filter(item => item.itemType === 'tree_seed');
  const userSeeds = inventory.filter(item => 
    seedItems.some(seed => seed.id === item.storeItemId) && (item.quantity || 0) > 0
  );

  // Mutations
  const plantTreeMutation = useMutation({
    mutationFn: async ({ treeType, seedItemId }: { treeType: string; seedItemId?: number }) => 
      apiRequest('POST', '/api/trees/plant', { treeType, seedItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trees'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({ title: 'Tree planted successfully!', description: 'Your tree is now growing in the garden!' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Failed to plant tree', 
        description: error.message || 'Unknown error',
        variant: 'destructive' 
      });
    },
  });

  const waterTreeMutation = useMutation({
    mutationFn: async (treeId: number) => 
      apiRequest('POST', `/api/trees/${treeId}/water`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trees'] });
      toast({ title: 'Tree watered!', description: 'Your tree feels refreshed.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to water tree', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const growTreeMutation = useMutation({
    mutationFn: async (treeId: number) => 
      apiRequest('POST', `/api/trees/${treeId}/grow`, { xpToContribute: 10 }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/trees'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Show animated notifications
      showCoinsSpent(2, "Tree Growth");
      setTimeout(() => showXPGain(10, "Tree Contribution"), 500);
      
      if (data.tree.growthStage > (data.previousStage || 1)) {
        toast({ 
          title: '🎉 Tree advanced to next stage!', 
          description: `Your tree is now a ${data.tree.growthStage === 5 ? 'mature tree' : 'bigger tree'}!`
        });
      }
    },
    onError: (error) => {
      toast({ 
        title: 'Cannot grow tree', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const decorateTreeMutation = useMutation({
    mutationFn: async ({ treeId, decorationType, storeItemId }: { treeId: number; decorationType: string; storeItemId: number }) =>
      apiRequest('POST', `/api/trees/${treeId}/decorate`, { decorationType, storeItemId }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/trees'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      
      // Get the correct decoration name from the response
      const decorationName = data?.decorationType === 'fairy_lights' ? 'Fairy Lights' : 
                             data?.decorationType === 'gnome' ? 'Garden Gnome' : 'Decoration';
      toast({ 
        title: `✨ ${decorationName} Added!`, 
        description: 'Your tree looks even more magical!' 
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to decorate tree',
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const treeTypes = [
    { type: 'oak', name: 'Oak', description: 'Strong and steady growth', emoji: '🌳' },
    { type: 'cherry', name: 'Cherry Blossom', description: 'Beautiful pink blooms', emoji: '🌸' },
    { type: 'willow', name: 'Willow', description: 'Graceful and calming', emoji: '🌾' },
    { type: 'rainbow', name: 'Rainbow Tree', description: 'Magical and rare!', emoji: '🌈' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with coin balance */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Growth Garden</h2>
          <p className="text-gray-600 dark:text-gray-400">Nurture your trees with XP and watch them grow!</p>
        </div>
        <div className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span data-testid="text-coin-balance" className="text-yellow-600 dark:text-yellow-400">{user?.coins || 0}</span>
        </div>
      </div>

      <Tabs defaultValue="garden" className="space-y-4">
        <TabsList className="grid grid-cols-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/40 dark:to-blue-900/40 p-1 rounded-xl">
          <TabsTrigger 
            value="garden" 
            data-testid="tab-garden"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
          >
            🌳 My Garden
          </TabsTrigger>
          <TabsTrigger 
            value="plant" 
            data-testid="tab-plant"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
          >
            🌱 Plant New Tree
          </TabsTrigger>
        </TabsList>

        <TabsContent value="garden" className="space-y-4">
          {trees.length === 0 ? (
            <Card className="text-center py-12 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-green-300 dark:border-green-700">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <TreePine className="h-16 w-16 mx-auto text-green-400 mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  No Trees Yet
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Plant your first tree to start your growth journey!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    onClick={() => window.location.hash = '#plant'}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🌱 Plant Your First Tree
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trees.map((tree) => (
                <TreeVisual
                  key={tree.id}
                  tree={tree}
                  onWater={(treeId) => waterTreeMutation.mutate(treeId)}
                  onGrow={(treeId) => growTreeMutation.mutate(treeId)}
                  onDecorate={(treeId, decorationType) => {
                    // Find the decoration item in inventory
                    const decorationName = decorationType === 'fairy_lights' ? 'Fairy Lights' : 'Garden Gnome';
                    const decorationItem = inventory.find(item => {
                      const storeItem = storeItems.find(si => si.id === item.storeItemId);
                      return storeItem?.name === decorationName;
                    });
                    
                    if (decorationItem) {
                      decorateTreeMutation.mutate({
                        treeId,
                        decorationType,
                        storeItemId: decorationItem.storeItemId
                      });
                    } else {
                      toast({ 
                        title: `No ${decorationName.toLowerCase()}`, 
                        description: `Buy ${decorationName.toLowerCase()} from the store first!`,
                        variant: 'destructive'
                      });
                    }
                  }}
                />
              ))}
            </div>
          )}

          {trees.length > 0 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Garden Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600">{trees.length}</div>
                  <div className="text-sm text-green-600">Trees Planted</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600">
                    {trees.filter(t => (t.growthStage || 1) >= 5).length}
                  </div>
                  <div className="text-sm text-blue-600">Mature Trees</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-purple-600">
                    {trees.reduce((sum, tree) => sum + (tree.xpContributed || 0), 0)}
                  </div>
                  <div className="text-sm text-purple-600">Total XP</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="text-2xl font-bold text-yellow-600">
                    {trees.filter(t => t.isSpecial).length}
                  </div>
                  <div className="text-sm text-yellow-600">Special Trees</div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="plant" className="space-y-4">
          {userSeeds.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Seeds Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You need to buy seeds from the Store before you can plant trees!
                </p>
                <Button 
                  onClick={() => {
                    console.log('Navigating to store...');
                    navigate('/store');
                  }}
                  data-testid="button-goto-store"
                >
                  Visit Store
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Your Seeds
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {userSeeds.map((seedInventory) => {
                    const seedItem = seedItems.find(item => item.id === seedInventory.storeItemId);
                    if (!seedItem) return null;
                    
                    return (
                      <div key={seedInventory.id} className="bg-white dark:bg-gray-800 p-2 rounded text-center">
                        <div>{seedItem.name}</div>
                        <Badge variant="secondary" className="text-xs">
                          {seedInventory.quantity} available
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treeTypes.map((treeType) => {
                  const seedItem = seedItems.find(item => 
                    item.name.toLowerCase().includes(treeType.type) ||
                    item.description.toLowerCase().includes(treeType.type)
                  );
                  const userSeed = userSeeds.find(seed => seed.storeItemId === seedItem?.id);
                  const canPlant = userSeed && (userSeed.quantity || 0) > 0;
                  
                  return (
                    <Card 
                      key={treeType.type} 
                      className={`hover:shadow-lg transition-shadow ${canPlant ? 'border-green-200 dark:border-green-800' : 'opacity-60'}`}
                    >
                      <CardHeader className="text-center">
                        <PerfectCartoonTree type={treeType.type} stage={1} size="small" className="mx-auto mb-2" />
                        <CardTitle>{treeType.name}</CardTitle>
                        <CardDescription>{treeType.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        {canPlant ? (
                          <>
                            <Badge variant="default" className="mb-2">
                              {userSeed?.quantity} seeds available
                            </Badge>
                            <Button
                              onClick={() => plantTreeMutation.mutate({ 
                                treeType: treeType.type,
                                seedItemId: seedItem?.id
                              })}
                              disabled={plantTreeMutation.isPending}
                              className="w-full"
                              data-testid={`button-plant-${treeType.type}`}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {plantTreeMutation.isPending ? 'Planting...' : 'Plant Tree'}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="mb-2">
                              No seeds
                            </Badge>
                            <Button
                              onClick={() => navigate('/store')}
                              variant="outline"
                              className="w-full"
                              data-testid={`button-buy-seed-${treeType.type}`}
                            >
                              Buy {treeType.name} Seed
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}