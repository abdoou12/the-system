import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SHOP_ITEMS } from "@/lib/gameData";
import { ShopItem } from "@/types/game";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGold: number;
  onPurchase: (item: ShopItem) => void;
}

export const ShopModal = ({ isOpen, onClose, userGold, onPurchase }: ShopModalProps) => {
  const getItemTypeColor = (type: ShopItem['type']) => {
    switch (type) {
      case 'consumable':
        return 'bg-green-600/20 text-green-400 border-green-400/50';
      case 'permission':
        return 'bg-blue-600/20 text-blue-400 border-blue-400/50';
      case 'special':
        return 'bg-purple-600/20 text-purple-400 border-purple-400/50';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-400/50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-light border border-primary-light/30 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-white flex items-center">
            <i className="fas fa-store mr-3 text-accent"></i>
            Hunter's Emporium
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-secondary/20 rounded-lg">
          <div className="flex items-center justify-center">
            <i className="fas fa-coins text-secondary mr-2"></i>
            <span className="text-white font-semibold">Your Gold: {userGold.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid gap-4">
          {SHOP_ITEMS.map(item => (
            <div key={item.id} className="bg-primary/30 border border-primary-light/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <Badge className={getItemTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-coins text-secondary"></i>
                  <span className="text-secondary font-bold">{item.price} Gold</span>
                </div>
                <Button
                  onClick={() => onPurchase(item)}
                  disabled={userGold < item.price}
                  className="bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Purchase
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
