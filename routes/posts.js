const express = require("express");
const {
  createPost,
  getPost,
  getAllPosts,
  // autres méthodes
} = require("../controllers/postsController");

const router = express.Router();

router.get("/allposts", getAllPosts);
router.post("/newpost", createPost);
router.get("/:id", getPost);
// autres routes

module.exports = router;
