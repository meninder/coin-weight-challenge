
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [open, setOpen] = useState(false);
  
  const handleLabelCoin = () => {
    onLabelCoin(id);
    setOpen(false);
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
    setOpen(false);
    toast({
      title: "Coin added to scale",
      description: `Coin ${id} has been added to the ${side} side of the scale.`,
      duration: 2000,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <motion.div
          className={cn(
            "coin relative", 
            isLabeledFake ? "coin-labeled" : "",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
          {isLabeledFake && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
              !
            </div>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="p-1">
          <button 
            onClick={handleLabelCoin}
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center hover:bg-accent focus:bg-accent"
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
          </button>
          <button 
            onClick={() => handleAddToScale('left')}
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center hover:bg-accent focus:bg-accent"
            disabled={disabled}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Add to Left Scale
          </button>
          <button 
            onClick={() => handleAddToScale('right')}
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center hover:bg-accent focus:bg-accent"
            disabled={disabled}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Add to Right Scale
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Coin;
