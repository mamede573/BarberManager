import { 
  type User, type InsertUser, users,
  type Category, type InsertCategory, categories,
  type Barber, type InsertBarber, barbers,
  type Service, type InsertService, services,
  type Appointment, type InsertAppointment, appointments,
  type Review, type InsertReview, reviews,
  type Notification, type InsertNotification, notifications
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
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
  cancelAppointment(appointmentId: string): Promise<Appointment | undefined>;
  rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<Appointment | undefined>;
  getAvailableSlots(barberId: string, date: Date, serviceIds: string[]): Promise<string[]>;
  
  // Reviews
  getReviewsByBarber(barberId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(notificationId: string): Promise<Notification | undefined>;

  // Account
  deleteUser(userId: string): Promise<boolean>;
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

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return updated;
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

  async cancelAppointment(appointmentId: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set({ status: "cancelled" }).where(eq(appointments.id, appointmentId)).returning();
    return updated;
  }

  async rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set({ date: newDate, time: newTime }).where(eq(appointments.id, appointmentId)).returning();
    return updated;
  }

  private getDateInBrasiliaTimezone(date: Date): string {
    // Convert date to Brasília timezone (UTC-3) and return YYYY-MM-DD
    const offset = -3; // Brasília timezone is UTC-3 (no daylight saving consideration for simplicity)
    const utcDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
    return utcDate.toISOString().split("T")[0];
  }

  async getAvailableSlots(barberId: string, date: Date, serviceIds: string[]): Promise<string[]> {
    const allSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
    
    try {
      // Get services and calculate total duration
      const services = await Promise.all(
        serviceIds.map(id => this.getService(id).catch(() => null))
      );
      const totalDuration = services.reduce((sum, s) => sum + (s?.duration || 30), 0);
      
      // Get booked appointments for this barber
      const bookedAppointments = await db.select().from(appointments)
        .where(eq(appointments.barberId, barberId));
      
      // Convert target date to Brasília timezone for comparison
      const targetDateStr = this.getDateInBrasiliaTimezone(date);
      
      const appointmentsOnDate = bookedAppointments.filter(appt => {
        if (!appt.date) return false;
        const apptDateStr = this.getDateInBrasiliaTimezone(appt.date);
        return apptDateStr === targetDateStr && (appt.status === "confirmed" || appt.status === "pending");
      });
      
      // Build blocked time ranges
      const blockedTimeRanges: Array<{ start: number; end: number }> = [];
      
      for (const appt of appointmentsOnDate) {
        if (!appt.time || !appt.serviceIds) continue;
        
        const apptServices = await Promise.all(
          (appt.serviceIds || []).map(id => this.getService(id).catch(() => null))
        );
        const apptDuration = apptServices.reduce((sum, s) => sum + (s?.duration || 30), 0);
        
        const [apptHours, apptMinutes] = appt.time.split(":").map(Number);
        const apptStartTime = apptHours * 60 + apptMinutes;
        const apptEndTime = apptStartTime + apptDuration;
        
        blockedTimeRanges.push({ start: apptStartTime, end: apptEndTime });
      }
      
      // Filter slots: return only those that don't conflict
      return allSlots.filter(slot => {
        const timeParts = slot.split(":");
        if (timeParts.length !== 2) return false;
        
        const [hours, minutes] = timeParts.map(Number);
        const slotStart = hours * 60 + minutes;
        const slotEnd = slotStart + totalDuration;
        
        // Check if this slot conflicts with any blocked time range
        return !blockedTimeRanges.some(range => 
          slotStart < range.end && slotEnd > range.start
        );
      });
    } catch (error) {
      console.error("[ERROR] getAvailableSlots:", error, { barberId, date, serviceIds });
      // Return all slots as fallback to avoid complete failure
      return ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
    }
  }

  // Reviews
  async getReviewsByBarber(barberId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.barberId, barberId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification | undefined> {
    const [updated] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId)).returning();
    return updated;
  }

  // Account
  async deleteUser(userId: string): Promise<boolean> {
    await db.delete(users).where(eq(users.id, userId));
    return true;
  }
}

export const storage = new DatabaseStorage();
