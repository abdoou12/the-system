import { Achievement } from "@/types/game";
import { Button } from "@/components/ui/button";

interface AchievementsProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

export const Achievements = ({ achievements, onViewAll }: AchievementsProps) => {
  const recentAchievements = achievements.slice(0, 3);

  const getAchievementColor = (name: string) => {
    if (name.includes("Level")) return "bg-secondary/20 border-secondary/40 text-secondary";
    if (name.includes("Streak")) return "bg-purple-600/20 border-purple-400/40 text-purple-400";
    return "bg-green-600/20 border-green-400/40 text-green-400";
  };

  const getAchievementIcon = (name: string) => {
    if (name.includes("Level")) return "fas fa-medal";
    if (name.includes("Streak")) return "fas fa-fire";
    if (name.includes("Slayer")) return "fas fa-sword";
    return "fas fa-trophy";
  };

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-primary-light/30 p-6">
      <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center">
        <i className="fas fa-trophy mr-3 text-secondary"></i>
        Recent Achievements
      </h3>
      
      <div className="space-y-3">
        {recentAchievements.map((achievement, index) => (
          <div 
            key={achievement.id}
            className={`${getAchievementColor(achievement.name)} rounded-lg p-3 ${index === 0 ? 'animate-glow' : ''}`}
          >
            <div className="flex items-center">
              <i className={`${getAchievementIcon(achievement.name)} mr-3`}></i>
              <div>
                <p className="font-semibold text-sm">{achievement.name}</p>
                <p className="text-xs opacity-75">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={onViewAll}
        variant="outline"
        className="w-full mt-4 bg-primary/40 hover:bg-primary/60 text-gray-300 border border-primary-light/30 py-2 px-4 rounded-lg transition-all text-sm"
      >
        View All Achievements
      </Button>
    </div>
  );
};
