import { Application, NextFunction, Request, Response } from "express";
import IController from "@/utils/interfaces/controller.interface";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import errorMiddleware from "@/middleware/error.middleware";

class App
{
    public express: Application;
    public port: number;

    constructor(controllers: IController[], port: number)
    {
        this.express = express();
        this.port = port;

        this.express.use("/health_check", async (_req: Request, res: Response, _next: NextFunction) =>
        {
            console.log("server is listening and is healthy");
            res.status(200).json({
                status: 200,
                message: "Server is up and running"
            });
        });
        this.initializeExpress();
        this.initializeControllers(controllers);
        this.initializeMiddleware();
    }

    private initializeExpress(): void
    {
        this.express.use(compression());
        this.express.use(cors());
        this.express.use(helmet());
        this.express.use(morgan("dev"));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private initializeControllers(controllers: IController[]): void
    {
        controllers.forEach(c =>
        {
            this.express.use("/api", c.router);
        });
    }

    private initializeMiddleware(): void
    {
        this.express.use(errorMiddleware);
    }

    public listen(): void
    {
        this.express.listen(this.port, () =>
        {
            console.log(`Now listening on port: ${this.port}`);
        });
    }
}

export default App;