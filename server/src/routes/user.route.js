import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller.js"; // Added `.js` for ESM compatibility

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);

export default userRoutes;
