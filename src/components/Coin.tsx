import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, ArrowRight, Check, X, ShieldCheck } from 'lucide-react';

interface CoinProps {
  id: number;
  isFake: boolean;
  isLabeledFake: boolean;
  isLabeledReal: boolean;
  onDragStart: (id: number) => void;
  onLabelCoin: (id: number, label: 'fake' | 'real' | null) => void;
  onAddToScale: (id: number, side: 'left' | 'right') => void;
  disabled?: boolean;
}

const Coin: React.FC<CoinProps> = ({
  id,
  isFake,
  isLabeledFake,
  isLabeledReal,
  onLabelCoin,
  onAddToScale,
  disabled = false
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const handleLabelCoinAsFake = () => {
    onLabelCoin(id, 'fake');
    setOpen(false);
  };

  const handleLabelCoinAsReal = () => {
    onLabelCoin(id, 'real');
    setOpen(false);
  };

  const handleAddToScale = (side: 'left' | 'right') => {
    onAddToScale(id, side);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <motion.div
          className={cn(
            "coin relative", 
            isLabeledFake ? "coin-labeled" : "",
            isLabeledReal ? "coin-labeled-real" : "",
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
          {isLabeledReal && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
              <ShieldCheck className="h-3 w-3" />
            </div>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="p-1">
          <button 
            onClick={handleLabelCoinAsFake}
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center hover:bg-accent focus:bg-accent"
            disabled={disabled}
          >
            {isLabeledFake ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Remove Fake Label
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Mark as Fake
              </>
            )}
          </button>
          <button 
            onClick={handleLabelCoinAsReal}
            className="w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center hover:bg-accent focus:bg-accent"
            disabled={disabled}
          >
            {isLabeledReal ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Remove Real Label
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                Mark as Real
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
