const express = require("express");
const router = express.Router();

const userController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.get("/", verifyRoles(ROLES_LIST.Admin), userController.getAllUsers);

module.exports = router;
