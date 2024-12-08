import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useWalkthrough } from '../contexts/WalkthroughContext';
import { pageSteps } from '../contexts/WalkthroughContext';

export function WalkthroughButton({ currentPageType }) {
  const { toggleWalkthrough, isWalkthroughActive, setPage, addSteps, clearSteps } = useWalkthrough();

  const handleClick = () => {
    clearSteps();
    setPage(currentPageType);
    addSteps(pageSteps[currentPageType], currentPageType);
    toggleWalkthrough();
  };

  return (
    <Button 
      onClick={handleClick}
      variant="ghost" 
      size="icon"
      className="relative"
      aria-label={isWalkthroughActive ? 'Stop Walkthrough' : 'Start Walkthrough'}
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );
}

