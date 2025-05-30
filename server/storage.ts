import { 
  users, 
  dailyTasks, 
  achievements, 
  systemEvents,
  type User, 
  type InsertUser, 
  type DailyTask, 
  type Achievement, 
  type SystemEvent,
  type InsertTask,
  type InsertAchievement 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Task operations
  getUserTasks(userId: number): Promise<DailyTask[]>;
  createTask(task: InsertTask & { userId: number }): Promise<DailyTask>;
  updateTask(taskId: number, updates: Partial<DailyTask>): Promise<DailyTask>;
  deleteTask(taskId: number): Promise<void>;
  
  // Achievement operations
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement>;
  
  // System events
  getUserEvents(userId: number, limit?: number): Promise<SystemEvent[]>;
  createEvent(userId: number, message: string, type: string): Promise<SystemEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, DailyTask>;
  private achievements: Map<number, Achievement>;
  private events: Map<number, SystemEvent>;
  private currentUserId: number;
  private currentTaskId: number;
  private currentAchievementId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.achievements = new Map();
    this.events = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentAchievementId = 1;
    this.currentEventId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      level: 1,
      currentXP: 0,
      currentHP: 100,
      maxHP: 100,
      gold: 0,
      attributePoints: 0,
      stats: { str: 10, int: 10, kno: 10, wis: 10, endu: 10, faith: 10 },
      lastDaySubmitted: null,
      currentStreak: 0,
      lastSpinDate: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserTasks(userId: number): Promise<DailyTask[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(task: InsertTask & { userId: number }): Promise<DailyTask> {
    const id = this.currentTaskId++;
    const newTask: DailyTask = {
      ...task,
      id,
      isCompleted: false,
      completedDate: null,
      createdAt: new Date(),
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(taskId: number, updates: Partial<DailyTask>): Promise<DailyTask> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error("Task not found");
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  async deleteTask(taskId: number): Promise<void> {
    this.tasks.delete(taskId);
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const newAchievement: Achievement = {
      ...achievement,
      id,
      unlockedAt: new Date(),
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getUserEvents(userId: number, limit: number = 10): Promise<SystemEvent[]> {
    const userEvents = Array.from(this.events.values())
      .filter(event => event.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
    return userEvents;
  }

  async createEvent(userId: number, message: string, type: string): Promise<SystemEvent> {
    const id = this.currentEventId++;
    const event: SystemEvent = {
      id,
      userId,
      message,
      type,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }
}

export const storage = new MemStorage();
