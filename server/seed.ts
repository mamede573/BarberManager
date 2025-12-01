import { db } from "./db";
import { categories, barbers, services, users } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create categories
  const categoryData = [
    { name: "Haircut", icon: "✂️" },
    { name: "Beard", icon: "🧔" },
    { name: "Shave", icon: "🪒" },
    { name: "Facial", icon: "🧖" },
    { name: "Color", icon: "🎨" },
    { name: "Kids", icon: "👶" },
  ];

  const createdCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`Created ${createdCategories.length} categories`);

  // Create barbers
  const barberData = [
    {
      name: "Jack 'The Clipper'",
      bio: "Master barber with over 10 years of experience specializing in classic cuts and straight razor shaves. I believe every haircut is a work of art. Complimentary whiskey with every service.",
      image: "/api/placeholder/barber1.jpg",
      avatar: "https://i.pravatar.cc/150?u=barber1",
      rating: "4.9",
      reviewCount: 128,
      location: "Downtown",
      distance: "0.8km",
      priceRange: "$$",
      tags: ["Beard", "Fade"],
    },
    {
      name: "Gentleman's Den",
      bio: "A luxury grooming experience for the modern gentleman. Premium products, expert stylists, and an atmosphere of refined elegance.",
      image: "/api/placeholder/barber2.jpg",
      avatar: "https://i.pravatar.cc/150?u=barber2",
      rating: "4.8",
      reviewCount: 94,
      location: "West End",
      distance: "2.1km",
      priceRange: "$$$",
      tags: ["Luxury", "Spa"],
    },
    {
      name: "Iron & Ink",
      bio: "Where old-school barbering meets modern style. Known for creative fades, precision lineups, and a laid-back atmosphere.",
      image: "/api/placeholder/barber3.jpg",
      avatar: "https://i.pravatar.cc/150?u=barber3",
      rating: "4.9",
      reviewCount: 215,
      location: "Arts District",
      distance: "1.2km",
      priceRange: "$$",
      tags: ["Modern", "Tattoo"],
    },
    {
      name: "Classic Cuts",
      bio: "Traditional barbershop with decades of experience. Specializing in timeless styles, hot towel shaves, and old-fashioned service.",
      image: "/api/placeholder/barber4.jpg",
      avatar: "https://i.pravatar.cc/150?u=barber4",
      rating: "5.0",
      reviewCount: 340,
      location: "Old Town",
      distance: "3.5km",
      priceRange: "$$$",
      tags: ["Classic", "Shave"],
    },
    {
      name: "Razor Sharp",
      bio: "Quick, quality cuts for the busy professional. In and out in 30 minutes without sacrificing style.",
      image: "/api/placeholder/barber5.jpg",
      avatar: "https://i.pravatar.cc/150?u=barber5",
      rating: "4.6",
      reviewCount: 45,
      location: "Northside",
      distance: "3.5km",
      priceRange: "$",
      tags: ["Classic", "Quick"],
    },
    {
      name: "The Fade Factory",
      bio: "Specialists in fades, tapers, and color. We stay current with the latest trends and techniques.",
      image: "/api/placeholder/barber6.jpg",
      avatar: "https://i.pravatar.cc/150?u=barber6",
      rating: "4.7",
      reviewCount: 210,
      location: "Uptown",
      distance: "4.2km",
      priceRange: "$$",
      tags: ["Modern", "Color"],
    },
  ];

  const createdBarbers = await db.insert(barbers).values(barberData).returning();
  console.log(`Created ${createdBarbers.length} barbers`);

  // Create services for each barber
  const serviceTemplates = [
    { name: "Classic Haircut", description: "Traditional cut with clippers and scissors", duration: 45, price: "35.00" },
    { name: "Beard Trim & Shape", description: "Expert beard grooming and shaping", duration: 30, price: "25.00" },
    { name: "Hot Towel Shave", description: "Relaxing straight razor shave with hot towels", duration: 40, price: "40.00" },
    { name: "Hair & Beard Combo", description: "Complete haircut and beard service", duration: 75, price: "55.00" },
    { name: "Kids Haircut", description: "Gentle cuts for children under 12", duration: 30, price: "25.00" },
    { name: "Hair Color / Dye", description: "Professional coloring service", duration: 90, price: "80.00" },
    { name: "Facial Treatment", description: "Deep cleansing and moisturizing facial", duration: 45, price: "50.00" },
  ];

  for (const barber of createdBarbers) {
    const servicesForBarber = serviceTemplates.map(template => ({
      ...template,
      barberId: barber.id,
    }));
    await db.insert(services).values(servicesForBarber);
  }
  console.log(`Created services for all barbers`);

  // Create a demo user
  await db.insert(users).values({
    name: "Michael",
    email: "michael@example.com",
    phone: "+1234567890",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  });
  console.log("Created demo user");

  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
