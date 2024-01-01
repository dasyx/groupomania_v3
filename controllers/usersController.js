const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body; // Les données provenant du client

  try {
    // Hasher le mot de passe avant de le sauvegarder
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Création de l'utilisateur avec le mot de passe haché
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword, // Utilisez le mot de passe haché ici
      },
    });

    // Retourner l'utilisateur créé
    // Assurez-vous de ne pas retourner le mot de passe, même haché, pour des raisons de sécurité
    //const { password: userPassword, ...userInfo } = user;
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ error: `User could not be created: ${error.message}` });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body; // Récupérez les données de connexion fournies par l'utilisateur

  try {
    // Trouvez l'utilisateur par son nom d'utilisateur (ou email)
    const user = await prisma.users.findUnique({
      where: {
        username, // ou email si vous utilisez l'email pour se connecter
      },
    });

    // Vérifiez si l'utilisateur existe et si le mot de passe correspond
    if (user && bcrypt.compareSync(password, user.password)) {
      // Le mot de passe est correct. Effectuez la logique de connexion ici.

      // Créez une session ou un token JWT, selon votre stratégie d'authentification
      // Pour cet exemple, nous allons simplement renvoyer un message de succès
      res.status(200).json({ message: "Login successful!" });
    } else {
      // L'authentification a échoué
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    // Gérez les erreurs potentielles, comme des erreurs de base de données
    res
      .status(500)
      .json({ error: `An error occurred during login: ${error.message}` });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Utilisez findMany pour récupérer tous les utilisateurs
    const users = await prisma.users.findMany();
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
    const user = await prisma.users.findUnique({
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
