const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Seluruh rute di bawah ini otomatis terkunci dan wajib lolos JWT & Role Admin
router.use(authMiddleware, adminMiddleware);

// Endpoint utama penarikan dan manipulasi data user
router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.put("/users/:nrp", adminController.updateUser);
router.delete("/users/:nrp", adminController.deleteUser);

module.exports = router;
