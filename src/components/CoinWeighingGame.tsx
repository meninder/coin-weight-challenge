
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Coin from './Coin';
import Scale from './Scale';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Crown, RefreshCw, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const CoinWeighingGame: React.FC = () => {
  const [fakeCoinId, setFakeCoinId] = useState<number>(-1);
  const [coins, setCoins] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [leftPanCoins, setLeftPanCoins] = useState<number[]>([]);
  const [rightPanCoins, setRightPanCoins] = useState<number[]>([]);
  const [weighCount, setWeighCount] = useState<number>(0);
  const [hasWeighed, setHasWeighed] = useState<boolean>(false);
  const [labeledFakeCoin, setLabeledFakeCoin] = useState<number | null>(null);
  const [labeledRealCoins, setLabeledRealCoins] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
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
    setLabeledRealCoins([]);
    setGameComplete(false);
    setShowResult(false);
    setIsCorrect(false);
    console.log(`New game: Fake coin is ${randomFakeCoin}`);
  };
  
  // This is kept for compatibility with the Coin component
  const handleDragStart = (id: number) => {
    // Do nothing for now as we're not using drag and drop
  };
  
  const handleAddToScale = (coinId: number, side: 'left' | 'right') => {
    if (hasWeighed) {
      setHasWeighed(false);
    }
    
    // Remove the coin from its current location
    setCoins(coins.filter(id => id !== coinId));
    setLeftPanCoins(leftPanCoins.filter(id => id !== coinId));
    setRightPanCoins(rightPanCoins.filter(id => id !== coinId));
    
    // Add the coin to the specified pan
    if (side === 'left') {
      setLeftPanCoins(prev => [...prev, coinId]);
    } else {
      setRightPanCoins(prev => [...prev, coinId]);
    }
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
      return;
    }
    
    setWeighCount(weighCount + 1);
    setHasWeighed(true);
  };
  
  const handleLabelCoin = (id: number, label: 'fake' | 'real' | null) => {
    if (label === 'fake') {
      if (labeledFakeCoin === id) {
        setLabeledFakeCoin(null);
      } else {
        setLabeledFakeCoin(id);
        
        // Remove from real coins if it was previously labeled as real
        setLabeledRealCoins(prev => prev.filter(coinId => coinId !== id));
      }
    } else if (label === 'real') {
      if (labeledRealCoins.includes(id)) {
        // Remove the real label
        setLabeledRealCoins(prev => prev.filter(coinId => coinId !== id));
      } else {
        // Add the real label
        setLabeledRealCoins(prev => [...prev, id]);
        
        // Remove fake label if it was previously labeled as fake
        if (labeledFakeCoin === id) {
          setLabeledFakeCoin(null);
        }
      }
    }
  };
  
  const handleSubmitAnswer = () => {
    if (labeledFakeCoin === null) {
      return;
    }
    
    const correct = labeledFakeCoin === fakeCoinId;
    setIsCorrect(correct);
    setShowResult(true);
    setGameComplete(true);
  };
  
  const handleReset = () => {
    resetGame();
  };
  
  // New function to reset the scale without resetting the whole game
  const handleResetScale = () => {
    // Move all coins from scale back to the main area
    const allScaleCoins = [...leftPanCoins, ...rightPanCoins];
    setCoins([...coins, ...allScaleCoins].sort((a, b) => a - b));
    setLeftPanCoins([]);
    setRightPanCoins([]);
    setHasWeighed(false);
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
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Again
            </Button>
          </motion.div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-4 rounded-lg mb-4">
          <div className="flex justify-center gap-2 items-center mb-2">
            <motion.div
              className="px-4 py-2 bg-white rounded-full shadow-sm flex items-center"
            >
              <span className="font-medium text-gray-600 mr-2">Weighs Used:</span>
              <span className="font-bold text-blue-600">
                {weighCount}
              </span>
            </motion.div>
            
            {gameComplete && !showResult && (
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
            disabled={gameComplete}
            hasWeighed={hasWeighed}
            onLabelCoin={handleLabelCoin}
            labeledFakeCoin={labeledFakeCoin}
            labeledRealCoins={labeledRealCoins}
          />
          
          {/* Add Reset Scale button below the scale */}
          {(leftPanCoins.length > 0 || rightPanCoins.length > 0) && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetScale}
                disabled={gameComplete}
                className="bg-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Scale
              </Button>
            </div>
          )}
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
              isLabeledReal={labeledRealCoins.includes(id)}
              onDragStart={handleDragStart}
              onLabelCoin={handleLabelCoin}
              onAddToScale={handleAddToScale}
              disabled={gameComplete}
            />
          ))}
          
          {leftPanCoins.length === 0 && rightPanCoins.length === 0 && coins.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              All coins are on the scale. Remove some to label them.
            </div>
          )}
        </motion.div>
        
        {!gameComplete && labeledFakeCoin !== null && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={handleSubmitAnswer} 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Answer
            </Button>
          </motion.div>
        )}
        
        {gameComplete && !showResult && (
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
      
      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={isCorrect ? "text-green-600" : "text-red-600"}>
              {isCorrect ? "Congratulations!" : "Incorrect Answer"}
            </DialogTitle>
            <DialogDescription>
              {isCorrect 
                ? `You correctly identified Coin ${fakeCoinId} as the fake coin in ${weighCount} weighs!` 
                : `Sorry, Coin ${labeledFakeCoin} is not the fake coin. The fake coin was Coin ${fakeCoinId}.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={() => {
                setShowResult(false);
                resetGame();
              }}
              className={isCorrect 
                ? "bg-gradient-to-r from-green-500 to-blue-500" 
                : "bg-gradient-to-r from-red-500 to-blue-500"
              }
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoinWeighingGame;
