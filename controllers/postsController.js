const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await prisma.posts.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res
      .status(400)
      .json({ error: `Post could not be created: ${error.message}` });
  }
};

exports.getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while retrieving post: ${error.message}`,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      /* include: {
        users: true, // Inclure les données de l'utilisateur
      }, */
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while retrieving posts: ${error.message}`,
    });
  }
};

// Ajoutez ici les fonctions pour updatePost, deletePost, getAllPosts, etc.
