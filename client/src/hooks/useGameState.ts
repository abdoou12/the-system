import { useState, useEffect, useCallback } from "react";
import { GameState, UserState, TaskState, DailyEvent, SpinOutcome } from "@/types/game";
import { 
  calculateLevelUp, 
  calculateTaskRewards, 
  calculatePerfectDayBonus,
  calculateHPLoss,
  getUserRank,
  getUserTitle,
  isSpinAvailable,
  canSubmitDay,
  updateStreak,
  checkAchievements,
  saveGameState,
  loadGameState,
  calculateXPToNextLevel
} from "@/lib/gameLogic";
import { DEFAULT_TASKS, DAILY_EVENTS, SPIN_OUTCOMES } from "@/lib/gameData";

const createInitialGameState = (): GameState => ({
  user: {
    id: 1,
    username: "Hunter",
    level: 15,
    currentXP: 2840,
    currentHP: 85,
    maxHP: 100,
    gold: 1250,
    attributePoints: 3,
    stats: {
      str: 24,
      int: 31,
      kno: 28,
      wis: 22,
      endu: 26,
      faith: 19
    },
    title: "Shadow Hunter",
    rank: "Silver",
    lastDaySubmitted: null,
    currentStreak: 7,
    lastSpinDate: null
  },
  tasks: DEFAULT_TASKS.map((task, index) => ({
    id: index + 1,
    ...task,
    isCompleted: [true, false, true, true, false, true, false, false][index] || false,
    completedDate: null
  })),
  achievements: [
    {
      id: 1,
      name: "Level 15 Reached!",
      description: "Keep climbing, Hunter!",
      icon: "🏆",
      unlockedAt: new Date()
    },
    {
      id: 2,
      name: "7-Day Streak",
      description: "Consistency is key",
      icon: "🔥",
      unlockedAt: new Date()
    },
    {
      id: 3,
      name: "Sloth Slayer",
      description: "Defeated inner demon",
      icon: "⚔️",
      unlockedAt: new Date()
    }
  ],
  events: [],
  dailyEvent: {
    type: 'blessing',
    name: 'Blessing of Focus',
    description: '+25% XP gain from INT tasks today',
    effect: 'int_xp_boost',
    icon: '🧠'
  },
  activeBoss: {
    id: 'morgo_sloth',
    name: 'Morgo, the Sloth Demon',
    description: 'Defeat this inner demon by completing early morning tasks!',
    objectives: [
      { id: 'wake_early', description: 'Wake up before 6 AM', completed: true },
      { id: 'no_snooze', description: 'No snooze button', completed: true },
      { id: 'morning_workout', description: 'Complete morning workout', completed: false }
    ],
    timeLimit: 24,
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    rewards: {
      xp: 500,
      gold: 200,
      title: 'Sloth Slayer'
    },
    penalties: {
      hpLoss: 50,
      goldLoss: 100,
      restrictions: ['No entertainment for 24h']
    }
  },
  modals: {
    levelUp: false,
    shop: false,
    journal: false,
    dailySpin: false
  }
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || createInitialGameState();
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const addSystemEvent = useCallback((message: string, type: string = 'info') => {
    const event = {
      id: Date.now(),
      message,
      type,
      createdAt: new Date()
    };
    
    setGameState(prev => ({
      ...prev,
      events: [event, ...prev.events.slice(0, 9)] // Keep only last 10 events
    }));
  }, []);

  const toggleTask = useCallback((taskId: number) => {
    setGameState(prev => {
      const tasks = prev.tasks.map(task => {
        if (task.id === taskId) {
          const completed = !task.isCompleted;
          const completedDate = completed ? new Date().toISOString() : null;
          
          if (completed) {
            const rewards = calculateTaskRewards(task, prev.dailyEvent?.effect === 'int_xp_boost' && task.statRewards.int ? 1.25 : 1);
            addSystemEvent(`Task completed: ${task.name} (+${rewards.xp} XP, +Stats)`, 'task_complete');
          }
          
          return {
            ...task,
            isCompleted: completed,
            completedDate
          };
        }
        return task;
      });
      
      return { ...prev, tasks };
    });
  }, [addSystemEvent]);

  const submitDay = useCallback(() => {
    if (!canSubmitDay(gameState.user.lastDaySubmitted)) {
      addSystemEvent("Day already submitted today!", 'error');
      return;
    }

    setGameState(prev => {
      const completedTasks = prev.tasks.filter(t => t.isCompleted);
      const missedTasks = prev.tasks.filter(t => !t.isCompleted);
      
      // Calculate rewards
      let totalXP = 0;
      let newStats = { ...prev.user.stats };
      
      completedTasks.forEach(task => {
        const rewards = calculateTaskRewards(task, prev.dailyEvent?.effect === 'int_xp_boost' && task.statRewards.int ? 1.25 : 1);
        totalXP += rewards.xp;
        
        Object.entries(rewards.stats).forEach(([stat, value]) => {
          if (value && stat in newStats) {
            (newStats as any)[stat] += value;
          }
        });
      });
      
      // Perfect day bonus
      const perfectDayBonus = calculatePerfectDayBonus(prev.tasks);
      totalXP += perfectDayBonus.xpBonus;
      
      // HP loss from missed tasks
      const hpLoss = calculateHPLoss(missedTasks, prev.dailyEvent?.effect === 'hp_penalty' ? 1.2 : 1);
      
      // Level up calculation
      const newXP = prev.user.currentXP + totalXP;
      const levelUpResult = calculateLevelUp(newXP, prev.user.level);
      
      // Update streak
      const newStreak = updateStreak(prev.user.lastDaySubmitted, prev.user.currentStreak);
      
      const updatedUser: UserState = {
        ...prev.user,
        level: levelUpResult.newLevel,
        currentXP: newXP - (levelUpResult.newLevel > prev.user.level ? calculateXPToNextLevel(levelUpResult.newLevel - 1) : 0),
        currentHP: Math.max(0, prev.user.currentHP - hpLoss),
        maxHP: prev.user.maxHP + levelUpResult.hpIncrease,
        gold: prev.user.gold + perfectDayBonus.goldBonus + levelUpResult.goldReward,
        attributePoints: prev.user.attributePoints + levelUpResult.attributePoints,
        stats: newStats,
        title: getUserTitle(levelUpResult.newLevel),
        rank: getUserRank(levelUpResult.newLevel),
        lastDaySubmitted: new Date().toISOString(),
        currentStreak: newStreak
      };

      const newState = {
        ...prev,
        user: updatedUser,
        modals: {
          ...prev.modals,
          levelUp: levelUpResult.newLevel > prev.user.level
        }
      };

      // Add system events
      if (perfectDayBonus.goldBonus > 0) {
        addSystemEvent(`Perfect Day bonus: +${perfectDayBonus.goldBonus} Gold`, 'reward');
      }
      if (levelUpResult.newLevel > prev.user.level) {
        addSystemEvent(`LEVEL UP! Reached Level ${levelUpResult.newLevel}!`, 'level_up');
      }
      if (hpLoss > 0) {
        addSystemEvent(`HP lost from missed tasks: -${hpLoss} HP`, 'penalty');
      }
      
      addSystemEvent('Day submitted successfully!', 'success');
      
      return newState;
    });
  }, [gameState.user.lastDaySubmitted, addSystemEvent]);

  const performDailySpin = useCallback(() => {
    if (!isSpinAvailable(gameState.user.lastSpinDate)) {
      addSystemEvent("Daily spin already used today!", 'error');
      return null;
    }

    const outcome = SPIN_OUTCOMES[Math.floor(Math.random() * SPIN_OUTCOMES.length)];
    
    setGameState(prev => {
      let updatedUser = { ...prev.user, lastSpinDate: new Date().toISOString() };
      let updatedDailyEvent = prev.dailyEvent;
      
      if (outcome.type === 'gold' && outcome.value) {
        updatedUser.gold += outcome.value as number;
      } else if (outcome.type === 'xp' && outcome.value) {
        updatedUser.currentXP += outcome.value as number;
      } else if (outcome.type === 'blessing') {
        updatedDailyEvent = DAILY_EVENTS.find(e => e.type === 'blessing') || prev.dailyEvent;
      } else if (outcome.type === 'curse') {
        updatedDailyEvent = DAILY_EVENTS.find(e => e.type === 'curse') || prev.dailyEvent;
      }
      
      addSystemEvent(`Daily Spin: ${outcome.message}`, 'spin');
      
      return {
        ...prev,
        user: updatedUser,
        dailyEvent: updatedDailyEvent
      };
    });
    
    return outcome;
  }, [gameState.user.lastSpinDate, addSystemEvent]);

  const openModal = useCallback((modal: keyof GameState['modals']) => {
    setGameState(prev => ({
      ...prev,
      modals: { ...prev.modals, [modal]: true }
    }));
  }, []);

  const closeModal = useCallback((modal: keyof GameState['modals']) => {
    setGameState(prev => ({
      ...prev,
      modals: { ...prev.modals, [modal]: false }
    }));
  }, []);

  const spendAttributePoint = useCallback((attribute: keyof UserState['stats']) => {
    setGameState(prev => {
      if (prev.user.attributePoints <= 0) return prev;
      
      const newStats = { ...prev.user.stats };
      newStats[attribute] += 1;
      
      addSystemEvent(`Attribute point spent: +1 ${attribute.toUpperCase()}`, 'attribute');
      
      return {
        ...prev,
        user: {
          ...prev.user,
          attributePoints: prev.user.attributePoints - 1,
          stats: newStats
        }
      };
    });
  }, [addSystemEvent]);

  return {
    gameState,
    toggleTask,
    submitDay,
    performDailySpin,
    openModal,
    closeModal,
    spendAttributePoint,
    addSystemEvent
  };
};
