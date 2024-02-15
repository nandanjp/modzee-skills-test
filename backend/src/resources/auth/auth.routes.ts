import validationMiddleware from "@/middleware/validation.middleware";
import { loginHandler, logoutHandler, signupFormValidator, signupHandler, verifyEmail } from "@/resources/auth/auth.handler";
import express from "express";
import multer from "multer";
import { LoginUserSchema } from "./auth.validate";

const authRouter = express.Router();

authRouter.post("/signup", multer({ storage: multer.memoryStorage() }).single('profile'), signupFormValidator, signupHandler);
authRouter.post("/login", validationMiddleware(LoginUserSchema), loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/verify", verifyEmail);

export default authRouter;