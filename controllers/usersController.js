const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body; // Add validation as necessary
  try {
    const user = await prisma.Users.create({
      data: {
        username,
        email,
        password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ error: `User could not be created: ${error.message}` });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Utilisez findMany pour récupérer tous les utilisateurs
    const users = await prisma.Users.findMany();
    res.status(200).json(users);
  } catch (error) {
    // Gérez les erreurs potentielles
    res.status(500).json({
      error: `An error occurred while retrieving users: ${error.message}`,
    });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params; // Assurez-vous que l'ID est transmis en tant que paramètre de route
  try {
    // Utilisez findUnique pour récupérer un utilisateur spécifique par son ID
    const user = await prisma.Users.findUnique({
      where: {
        id: parseInt(id), // Convertissez l'ID en nombre si c'est une chaîne
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Gérez les erreurs potentielles
    res.status(500).json({
      error: `An error occurred while retrieving user: ${error.message}`,
    });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params; // ID de l'utilisateur à mettre à jour
  const updateData = req.body; // Données pour la mise à jour (passez par le corps de la requête)

  try {
    const updatedUser = await prisma.Users.update({
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
    const deletedUser = await prisma.user.delete({
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
      res
        .status(500)
        .json({
          error: `An error occurred while deleting user: ${error.message}`,
        });
    }
  }
};
