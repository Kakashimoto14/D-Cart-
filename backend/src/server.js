import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    app.listen(env.port, () => {
      console.log(`D'Cart backend listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
};

startServer();
