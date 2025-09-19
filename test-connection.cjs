const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Testing Prisma connection...");

    // Test basic connection
    const userCount = await prisma.user.count();
    console.log(`✅ Connection successful! Found ${userCount} users`);

    // Test relationship query
    const userWithProfile = await prisma.user.findFirst({
      include: { profile: true },
    });

    if (userWithProfile) {
      console.log(`✅ User found: ${userWithProfile.email}`);
      if (userWithProfile.profile) {
        console.log(`✅ Profile found: ${userWithProfile.profile.role}`);
      } else {
        console.log("⚠️  User has no profile");
      }
    } else {
      console.log("⚠️  No users found");
    }
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
