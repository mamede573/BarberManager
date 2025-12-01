import type { Barber, Category, Service, Appointment } from "@shared/schema";

const API_BASE = "/api";

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
