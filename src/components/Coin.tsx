
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface CoinProps {
  id: number;
  isFake: boolean;
  isLabeledFake: boolean;
  onDragStart: (id: number) => void;
  onLabelCoin: (id: number) => void;
  onAddToScale: (id: number, side: 'left' | 'right') => void;
  disabled?: boolean;
}

const Coin: React.FC<CoinProps> = ({
  id,
  isFake,
  isLabeledFake,
  onLabelCoin,
  onAddToScale,
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

  const handleAddToScale = (side: 'left' | 'right') => {
    onAddToScale(id, side);
    toast({
      title: "Coin added to scale",
      description: `Coin ${id} has been added to the ${side} side of the scale.`,
      duration: 2000,
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={disabled}>
        <motion.div
          className={cn(
            "coin", 
            isLabeledFake ? "coin-labeled" : "",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <div className="coin-inner">
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
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem 
          onClick={() => handleLabelCoin()}
          className="flex items-center"
          disabled={disabled}
        >
          {isLabeledFake ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Mark as Real
            </>
          ) : (
            <>
              <X className="mr-2 h-4 w-4" />
              Mark as Fake
            </>
          )}
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => handleAddToScale('left')}
          className="flex items-center"
          disabled={disabled}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Add to Left Scale
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => handleAddToScale('right')}
          className="flex items-center"
          disabled={disabled}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Add to Right Scale
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Coin;
