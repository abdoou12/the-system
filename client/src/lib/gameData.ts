import { DailyEvent, BossChallenge, ShopItem, SpinOutcome } from "@/types/game";

export const RANKS = [
  { minLevel: 1, name: "Bronze", icon: "🥉" },
  { minLevel: 10, name: "Silver", icon: "🥈" },
  { minLevel: 25, name: "Gold", icon: "🥇" },
  { minLevel: 50, name: "Platinum", icon: "💎" },
  { minLevel: 75, name: "Diamond", icon: "💍" },
  { minLevel: 100, name: "Abdou", icon: "👑" },
];

export const TITLES = [
  { minLevel: 1, title: "Novice Hunter" },
  { minLevel: 5, title: "Rising Hunter" },
  { minLevel: 10, title: "Skilled Hunter" },
  { minLevel: 15, title: "Shadow Hunter" },
  { minLevel: 25, title: "Elite Hunter" },
  { minLevel: 35, title: "Veteran Shadow" },
  { minLevel: 50, title: "Shadow Commander" },
  { minLevel: 75, title: "Rising Monarch" },
  { minLevel: 100, title: "Shadow Monarch" },
];

export const XP_FORMULA = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

export const DAILY_EVENTS: DailyEvent[] = [
  {
    type: 'blessing',
    name: 'Blessing of Focus',
    description: '+25% XP gain from INT tasks today',
    effect: 'int_xp_boost',
    icon: '🧠'
  },
  {
    type: 'blessing',
    name: 'Blessing of Strength',
    description: '+25% XP gain from STR tasks today',
    effect: 'str_xp_boost',
    icon: '💪'
  },
  {
    type: 'blessing',
    name: 'Blessing of Wisdom',
    description: '+2 WIS from journaling today',
    effect: 'wis_boost',
    icon: '🦉'
  },
  {
    type: 'curse',
    name: 'Curse of Fatigue',
    description: '-10% XP gain from all tasks today',
    effect: 'xp_penalty',
    icon: '😴'
  },
  {
    type: 'curse',
    name: 'Curse of Doubt',
    description: '+20% HP loss from missed tasks today',
    effect: 'hp_penalty',
    icon: '😰'
  },
  {
    type: 'neutral',
    name: 'Ordinary Day',
    description: 'Nothing special is happening today',
    effect: 'none',
    icon: '🌅'
  }
];

export const BOSS_CHALLENGES: BossChallenge[] = [
  {
    id: 'morgo_sloth',
    name: 'Morgo, the Sloth Demon',
    description: 'A demon born from procrastination and lazy habits',
    objectives: [
      { id: 'wake_early', description: 'Wake up before 6 AM', completed: false },
      { id: 'no_snooze', description: 'No snooze button', completed: false },
      { id: 'morning_workout', description: 'Complete morning workout', completed: false }
    ],
    timeLimit: 24,
    startTime: new Date(),
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
  {
    id: 'malphas_doubt',
    name: 'Malphas, Whisperer of Doubt',
    description: 'A demon that feeds on spiritual neglect',
    objectives: [
      { id: 'morning_prayer', description: 'Complete morning prayers', completed: false },
      { id: 'meditation', description: '30 minutes of meditation', completed: false },
      { id: 'gratitude', description: 'Write 5 things you are grateful for', completed: false }
    ],
    timeLimit: 24,
    startTime: new Date(),
    rewards: {
      xp: 400,
      gold: 150,
      title: 'Faith\'s Bastion'
    },
    penalties: {
      hpLoss: 40,
      goldLoss: 75,
      restrictions: ['Reduced FAITH gains for 48h']
    }
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'small_hp_potion',
    name: 'Small HP Potion',
    description: 'Restores 25 HP',
    price: 50,
    type: 'consumable',
    effect: 'heal_25',
    icon: '🧪'
  },
  {
    id: 'medium_hp_potion',
    name: 'Medium HP Potion',
    description: 'Restores 50 HP',
    price: 100,
    type: 'consumable',
    effect: 'heal_50',
    icon: '🍯'
  },
  {
    id: 'xp_boost_scroll',
    name: 'XP Boost Scroll',
    description: '+50% XP gain for 24 hours',
    price: 150,
    type: 'consumable',
    effect: 'xp_boost_24h',
    icon: '📜'
  },
  {
    id: 'movie_permission',
    name: 'Movie Night Permission',
    description: 'Permission to watch a movie',
    price: 75,
    type: 'permission',
    icon: '🎬'
  },
  {
    id: 'gaming_hour',
    name: '+1 Hour Gaming Time',
    description: 'Permission for extra gaming',
    price: 100,
    type: 'permission',
    icon: '🎮'
  },
  {
    id: 'dungeon_skip',
    name: 'Dungeon Skip Ticket',
    description: 'Skip weekly dungeon without penalty',
    price: 300,
    type: 'special',
    icon: '🎫'
  }
];

export const SPIN_OUTCOMES: SpinOutcome[] = [
  {
    type: 'gold',
    message: 'Found 50 Gold!',
    value: 50
  },
  {
    type: 'gold',
    message: 'Found 100 Gold!',
    value: 100
  },
  {
    type: 'xp',
    message: 'Gained 100 XP!',
    value: 100
  },
  {
    type: 'blessing',
    message: 'Blessing of Focus activated!',
    value: 'focus_blessing'
  },
  {
    type: 'curse',
    message: 'Curse of Fatigue... -10% XP today',
    value: 'fatigue_curse'
  },
  {
    type: 'item',
    message: 'Found a Small HP Potion!',
    item: SHOP_ITEMS[0]
  },
  {
    type: 'nothing',
    message: 'Nothing special happened.',
    value: null
  }
];

export const DEFAULT_TASKS = [
  {
    name: "Morning Workout (30 min)",
    tier: 1 as const,
    xpReward: 50,
    statRewards: { str: 2, endu: 1 }
  },
  {
    name: "Read for 45 minutes",
    tier: 1 as const,
    xpReward: 50,
    statRewards: { kno: 2, wis: 1 }
  },
  {
    name: "Complete work project milestone",
    tier: 1 as const,
    xpReward: 75,
    statRewards: { int: 3, endu: 1 }
  },
  {
    name: "Meditation (20 min)",
    tier: 2 as const,
    xpReward: 30,
    statRewards: { faith: 2, wis: 1 }
  },
  {
    name: "Cook healthy meal",
    tier: 2 as const,
    xpReward: 25,
    statRewards: { str: 1, endu: 1 }
  },
  {
    name: "Learn new skill (30 min)",
    tier: 3 as const,
    xpReward: 15,
    statRewards: { int: 1, kno: 1 }
  },
  {
    name: "Social activity",
    tier: 3 as const,
    xpReward: 10,
    statRewards: { wis: 1 }
  },
  {
    name: "Creative project",
    tier: 3 as const,
    xpReward: 15,
    statRewards: { int: 1, wis: 1 }
  }
];
