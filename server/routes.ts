import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBarberSchema, insertServiceSchema, insertCategorySchema, insertAppointmentSchema, insertReviewSchema, insertUserSchema } from "@shared/schema";
import bcryptjs from "bcryptjs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ AUTH ============
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
      });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ message: error.message || "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============ CATEGORIES ============
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // ============ BARBERS ============
  app.get("/api/barbers", async (_req, res) => {
    try {
      const barbers = await storage.getBarbers();
      res.json(barbers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch barbers" });
    }
  });

  app.get("/api/barbers/:id", async (req, res) => {
    try {
      const barber = await storage.getBarber(req.params.id);
      if (!barber) {
        return res.status(404).json({ message: "Barber not found" });
      }
      res.json(barber);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch barber" });
    }
  });

  app.post("/api/barbers", async (req, res) => {
    try {
      const data = insertBarberSchema.parse(req.body);
      const barber = await storage.createBarber(data);
      res.status(201).json(barber);
    } catch (error) {
      res.status(400).json({ message: "Invalid barber data" });
    }
  });

  app.patch("/api/barbers/:id", async (req, res) => {
    try {
      const barber = await storage.updateBarber(req.params.id, req.body);
      if (!barber) {
        return res.status(404).json({ message: "Barber not found" });
      }
      res.json(barber);
    } catch (error) {
      res.status(400).json({ message: "Invalid barber data" });
    }
  });

  // ============ SERVICES ============
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/barbers/:barberId/services", async (req, res) => {
    try {
      const services = await storage.getServicesByBarber(req.params.barberId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.patch("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(400).json({ message: "Invalid service data" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // ============ APPOINTMENTS ============
  app.get("/api/appointments", async (_req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const data = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(data);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Invalid appointment data" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Invalid appointment data" });
    }
  });

  // ============ REVIEWS ============
  app.get("/api/barbers/:barberId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByBarber(req.params.barberId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(data);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // ============ USERS ============
  app.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { name, phone, avatar } = req.body;
      const user = await storage.updateUser(req.params.id, { name, phone, avatar });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  return httpServer;
}
