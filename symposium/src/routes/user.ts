import express from "express";
import {
    createUser,
    getUserList,
    updateUser,
    deleteUser,
    getUserById
} from "../controllers/user";

const router = express.Router();

router.route("/:userID").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/").get(getUserList).post(createUser);

export default router;
