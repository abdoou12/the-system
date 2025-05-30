import { BossChallenge } from "@/types/game";

interface ActiveChallengesProps {
  activeBoss: BossChallenge | null;
}

export const ActiveChallenges = ({ activeBoss }: ActiveChallengesProps) => {
  if (!activeBoss) {
    return (
      <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-primary-light/30 p-6">
        <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center">
          <i className="fas fa-dragon mr-3 text-health"></i>
          Active Challenge
        </h3>
        <div className="text-center text-gray-400 py-8">
          <i className="fas fa-peace text-4xl mb-4 text-gray-600"></i>
          <p>No active challenges at the moment.</p>
          <p className="text-sm mt-2">Demons may appear if you neglect your habits...</p>
        </div>
      </div>
    );
  }

  const timeRemaining = () => {
    const endTime = new Date(activeBoss.startTime.getTime() + activeBoss.timeLimit * 60 * 60 * 1000);
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Time's up!";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const completedObjectives = activeBoss.objectives.filter(obj => obj.completed).length;
  const totalObjectives = activeBoss.objectives.length;
  const progress = (completedObjectives / totalObjectives) * 100;

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-health/30 p-6">
      <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center">
        <i className="fas fa-dragon mr-3 text-health"></i>
        Active Challenge
      </h3>
      
      <div className="bg-health/20 border border-health/40 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-health text-lg">{activeBoss.name}</h4>
          <div className="text-sm text-gray-300">
            <i className="fas fa-clock mr-1"></i>
            <span>{timeRemaining()}</span>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-4">{activeBoss.description}</p>
        
        <div className="space-y-2">
          {activeBoss.objectives.map(objective => (
            <div key={objective.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{objective.description}</span>
              <i className={`fas ${objective.completed ? 'fa-check text-success' : 'fa-times text-health'}`}></i>
            </div>
          ))}
        </div>
        
        <div className="mt-4 bg-dark/50 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Defeat Progress</div>
          <div className="w-full bg-dark rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-health to-secondary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {completedObjectives}/{totalObjectives} objectives complete
          </div>
        </div>
      </div>
    </div>
  );
};
