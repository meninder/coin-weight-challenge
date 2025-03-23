import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Coin from './Coin';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Search } from 'lucide-react';

interface ScaleProps {
  leftPanCoins: number[];
  rightPanCoins: number[];
  fakeCoinId: number;
  onAddCoin: (side: 'left' | 'right', coinId: number) => void;
  onRemoveCoin: (side: 'left' | 'right', coinId: number) => void;
  onWeigh: () => void;
  disabled: boolean;
  hasWeighed: boolean;
  onLabelCoin: (id: number, label: 'fake' | 'real' | 'candidate' | null) => void;
  labeledFakeCoin: number | null;
  labeledRealCoins: number[];
  labeledCandidateCoins?: number[];
}

const Scale: React.FC<ScaleProps> = ({
  leftPanCoins,
  rightPanCoins,
  fakeCoinId,
  onAddCoin,
  onRemoveCoin,
  onWeigh,
  disabled,
  hasWeighed,
  onLabelCoin,
  labeledFakeCoin,
  labeledRealCoins,
  labeledCandidateCoins = []
}) => {
  const [scaleState, setScaleState] = useState<'balanced' | 'left-heavy' | 'right-heavy'>('balanced');
  
  useEffect(() => {
    if (hasWeighed) {
      const leftWeight = leftPanCoins.reduce((acc, coinId) => acc + (coinId === fakeCoinId ? 0 : 1), 0);
      const rightWeight = rightPanCoins.reduce((acc, coinId) => acc + (coinId === fakeCoinId ? 0 : 1), 0);
      
      if (leftWeight > rightWeight) {
        setScaleState('left-heavy');
      } else if (rightWeight > leftWeight) {
        setScaleState('right-heavy');
      } else {
        setScaleState('balanced');
      }
    } else {
      setScaleState('balanced');
    }
  }, [hasWeighed, leftPanCoins, rightPanCoins, fakeCoinId]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
  };
  
  const handleDrop = (side: 'left' | 'right', e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    const coinId = parseInt(e.dataTransfer.getData('text/plain'));
    onAddCoin(side, coinId);
  };

  const handleAddToScale = (coinId: number, side: 'left' | 'right') => {
    if (leftPanCoins.includes(coinId)) {
      onRemoveCoin('left', coinId);
    }
    if (rightPanCoins.includes(coinId)) {
      onRemoveCoin('right', coinId);
    }
    onAddCoin(side, coinId);
  };
  
  const markAllCoinsAsReal = (side: 'left' | 'right') => {
    const coins = side === 'left' ? leftPanCoins : rightPanCoins;
    coins.forEach(coinId => {
      if (!labeledRealCoins.includes(coinId) && labeledFakeCoin !== coinId) {
        onLabelCoin(coinId, 'real');
      }
    });
  };

  const markAllCoinsAsCandidate = (side: 'left' | 'right') => {
    const coins = side === 'left' ? leftPanCoins : rightPanCoins;
    coins.forEach(coinId => {
      if (!labeledCandidateCoins.includes(coinId) && labeledFakeCoin !== coinId && !labeledRealCoins.includes(coinId)) {
        onLabelCoin(coinId, 'candidate');
      }
    });
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center p-8 w-full max-w-3xl mx-auto">
      {hasWeighed && (
        <div className="flex justify-center gap-4 mb-4">
          {leftPanCoins.length > 0 && (
            <div className="flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-sm"
                  onClick={() => markAllCoinsAsReal('left')}
                  disabled={disabled}
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Mark Left Pan Real
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-sm border-amber-500 text-amber-700"
                  onClick={() => markAllCoinsAsCandidate('left')}
                  disabled={disabled}
                >
                  <Search className="h-3 w-3 mr-1" />
                  Mark Left Pan Candidate
                </Button>
              </motion.div>
            </div>
          )}
          
          {rightPanCoins.length > 0 && (
            <div className="flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-sm"
                  onClick={() => markAllCoinsAsReal('right')}
                  disabled={disabled}
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Mark Right Pan Real
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white shadow-sm border-amber-500 text-amber-700"
                  onClick={() => markAllCoinsAsCandidate('right')}
                  disabled={disabled}
                >
                  <Search className="h-3 w-3 mr-1" />
                  Mark Right Pan Candidate
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      )}
      
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-4 h-16 bg-gray-800 rounded-t-lg z-10"></div>
        
        <motion.div 
          className="scale-bar w-96 mb-4 relative"
          animate={{
            rotate: scaleState === 'balanced' ? 0 : scaleState === 'left-heavy' ? -10 : 10
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-20 bg-gray-700"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-20 bg-gray-700"></div>
        </motion.div>
        
        <div className="flex justify-between w-96">
          <motion.div
            className={cn(
              "scale-pan", 
              leftPanCoins.length > 0 && "bg-gray-300"
            )}
            animate={{
              y: scaleState === 'left-heavy' ? 20 : scaleState === 'right-heavy' ? -10 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop('left', e)}
          >
            <div className="flex flex-wrap gap-1 p-2 justify-center">
              {leftPanCoins.map(coinId => (
                <Coin
                  key={`left-${coinId}`}
                  id={coinId}
                  isFake={coinId === fakeCoinId}
                  isLabeledFake={labeledFakeCoin === coinId}
                  isLabeledReal={labeledRealCoins.includes(coinId)}
                  isLabeledCandidate={labeledCandidateCoins.includes(coinId)}
                  onDragStart={() => {}}
                  onLabelCoin={onLabelCoin}
                  onAddToScale={handleAddToScale}
                  disabled={disabled}
                />
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className={cn(
              "scale-pan", 
              rightPanCoins.length > 0 && "bg-gray-300"
            )}
            animate={{
              y: scaleState === 'right-heavy' ? 20 : scaleState === 'left-heavy' ? -10 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop('right', e)}
          >
            <div className="flex flex-wrap gap-1 p-2 justify-center">
              {rightPanCoins.map(coinId => (
                <Coin
                  key={`right-${coinId}`}
                  id={coinId}
                  isFake={coinId === fakeCoinId}
                  isLabeledFake={labeledFakeCoin === coinId}
                  isLabeledReal={labeledRealCoins.includes(coinId)}
                  isLabeledCandidate={labeledCandidateCoins.includes(coinId)}
                  onDragStart={() => {}}
                  onLabelCoin={onLabelCoin}
                  onAddToScale={handleAddToScale}
                  disabled={disabled}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.button
        className={cn(
          "glass-button mt-8",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={onWeigh}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        Weigh Coins
      </motion.button>
      
      {hasWeighed && (
        <motion.div 
          className="mt-4 text-center font-medium text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {scaleState === 'balanced' && "The pans are balanced."}
          {scaleState === 'left-heavy' && "The left pan is heavier."}
          {scaleState === 'right-heavy' && "The right pan is heavier."}
        </motion.div>
      )}
    </div>
  );
};

export default Scale;
