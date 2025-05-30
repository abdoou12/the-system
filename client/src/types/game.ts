export interface GameState {
  user: UserState;
  tasks: TaskState[];
  achievements: Achievement[];
  events: SystemEvent[];
  dailyEvent: DailyEvent | null;
  activeBoss: BossChallenge | null;
  modals: {
    levelUp: boolean;
    shop: boolean;
    journal: boolean;
    dailySpin: boolean;
  };
}

export interface UserState {
  id: number;
  username: string;
  level: number;
  currentXP: number;
  currentHP: number;
  maxHP: number;
  gold: number;
  attributePoints: number;
  stats: {
    str: number;
    int: number;
    kno: number;
    wis: number;
    endu: number;
    faith: number;
  };
  title: string;
  rank: string;
  lastDaySubmitted: string | null;
  currentStreak: number;
  lastSpinDate: string | null;
}

export interface TaskState {
  id: number;
  name: string;
  tier: 1 | 2 | 3;
  xpReward: number;
  statRewards: {
    str?: number;
    int?: number;
    kno?: number;
    wis?: number;
    endu?: number;
    faith?: number;
  };
  isCompleted: boolean;
  completedDate: string | null;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface SystemEvent {
  id: number;
  message: string;
  type: string;
  createdAt: Date;
}

export interface DailyEvent {
  type: 'blessing' | 'curse' | 'neutral';
  name: string;
  description: string;
  effect: string;
  icon: string;
}

export interface BossChallenge {
  id: string;
  name: string;
  description: string;
  objectives: BossObjective[];
  timeLimit: number; // hours
  startTime: Date;
  rewards: {
    xp: number;
    gold: number;
    title?: string;
  };
  penalties: {
    hpLoss: number;
    goldLoss: number;
    restrictions: string[];
  };
}

export interface BossObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'consumable' | 'permission' | 'special';
  effect?: string;
  icon: string;
}

export interface SpinOutcome {
  type: 'gold' | 'xp' | 'blessing' | 'curse' | 'item' | 'nothing';
  message: string;
  value?: number | string;
  item?: ShopItem;
}
