import { UserState, TaskState, GameState } from "@/types/game";
import { XP_FORMULA, RANKS, TITLES } from "./gameData";

export const calculateXPToNextLevel = (level: number): number => {
  return XP_FORMULA(level + 1);
};

export const calculateLevelUp = (currentXP: number, currentLevel: number): { newLevel: number; attributePoints: number; goldReward: number; hpIncrease: number } => {
  let level = currentLevel;
  let attributePoints = 0;
  let goldReward = 0;
  let hpIncrease = 0;
  
  while (currentXP >= calculateXPToNextLevel(level)) {
    currentXP -= calculateXPToNextLevel(level);
    level++;
    attributePoints += 3;
    goldReward += 25;
    hpIncrease += 10;
  }
  
  return { newLevel: level, attributePoints, goldReward, hpIncrease };
};

export const getUserRank = (level: number): string => {
  const rank = RANKS.slice().reverse().find(r => level >= r.minLevel);
  return rank ? rank.name : "Bronze";
};

export const getUserTitle = (level: number): string => {
  const title = TITLES.slice().reverse().find(t => level >= t.minLevel);
  return title ? title.title : "Novice Hunter";
};

export const calculateTaskRewards = (task: TaskState, dailyEventMultiplier: number = 1): { xp: number; stats: any } => {
  const xp = Math.floor(task.xpReward * dailyEventMultiplier);
  return {
    xp,
    stats: task.statRewards
  };
};

export const calculatePerfectDayBonus = (tasks: TaskState[]): { goldBonus: number; xpBonus: number } => {
  const tier1Complete = tasks.filter(t => t.tier === 1 && t.isCompleted).length;
  const tier1Total = tasks.filter(t => t.tier === 1).length;
  
  if (tier1Complete === tier1Total && tier1Total > 0) {
    return { goldBonus: 50, xpBonus: 100 };
  }
  
  return { goldBonus: 0, xpBonus: 0 };
};

export const calculateHPLoss = (missedTasks: TaskState[], dailyEventMultiplier: number = 1): number => {
  let hpLoss = 0;
  
  missedTasks.forEach(task => {
    if (task.tier === 1) hpLoss += 15;
    else if (task.tier === 2) hpLoss += 10;
    else hpLoss += 5;
  });
  
  return Math.floor(hpLoss * dailyEventMultiplier);
};

export const isSpinAvailable = (lastSpinDate: string | null): boolean => {
  if (!lastSpinDate) return true;
  
  const today = new Date().toDateString();
  const lastSpin = new Date(lastSpinDate).toDateString();
  
  return today !== lastSpin;
};

export const canSubmitDay = (lastDaySubmitted: string | null): boolean => {
  if (!lastDaySubmitted) return true;
  
  const today = new Date().toDateString();
  const lastSubmit = new Date(lastDaySubmitted).toDateString();
  
  return today !== lastSubmit;
};

export const updateStreak = (lastDaySubmitted: string | null, currentStreak: number): number => {
  if (!lastDaySubmitted) return 1;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();
  
  const lastSubmit = new Date(lastDaySubmitted).toDateString();
  
  if (lastSubmit === yesterdayString) {
    return currentStreak + 1;
  } else {
    return 1; // Reset streak
  }
};

export const checkAchievements = (gameState: GameState): string[] => {
  const newAchievements: string[] = [];
  const { user, tasks } = gameState;
  
  // Level achievements
  if (user.level === 5 && !gameState.achievements.find(a => a.name === "Rising Star")) {
    newAchievements.push("Rising Star");
  }
  
  if (user.level === 10 && !gameState.achievements.find(a => a.name === "Double Digits")) {
    newAchievements.push("Double Digits");
  }
  
  if (user.level === 25 && !gameState.achievements.find(a => a.name === "Quarter Century")) {
    newAchievements.push("Quarter Century");
  }
  
  // Streak achievements
  if (user.currentStreak === 7 && !gameState.achievements.find(a => a.name === "Weekly Warrior")) {
    newAchievements.push("Weekly Warrior");
  }
  
  if (user.currentStreak === 30 && !gameState.achievements.find(a => a.name === "Monthly Master")) {
    newAchievements.push("Monthly Master");
  }
  
  // Task completion achievements
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  if (completedTasks >= 100 && !gameState.achievements.find(a => a.name === "Centurion")) {
    newAchievements.push("Centurion");
  }
  
  return newAchievements;
};

export const saveGameState = (gameState: GameState): void => {
  localStorage.setItem('soloLevelingGameState', JSON.stringify(gameState));
};

export const loadGameState = (): GameState | null => {
  const saved = localStorage.getItem('soloLevelingGameState');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse saved game state:', error);
    }
  }
  return null;
};
