import { loginHandler, logoutHandler, signupHandler, verifyEmail } from "@/resources/auth/auth.handler";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/verify", verifyEmail);

export default authRouter;