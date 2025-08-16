import React from 'react';
import EnhancedGrowthTree from '@/components/EnhancedGrowthTree';
import { TreeStyleComparison } from '@/components/CartoonTreeExamples';

export default function Garden() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <TreeStyleComparison />
      <EnhancedGrowthTree />
    </div>
  );
}