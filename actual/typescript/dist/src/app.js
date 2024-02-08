"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("@/middleware/error.middleware"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.express.use("/health_check", (_req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            console.log("server is listening and is healthy");
            res.status(200).json({
                status: 200,
                message: "Server is up and running"
            });
        }));
        this.initializeExpress();
        this.initializeControllers(controllers);
        this.initializeMiddleware();
    }
    initializeExpress() {
        this.express.use((0, compression_1.default)());
        this.express.use((0, cors_1.default)());
        this.express.use((0, helmet_1.default)());
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
    }
    initializeControllers(controllers) {
        controllers.forEach(c => {
            this.express.use("/api", c.router);
        });
    }
    initializeMiddleware() {
        this.express.use(error_middleware_1.default);
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`Now listening on port: ${this.port}`);
        });
    }
}
exports.default = App;
