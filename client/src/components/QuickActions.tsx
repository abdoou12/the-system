import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onOpenShop: () => void;
  onOpenJournal: () => void;
  onOpenHistory: () => void;
  onOpenDungeon: () => void;
}

export const QuickActions = ({ onOpenShop, onOpenJournal, onOpenHistory, onOpenDungeon }: QuickActionsProps) => {
  const actions = [
    {
      label: "Shop",
      icon: "fas fa-store",
      color: "bg-accent/20 hover:bg-accent/30 text-accent border-accent/50",
      onClick: onOpenShop
    },
    {
      label: "Journal", 
      icon: "fas fa-book",
      color: "bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border-purple-400/50",
      onClick: onOpenJournal
    },
    {
      label: "History",
      icon: "fas fa-history", 
      color: "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-400/50",
      onClick: onOpenHistory
    },
    {
      label: "Dungeon",
      icon: "fas fa-dungeon",
      color: "bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-400/50", 
      onClick: onOpenDungeon
    }
  ];

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-primary-light/30 p-6">
      <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center">
        <i className="fas fa-bolt mr-3 text-accent"></i>
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => (
          <Button
            key={action.label}
            onClick={action.onClick}
            className={`${action.color} border py-3 px-4 rounded-lg transition-all text-sm font-medium flex flex-col items-center space-y-1`}
          >
            <i className={`${action.icon} text-lg`}></i>
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
