import "dotenv/config";
import "module-alias/register";

import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import errorMiddleware from "@/middleware/error.middleware";
import { StatusCodes } from "http-status-codes";

import userRoutes from "@/resources/user/user.routes";
import photoRoutes from "@/resources/photo/photo.routes";
import authRoutes from "@/resources/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

app.use(`/api/health`, (req: Request, res: Response, next: NextFunction) =>
{
    console.log("Healthy");
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "server is healthy"
    });
});
app.use(`/api/auth`, authRoutes);
app.use(`/api/users`, userRoutes);
app.use(`/api/photos`, photoRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT, () =>
{
    console.log(`Now listening on port: ${process.env.PORT}`);
});