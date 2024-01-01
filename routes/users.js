const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/usersController");

const router = express.Router();

// Create a new user
router.post("/signup", createUser);

// Login a user
router.post("/login", loginUser);

// Get all users
router.get("/", getAllUsers);

// Get a single user by id
router.get("/:id", getUser);

// Update a user
router.put("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
