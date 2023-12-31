const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Adding an event listener for when Prisma connects to the database
prisma.$on("connected", () => {
  console.log("Database connected!");
});

async function main() {
  /* await prisma.Users.create({
    data: {
      username: "David",
      email: "dasyx@gmail.com",
      password: "password66",
    },
  }); */

  const allUsers = await prisma.Users.findMany();
  console.log(allUsers);
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
