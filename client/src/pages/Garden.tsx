import React from 'react';
import EnhancedGrowthTree from '@/components/EnhancedGrowthTree';
import { TreeVisual3D } from '@/components/TreeVisual3D';

export default function Garden() {
  return (
    <div className="container mx-auto py-8 px-4">
      <EnhancedGrowthTree />
    </div>
  );
}