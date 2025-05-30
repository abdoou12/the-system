import { TaskState } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface DailyTasksProps {
  tasks: TaskState[];
  onToggleTask: (taskId: number) => void;
  onSubmitDay: () => void;
}

export const DailyTasks = ({ tasks, onToggleTask, onSubmitDay }: DailyTasksProps) => {
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  
  const tier1Tasks = tasks.filter(t => t.tier === 1);
  const tier2Tasks = tasks.filter(t => t.tier === 2);
  const tier3Tasks = tasks.filter(t => t.tier === 3);

  const renderTierTasks = (tierTasks: TaskState[], tierName: string, tierColor: string, tierIcon: string) => (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold ${tierColor} mb-3 flex items-center`}>
        <i className={`${tierIcon} mr-2`}></i>
        {tierName}
      </h3>
      <div className="space-y-3">
        {tierTasks.map(task => (
          <div 
            key={task.id}
            className={`bg-primary/${tierName === 'Tier 1 - Essential' ? '40' : tierName === 'Tier 2 - Important' ? '30' : '20'} rounded-lg p-4 border ${tierColor.replace('text-', 'border-')}/30 hover:${tierColor.replace('text-', 'border-')}/60 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={() => onToggleTask(task.id)}
                  className={`w-5 h-5 ${tierColor.replace('text-', 'text-')} bg-dark ${tierColor.replace('text-', 'border-')}/50 rounded focus:ring-2`}
                />
                <div>
                  <p className={`font-medium text-white ${task.isCompleted ? 'line-through' : ''}`}>
                    {task.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {Object.entries(task.statRewards).map(([stat, value]) => 
                      value ? `+${value} ${stat.toUpperCase()}` : null
                    ).filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`${tierColor} font-semibold`}>{task.xpReward} XP</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-primary-light/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-orbitron font-bold text-white flex items-center">
          <i className="fas fa-tasks mr-3 text-accent"></i>
          Daily Tasks
        </h2>
        <div className="text-sm text-gray-400">
          {completedTasks}/{totalTasks} Complete
        </div>
      </div>

      {renderTierTasks(tier1Tasks, "Tier 1 - Essential", "text-secondary", "fas fa-star")}
      {renderTierTasks(tier2Tasks, "Tier 2 - Important", "text-accent", "fas fa-gem")}
      {renderTierTasks(tier3Tasks, "Tier 3 - Optional", "text-purple-400", "fas fa-magic")}

      <div className="mt-8">
        <Button 
          onClick={onSubmitDay}
          className="w-full bg-gradient-to-r from-secondary to-primary-light hover:from-secondary/80 hover:to-primary-light/80 text-dark font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 font-orbitron text-lg"
        >
          <i className="fas fa-check-circle mr-2"></i>
          Submit Day
        </Button>
      </div>
    </div>
  );
};
