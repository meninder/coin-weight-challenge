
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScaleProps {
  leftPanCoins: number[];
  rightPanCoins: number[];
  fakeCoinId: number;
  onAddCoin: (side: 'left' | 'right', coinId: number) => void;
  onRemoveCoin: (side: 'left' | 'right', coinId: number) => void;
  onWeigh: () => void;
  disabled: boolean;
  hasWeighed: boolean;
}

const Scale: React.FC<ScaleProps> = ({
  leftPanCoins,
  rightPanCoins,
  fakeCoinId,
  onAddCoin,
  onRemoveCoin,
  onWeigh,
  disabled,
  hasWeighed
}) => {
  const [scaleState, setScaleState] = useState<'balanced' | 'left-heavy' | 'right-heavy'>('balanced');
  
  // Calculate the total weight - the fake coin weighs less
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
  
  return (
    <div className="relative flex flex-col items-center justify-center p-8 w-full max-w-3xl mx-auto">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Fulcrum */}
        <div className="w-4 h-16 bg-gray-800 rounded-t-lg z-10"></div>
        
        {/* Balance Beam */}
        <motion.div 
          className="scale-bar w-96 mb-4 relative"
          animate={{
            rotate: scaleState === 'balanced' ? 0 : scaleState === 'left-heavy' ? -10 : 10
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Left Pan Connection */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-20 bg-gray-700"></div>
          
          {/* Right Pan Connection */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-20 bg-gray-700"></div>
        </motion.div>
        
        <div className="flex justify-between w-96">
          {/* Left Pan */}
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
                <motion.div 
                  key={coinId} 
                  className="w-8 h-8 rounded-full bg-coin flex items-center justify-center cursor-pointer text-xs font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveCoin('left', coinId)}
                >
                  {coinId}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right Pan */}
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
                <motion.div 
                  key={coinId} 
                  className="w-8 h-8 rounded-full bg-coin flex items-center justify-center cursor-pointer text-xs font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveCoin('right', coinId)}
                >
                  {coinId}
                </motion.div>
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
