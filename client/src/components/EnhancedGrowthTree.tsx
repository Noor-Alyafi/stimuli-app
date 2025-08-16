import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { UserTree, User } from '@shared/schema';
import { Coins, Sparkles, Droplet, TreePine } from 'lucide-react';

interface TreeVisualProps {
  tree: UserTree;
  onWater: (treeId: number) => void;
  onGrow: (treeId: number) => void;
}

const TreeVisual: React.FC<TreeVisualProps> = ({ tree, onWater, onGrow }) => {
  const getTreeEmoji = (treeType: string, growthStage: number) => {
    const stages = {
      oak: ['🌱', '🌿', '🌳', '🌳', '🌲'],
      cherry: ['🌱', '🌿', '🌸', '🌸', '🌺'],
      willow: ['🌱', '🌿', '🌾', '🌾', '🌿'],
      rainbow: ['🌱', '🌈', '🌈🌳', '🌈🌳✨', '🌈🌳✨🎆']
    };
    return stages[tree.treeType as keyof typeof stages]?.[growthStage - 1] || '🌱';
  };

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
  const progressPercent = tree.growthStage >= 5 ? 100 : (currentXP / nextReq) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg capitalize">{tree.treeType} Tree</CardTitle>
        <CardDescription>{getGrowthLabel(tree.growthStage || 1)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-6xl mb-2">{getTreeEmoji(tree.treeType, tree.growthStage || 1)}</div>
          <Badge variant={tree.growthStage >= 5 ? "default" : "secondary"}>
            Stage {tree.growthStage || 1}/5
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP: {currentXP}</span>
            <span>Next: {nextReq}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
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

        <div className="text-xs text-gray-500 space-y-1">
          <p>Planted: {new Date(tree.plantedAt).toLocaleDateString()}</p>
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

  // Fetch user data for coins
  const { data: user } = useQuery<User>({ queryKey: ['/api/auth/user'] });

  // Fetch user's trees
  const { data: trees = [], isLoading } = useQuery<UserTree[]>({
    queryKey: ['/api/trees'],
  });

  // Mutations
  const plantTreeMutation = useMutation({
    mutationFn: async (treeType: string) => 
      apiRequest('/api/trees/plant', { 
        method: 'POST', 
        body: { treeType } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trees'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ title: 'Tree planted successfully!', description: '+5 coins earned' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to plant tree', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const waterTreeMutation = useMutation({
    mutationFn: async (treeId: number) => 
      apiRequest(`/api/trees/${treeId}/water`, { method: 'POST' }),
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
      apiRequest(`/api/trees/${treeId}/grow`, { 
        method: 'POST', 
        body: { xpToContribute: 10 } 
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/trees'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ 
        title: 'Tree grew!', 
        description: data.tree.growthStage > (data.previousStage || 1) 
          ? 'Your tree advanced to the next stage!' 
          : 'XP contributed to growth.' 
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to grow tree', 
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Growth Garden</h2>
          <p className="text-gray-600 dark:text-gray-400">Nurture your trees with XP and watch them grow!</p>
        </div>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span data-testid="text-coin-balance">{user?.coins || 0}</span>
        </div>
      </div>

      <Tabs defaultValue="garden" className="space-y-4">
        <TabsList>
          <TabsTrigger value="garden" data-testid="tab-garden">My Garden</TabsTrigger>
          <TabsTrigger value="plant" data-testid="tab-plant">Plant New Tree</TabsTrigger>
        </TabsList>

        <TabsContent value="garden" className="space-y-4">
          {trees.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <TreePine className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Trees Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Plant your first tree to start your growth journey!
                </p>
                <Button onClick={() => window.location.hash = '#plant'}>
                  Plant Your First Tree
                </Button>
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
                />
              ))}
            </div>
          )}

          {trees.length > 0 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Garden Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{trees.length}</div>
                  <div className="text-sm text-green-600">Trees Planted</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {trees.filter(t => (t.growthStage || 1) >= 5).length}
                  </div>
                  <div className="text-sm text-blue-600">Mature Trees</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {trees.reduce((sum, tree) => sum + (tree.xpContributed || 0), 0)}
                  </div>
                  <div className="text-sm text-purple-600">Total XP</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treeTypes.map((treeType) => (
              <Card key={treeType.type} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{treeType.emoji}</div>
                  <CardTitle>{treeType.name}</CardTitle>
                  <CardDescription>{treeType.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => plantTreeMutation.mutate(treeType.type)}
                    disabled={plantTreeMutation.isPending}
                    className="w-full"
                    data-testid={`button-plant-${treeType.type}`}
                  >
                    {plantTreeMutation.isPending ? 'Planting...' : 'Plant Tree'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Earn 5 coins when you plant!
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}