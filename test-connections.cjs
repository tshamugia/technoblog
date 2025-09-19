require("dotenv").config({ path: ".env.local" });

// Test different connection strings
const connectionStrings = [
  // Original
  process.env.DATABASE_URL,

  // With pgbouncer transaction mode
  "postgresql://postgres:JmXDhxyPn7h6FwYN@db.hvtwwmgsadjsqnznaumq.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1",

  // Direct connection
  "postgresql://postgres:JmXDhxyPn7h6FwYN@db.hvtwwmgsadjsqnznaumq.supabase.co:5432/postgres?sslmode=require",

  // With session mode
  "postgresql://postgres:JmXDhxyPn7h6FwYN@db.hvtwwmgsadjsqnznaumq.supabase.co:6543/postgres?pgbouncer=true",
];

async function testConnections() {
  const { PrismaClient } = require("@prisma/client");

  for (let i = 0; i < connectionStrings.length; i++) {
    const url = connectionStrings[i];
    console.log(`\n--- Testing connection ${i + 1} ---`);
    console.log("URL:", url?.substring(0, 50) + "...");

    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: url,
          },
        },
      });

      const count = await prisma.user.count();
      console.log(`✅ Success! Found ${count} users`);
      await prisma.$disconnect();

      // If this one works, stop testing
      console.log("🎉 This connection string works!");
      break;
    } catch (error) {
      console.log(`❌ Failed:`, error.message.substring(0, 100) + "...");
    }
  }
}

testConnections();
