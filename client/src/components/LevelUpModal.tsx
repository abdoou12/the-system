import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  attributePoints: number;
  hpIncrease: number;
  goldReward: number;
}

export const LevelUpModal = ({ isOpen, onClose, newLevel, attributePoints, hpIncrease, goldReward }: LevelUpModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-primary to-dark-light border-2 border-secondary rounded-xl p-8 text-center animate-float max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-orbitron font-bold text-secondary mb-4">LEVEL UP!</h2>
        <p className="text-xl text-white mb-6">You reached Level <span className="text-accent font-bold">{newLevel}</span>!</p>
        
        <div className="flex justify-center space-x-8 mb-6">
          <div>
            <div className="text-secondary font-bold">+{attributePoints}</div>
            <div className="text-sm text-gray-400">Attribute Points</div>
          </div>
          <div>
            <div className="text-health font-bold">+{hpIncrease}</div>
            <div className="text-sm text-gray-400">Max HP</div>
          </div>
          <div>
            <div className="text-secondary font-bold">+{goldReward}</div>
            <div className="text-sm text-gray-400">Gold</div>
          </div>
        </div>
        
        <Button 
          onClick={onClose}
          className="bg-gradient-to-r from-secondary to-primary-light text-dark font-bold py-3 px-8 rounded-lg hover:scale-105 transition-all"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};
