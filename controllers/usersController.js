const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line no-unused-vars
    const { password: userPassword, ...userInfo } = user;
    res.status(201).json(userInfo);
  } catch (error) {
    res
      .status(400)
      .json({ error: `User could not be created: ${error.message}` });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line no-unused-vars
      const { password: userPassword, ...userInfo } = user;
      // Suppose you have a function to create JWT tokens
      // const token = createToken(user.id);
      res.status(200).json({
        message: "Login successful!",
        userId: user.id,
        // token: token, // Uncomment if using JWT tokens
        ...userInfo,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `An error occurred during login: ${error.message}` });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while retrieving users: ${error.message}`,
    });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (user) {
      // eslint-disable-next-line no-unused-vars
      const { password: userPassword, ...userInfo } = user;
      res.status(200).json(userInfo);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while retrieving user: ${error.message}`,
    });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params; // ID de l'utilisateur à mettre à jour
  const updateData = req.body; // Données pour la mise à jour (passez par le corps de la requête)

  try {
    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(id), // Assurez-vous que l'ID est un entier
      },
      data: updateData, // Les données de mise à jour
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    // Gérez les erreurs potentielles, comme un utilisateur non trouvé ou des problèmes de validation
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({
        error: `An error occurred while updating user: ${error.message}`,
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params; // ID de l'utilisateur à supprimer

  try {
    const deletedUser = await prisma.users.delete({
      where: {
        id: parseInt(id), // Assurez-vous que l'ID est un entier
      },
    });
    res
      .status(200)
      .json({ message: "User successfully deleted", user: deletedUser });
  } catch (error) {
    // Gérez les erreurs potentielles, comme un utilisateur non trouvé ou des problèmes de base de données
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({
        error: `An error occurred while deleting user: ${error.message}`,
      });
    }
  }
};
