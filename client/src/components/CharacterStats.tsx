import { UserState } from "@/types/game";
import { Button } from "@/components/ui/button";
import { calculateXPToNextLevel } from "@/lib/gameLogic";

interface CharacterStatsProps {
  user: UserState;
  onAllocateAttributes: () => void;
  onSpendAttributePoint: (attribute: keyof UserState['stats']) => void;
}

export const CharacterStats = ({ user, onAllocateAttributes, onSpendAttributePoint }: CharacterStatsProps) => {
  const nextLevelXP = calculateXPToNextLevel(user.level);
  const xpProgress = (user.currentXP / nextLevelXP) * 100;
  const hpProgress = (user.currentHP / user.maxHP) * 100;

  const statIcons = {
    str: "fas fa-dumbbell text-red-400",
    int: "fas fa-brain text-blue-400", 
    kno: "fas fa-book text-green-400",
    wis: "fas fa-eye text-purple-400",
    endu: "fas fa-shield text-yellow-400",
    faith: "fas fa-dove text-indigo-400"
  };

  const statColors = {
    str: "text-red-400",
    int: "text-blue-400",
    kno: "text-green-400", 
    wis: "text-purple-400",
    endu: "text-yellow-400",
    faith: "text-indigo-400"
  };

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-primary-light/30 p-6">
      <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center">
        <i className="fas fa-user-ninja mr-3 text-accent"></i>
        Hunter Status
      </h3>
      
      {/* Level & XP */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Level <span className="text-accent font-bold">{user.level}</span></span>
          <span className="text-sm text-gray-400">{user.currentXP}/{nextLevelXP} XP</span>
        </div>
        <div className="w-full bg-dark rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-xp to-accent h-3 rounded-full animate-pulse-slow transition-all duration-500" 
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Health */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 flex items-center">
            <i className="fas fa-heart text-health mr-2"></i>
            Health
          </span>
          <span className="text-sm text-gray-400">{user.currentHP}/{user.maxHP} HP</span>
        </div>
        <div className="w-full bg-dark rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-health to-red-400 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${hpProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-3">
        {Object.entries(user.stats).map(([stat, value]) => (
          <div key={stat} className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center">
              <i className={`${statIcons[stat as keyof typeof statIcons]} mr-2 w-4`}></i>
              {stat.toUpperCase()}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${statColors[stat as keyof typeof statColors]}`}>
                {value}
              </span>
              {user.attributePoints > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSpendAttributePoint(stat as keyof UserState['stats'])}
                  className="w-6 h-6 p-0 text-xs bg-secondary/20 border-secondary/50 hover:bg-secondary/30"
                >
                  +
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Available Attribute Points */}
      {user.attributePoints > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Attribute Points</span>
            <span className="font-bold text-secondary">{user.attributePoints}</span>
          </div>
          <Button 
            onClick={onAllocateAttributes}
            className="w-full mt-2 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 py-2 px-4 rounded-lg transition-all text-sm"
          >
            Allocate Points
          </Button>
        </div>
      )}
    </div>
  );
};
