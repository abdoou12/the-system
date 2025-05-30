import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").default(1),
  currentXP: integer("current_xp").default(0),
  currentHP: integer("current_hp").default(100),
  maxHP: integer("max_hp").default(100),
  gold: integer("gold").default(0),
  attributePoints: integer("attribute_points").default(0),
  stats: jsonb("stats").$type<{
    str: number;
    int: number;
    kno: number;
    wis: number;
    endu: number;
    faith: number;
  }>().default({ str: 10, int: 10, kno: 10, wis: 10, endu: 10, faith: 10 }),
  lastDaySubmitted: text("last_day_submitted"),
  currentStreak: integer("current_streak").default(0),
  lastSpinDate: text("last_spin_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyTasks = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  tier: integer("tier").notNull(), // 1, 2, or 3
  xpReward: integer("xp_reward").default(0),
  statRewards: jsonb("stat_rewards").$type<{
    str?: number;
    int?: number;
    kno?: number;
    wis?: number;
    endu?: number;
    faith?: number;
  }>().default({}),
  isCompleted: boolean("is_completed").default(false),
  completedDate: text("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const systemEvents = pgTable("system_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'task_complete', 'level_up', 'achievement', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(dailyTasks).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  userId: true,
  unlockedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DailyTask = typeof dailyTasks.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type SystemEvent = typeof systemEvents.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
