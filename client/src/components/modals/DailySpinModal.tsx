import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SpinOutcome } from "@/types/game";

interface DailySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpin: () => SpinOutcome | null;
}

export const DailySpinModal = ({ isOpen, onClose, onSpin }: DailySpinModalProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinOutcome | null>(null);

  const handleSpin = () => {
    setIsSpinning(true);
    
    // Simulate spinning animation
    setTimeout(() => {
      const outcome = onSpin();
      setResult(outcome);
      setIsSpinning(false);
    }, 2000);
  };

  const handleClose = () => {
    setResult(null);
    setIsSpinning(false);
    onClose();
  };

  const getResultColor = (type: SpinOutcome['type']) => {
    switch (type) {
      case 'gold':
        return 'text-secondary';
      case 'xp':
        return 'text-blue-400';
      case 'blessing':
        return 'text-green-400';
      case 'curse':
        return 'text-red-400';
      case 'item':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getResultIcon = (type: SpinOutcome['type']) => {
    switch (type) {
      case 'gold':
        return 'fas fa-coins';
      case 'xp':
        return 'fas fa-star';
      case 'blessing':
        return 'fas fa-leaf';
      case 'curse':
        return 'fas fa-skull';
      case 'item':
        return 'fas fa-gift';
      default:
        return 'fas fa-meh';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-light border border-primary-light/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-white flex items-center justify-center">
            <i className="fas fa-dice mr-3 text-secondary"></i>
            Wheel of Fate
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Spinning Wheel */}
          <div className="flex justify-center">
            <div className={`w-32 h-32 border-4 border-secondary rounded-full flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
              <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary-light rounded-full flex items-center justify-center">
                <i className="fas fa-dice text-3xl text-white"></i>
              </div>
            </div>
          </div>

          {/* Result Display */}
          {result && !isSpinning && (
            <div className="text-center space-y-4">
              <div className={`text-4xl ${getResultColor(result.type)}`}>
                <i className={getResultIcon(result.type)}></i>
              </div>
              <div>
                <h3 className={`text-xl font-bold ${getResultColor(result.type)}`}>
                  {result.message}
                </h3>
                {result.type === 'item' && result.item && (
                  <p className="text-gray-400 text-sm mt-2">
                    {result.item.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Spinning State */}
          {isSpinning && (
            <div className="text-center">
              <h3 className="text-xl text-white font-bold">Spinning...</h3>
              <p className="text-gray-400">The fates are deciding...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            {!result && !isSpinning && (
              <Button
                onClick={handleSpin}
                className="bg-gradient-to-r from-secondary to-primary-light text-dark font-bold py-3 px-8 rounded-lg hover:scale-105 transition-all"
              >
                Spin the Wheel!
              </Button>
            )}
            
            {result && !isSpinning && (
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-accent to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition-all"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
