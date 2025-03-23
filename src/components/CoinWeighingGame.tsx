
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Coin from './Coin';
import Scale from './Scale';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Info, RotateCcw, Crown } from 'lucide-react';

const CoinWeighingGame: React.FC = () => {
  const [fakeCoinId, setFakeCoinId] = useState<number>(-1);
  const [coins, setCoins] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [leftPanCoins, setLeftPanCoins] = useState<number[]>([]);
  const [rightPanCoins, setRightPanCoins] = useState<number[]>([]);
  const [weighCount, setWeighCount] = useState<number>(0);
  const [hasWeighed, setHasWeighed] = useState<boolean>(false);
  const [labeledFakeCoin, setLabeledFakeCoin] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  
  const { toast } = useToast();
  
  // Initialize game with random fake coin
  useEffect(() => {
    resetGame();
  }, []);
  
  const resetGame = () => {
    const randomFakeCoin = Math.floor(Math.random() * 9) + 1;
    setFakeCoinId(randomFakeCoin);
    setCoins([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    setLeftPanCoins([]);
    setRightPanCoins([]);
    setWeighCount(0);
    setHasWeighed(false);
    setLabeledFakeCoin(null);
    setGameComplete(false);
    console.log(`New game: Fake coin is ${randomFakeCoin}`);
  };
  
  const handleDragStart = (id: number) => {
    // Remove the coin from its current location
    setCoins(coins.filter(coinId => coinId !== id));
    setLeftPanCoins(leftPanCoins.filter(coinId => coinId !== id));
    setRightPanCoins(rightPanCoins.filter(coinId => coinId !== id));
  };
  
  const handleAddCoin = (side: 'left' | 'right', coinId: number) => {
    if (hasWeighed) {
      setHasWeighed(false);
    }
    
    if (side === 'left') {
      setLeftPanCoins([...leftPanCoins, coinId]);
    } else {
      setRightPanCoins([...rightPanCoins, coinId]);
    }
  };
  
  const handleRemoveCoin = (side: 'left' | 'right', coinId: number) => {
    if (hasWeighed) {
      setHasWeighed(false);
    }
    
    if (side === 'left') {
      setLeftPanCoins(leftPanCoins.filter(id => id !== coinId));
    } else {
      setRightPanCoins(rightPanCoins.filter(id => id !== coinId));
    }
    
    setCoins([...coins, coinId].sort((a, b) => a - b));
  };
  
  const handleWeigh = () => {
    if (leftPanCoins.length === 0 || rightPanCoins.length === 0) {
      toast({
        title: "Cannot weigh",
        description: "Place at least one coin on each side of the scale.",
        variant: "destructive",
      });
      return;
    }
    
    if (weighCount >= 2) {
      toast({
        title: "Maximum weighs reached",
        description: "You can only use the scale twice. Try labeling the fake coin now.",
        variant: "destructive",
      });
      return;
    }
    
    setWeighCount(weighCount + 1);
    setHasWeighed(true);
    
    toast({
      title: "Scale used",
      description: `You have ${2 - (weighCount + 1)} weighing${2 - (weighCount + 1) !== 1 ? 's' : ''} left.`,
    });
  };
  
  const handleLabelCoin = (id: number) => {
    if (labeledFakeCoin === id) {
      setLabeledFakeCoin(null);
    } else {
      setLabeledFakeCoin(id);
      
      if (id === fakeCoinId) {
        setGameComplete(true);
        toast({
          title: "Congratulations!",
          description: "You found the fake coin correctly!",
          variant: "default",
        });
      } else {
        toast({
          title: "Try Again",
          description: "That's not the fake coin. Keep trying!",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleReset = () => {
    resetGame();
    toast({
      title: "Game Reset",
      description: "A new fake coin has been chosen.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div 
        className="glass-panel w-full max-w-4xl p-6 sm:p-8 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Find the Fake Coin
          </motion.h1>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <Info className="h-4 w-4 mr-2" />
              Help
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {showInstructions && (
            <motion.div 
              className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold mb-2">Instructions:</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>There are 9 coins, and one is fake (lighter than the others).</li>
                <li>Drag coins onto either side of the scale to weigh them.</li>
                <li>You can only use the scale twice to find the fake coin.</li>
                <li>Click on a coin and select the "!" button to label it as fake.</li>
                <li>To complete the puzzle, you must correctly identify the fake coin.</li>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-4 rounded-lg mb-4">
          <div className="flex justify-center gap-2 items-center mb-2">
            <motion.div
              className="px-4 py-2 bg-white rounded-full shadow-sm flex items-center"
              animate={{ scale: weighCount === 2 ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: weighCount === 2 ? Infinity : 0, duration: 2 }}
            >
              <span className="font-medium text-gray-600 mr-2">Weighs Used:</span>
              <span className={`font-bold ${weighCount === 2 ? 'text-red-500' : 'text-blue-600'}`}>
                {weighCount}/2
              </span>
            </motion.div>
            
            {gameComplete && (
              <motion.div
                className="px-4 py-2 bg-green-100 text-green-800 rounded-full shadow-sm flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="font-bold">Puzzle Solved!</span>
              </motion.div>
            )}
          </div>
          
          <Scale 
            leftPanCoins={leftPanCoins}
            rightPanCoins={rightPanCoins}
            fakeCoinId={fakeCoinId}
            onAddCoin={handleAddCoin}
            onRemoveCoin={handleRemoveCoin}
            onWeigh={handleWeigh}
            disabled={weighCount >= 2 || gameComplete}
            hasWeighed={hasWeighed}
          />
        </div>
        
        <Separator className="my-4" />
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-4"
          layout
        >
          {coins.map(id => (
            <Coin 
              key={id}
              id={id}
              isFake={id === fakeCoinId}
              isLabeledFake={labeledFakeCoin === id}
              onDragStart={handleDragStart}
              onLabelCoin={handleLabelCoin}
              disabled={gameComplete}
            />
          ))}
          
          {leftPanCoins.length === 0 && rightPanCoins.length === 0 && coins.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              All coins are on the scale. Remove some to label them.
            </div>
          )}
        </motion.div>
        
        {gameComplete && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button onClick={handleReset} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              Play Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CoinWeighingGame;
