import { loginHandler, logoutHandler, signupHandler } from "@/resources/auth/auth.controller";
import express, { Request, Response } from "express";

const authRouter = express.Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);

export default authRouter;