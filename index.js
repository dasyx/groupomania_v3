const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const usersRouter = require("./routes/users");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Enable CORS
app.use(cors());

app.use("/users", usersRouter);

// Adding an event listener for when Prisma connects to the database
prisma.$on("connected", () => {
  console.log("Database connected!");
});

/* async function main() {
  await prisma.Users.create({
    data: {
      username: "David",
      email: "dasyx@gmail.com",
      password: "password66",
    },
  });

  const allUsers = await prisma.Users.findMany();
  console.log(allUsers);
} */

/* main()
  .then(async () => {
    // If you've got additional logic or cleanup, it can go here
    console.log("Successfully executed main function.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); */

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
