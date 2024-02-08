import { cleanEnv, port, str } from "envalid";

export default function validateEnv(): void
{
    cleanEnv(process.env, {
        DATABASE_URL: str({
            default: "mysql://nandanjp:kujoforall@localhost:3306/photos"
        }),
        NODE_ENV: str({
            choices: ["development", "production"]
        }),
        PORT: port({ default: 3000 }),
        JWT_SECRET: str({ default: "" })
    });
};