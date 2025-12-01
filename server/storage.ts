import { 
  type User, type InsertUser, users,
  type Category, type InsertCategory, categories,
  type Barber, type InsertBarber, barbers,
  type Service, type InsertService, services,
  type Appointment, type InsertAppointment, appointments,
  type Review, type InsertReview, reviews
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Barbers
  getBarbers(): Promise<Barber[]>;
  getBarber(id: string): Promise<Barber | undefined>;
  createBarber(barber: InsertBarber): Promise<Barber>;
  updateBarber(id: string, barber: Partial<InsertBarber>): Promise<Barber | undefined>;
  
  // Services
  getServices(): Promise<Service[]>;
  getServicesByBarber(barberId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByClient(clientId: string): Promise<Appointment[]>;
  getAppointmentsByBarber(barberId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  
  // Reviews
  getReviewsByBarber(barberId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  // Barbers
  async getBarbers(): Promise<Barber[]> {
    return db.select().from(barbers).where(eq(barbers.isActive, true)).orderBy(desc(barbers.rating));
  }

  async getBarber(id: string): Promise<Barber | undefined> {
    const [barber] = await db.select().from(barbers).where(eq(barbers.id, id));
    return barber;
  }

  async createBarber(barber: InsertBarber): Promise<Barber> {
    const [created] = await db.insert(barbers).values(barber).returning();
    return created;
  }

  async updateBarber(id: string, barber: Partial<InsertBarber>): Promise<Barber | undefined> {
    const [updated] = await db.update(barbers).set(barber).where(eq(barbers.id, id)).returning();
    return updated;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.isActive, true));
  }

  async getServicesByBarber(barberId: string): Promise<Service[]> {
    return db.select().from(services).where(eq(services.barberId, barberId));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.update(services).set({ isActive: false }).where(eq(services.id, id)).returning();
    return result.length > 0;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.clientId, clientId)).orderBy(desc(appointments.date));
  }

  async getAppointmentsByBarber(barberId: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.barberId, barberId)).orderBy(desc(appointments.date));
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [created] = await db.insert(appointments).values(appointment).returning();
    return created;
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set(appointment).where(eq(appointments.id, id)).returning();
    return updated;
  }

  // Reviews
  async getReviewsByBarber(barberId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.barberId, barberId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
