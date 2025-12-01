import { db } from "./db";
import { services } from "@shared/schema";
import { eq } from "drizzle-orm";

async function updateImages() {
  const serviceImages: Record<string, string> = {
    "Classic Haircut": "https://images.pexels.com/photos/1390235/pexels-photo-1390235.jpeg",
    "Beard Trim & Shape": "https://images.pexels.com/photos/991537/pexels-photo-991537.jpeg",
    "Hot Towel Shave": "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg",
    "Hair & Beard Combo": "https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg",
    "Kids Haircut": "https://images.pexels.com/photos/8018316/pexels-photo-8018316.jpeg",
    "Hair Color / Dye": "https://images.pexels.com/photos/3722621/pexels-photo-3722621.jpeg",
    "Facial Treatment": "https://images.pexels.com/photos/3852584/pexels-photo-3852584.jpeg",
  };

  const allServices = await db.select().from(services);
  for (const service of allServices) {
    const image = serviceImages[service.name];
    if (image && !service.image) {
      await db.update(services).set({ image }).where(eq(services.id, service.id));
    }
  }

  console.log("Updated services with images");
}

updateImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Update failed:", error);
    process.exit(1);
  });
