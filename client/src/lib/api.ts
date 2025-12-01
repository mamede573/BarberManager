import type { Barber, Category, Service, Appointment, User } from "@shared/schema";

const API_BASE = "/api";

// Auth
export async function signup(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create account");
  }
  return res.json();
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// Barbers
export async function getBarbers(): Promise<Barber[]> {
  const res = await fetch(`${API_BASE}/barbers`);
  if (!res.ok) throw new Error("Failed to fetch barbers");
  return res.json();
}

export async function getBarber(id: string): Promise<Barber> {
  const res = await fetch(`${API_BASE}/barbers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch barber");
  return res.json();
}

// Services
export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getServicesByBarber(barberId: string): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/barbers/${barberId}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

// Appointments
export async function createAppointment(data: {
  clientId: string;
  barberId: string;
  serviceIds: string[];
  date: Date;
  time: string;
  totalPrice: string;
  paymentMethod?: string;
}): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

export async function getAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${API_BASE}/appointments`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
  const res = await fetch(`${API_BASE}/appointments/client/${clientId}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to cancel appointment");
  return res.json();
}

export async function rescheduleAppointment(appointmentId: string, data: {
  date: Date;
  time: string;
}): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments/${appointmentId}/reschedule`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to reschedule appointment");
  return res.json();
}

export async function getAvailableSlots(barberId: string, date: string, serviceIds: string[]): Promise<string[]> {
  const res = await fetch(`${API_BASE}/barbers/${barberId}/available-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: new Date(date), serviceIds }),
  });
  if (!res.ok) throw new Error("Failed to fetch available slots");
  return res.json();
}
