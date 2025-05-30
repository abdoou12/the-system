import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Task routes
  app.get("/api/users/:userId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getUserTasks(parseInt(req.params.userId));
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users/:userId/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({
        ...taskData,
        userId: parseInt(req.params.userId)
      });
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(parseInt(req.params.id), req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(parseInt(req.params.id));
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete task" });
    }
  });

  // Achievement routes
  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(parseInt(req.params.userId));
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // System events routes
  app.get("/api/users/:userId/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const events = await storage.getUserEvents(parseInt(req.params.userId), limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users/:userId/events", async (req, res) => {
    try {
      const { message, type } = req.body;
      const event = await storage.createEvent(parseInt(req.params.userId), message, type);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
