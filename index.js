const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Adding an event listener for when Prisma connects to the database
prisma.$on("connected", () => {
  console.log("Database connected!");
});

async function main() {
  // ... you will write your Prisma Client queries here
  // For now, let's just print a success message if this function is reached
  console.log("Prisma Client queries can be executed now.");
}

main()
  .then(async () => {
    // If you've got additional logic or cleanup, it can go here
    console.log("Successfully executed main function.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
