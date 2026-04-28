import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Fruits & Vegetables" },
    { name: "Rice & Pantry" },
    { name: "Beverages" },
    { name: "Snacks" },
    { name: "Dairy & Frozen" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: {
        name: process.env.ADMIN_NAME || "Store Admin",
        password,
        role: "ADMIN"
      },
      create: {
        name: process.env.ADMIN_NAME || "Store Admin",
        email: process.env.ADMIN_EMAIL,
        password,
        role: "ADMIN",
        cart: {
          create: {}
        }
      }
    });
  }

  console.log("Seeded categories and optional admin successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
