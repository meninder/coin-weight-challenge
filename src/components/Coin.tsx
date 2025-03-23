
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface CoinProps {
  id: number;
  isFake: boolean;
  isLabeledFake: boolean;
  onDragStart: (id: number) => void;
  onLabelCoin: (id: number) => void;
  disabled?: boolean;
}

const Coin: React.FC<CoinProps> = ({
  id,
  isFake,
  isLabeledFake,
  onDragStart,
  onLabelCoin,
  disabled = false
}) => {
  const { toast } = useToast();
  
  const handleLabelCoin = () => {
    onLabelCoin(id);
    toast({
      title: isLabeledFake ? "Label removed" : "Coin labeled as fake",
      description: isLabeledFake 
        ? `Coin ${id} is no longer labeled as fake.` 
        : `You've labeled Coin ${id} as the fake coin.`,
      duration: 2000,
    });
  };

  // We need to use the native HTML5 drag API
  const handleNativeDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!disabled) {
      e.dataTransfer.setData("text/plain", id.toString());
      onDragStart(id);
    }
  };

  return (
    <motion.div
      className={cn(
        "coin", 
        isLabeledFake ? "coin-labeled" : "",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
      // Use the native HTML5 draggable attribute
      draggable={!disabled}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // Important: Use the native HTML5 drag start event
      // Instead of using Framer Motion's onDragStart prop which has a different signature
      layout
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <div 
        className="coin-inner"
        // Apply the drag handler to the inner div instead of the motion.div
        onDragStart={handleNativeDragStart}
        draggable={!disabled}
      >
        <span>{id}</span>
      </div>
      <button 
        onClick={handleLabelCoin}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md opacity-0 hover:opacity-100 transition-opacity focus:opacity-100"
        aria-label={isLabeledFake ? "Remove fake label" : "Label as fake"}
      >
        {isLabeledFake ? "×" : "!"}
      </button>
    </motion.div>
  );
};

export default Coin;
