import { z, TypeOf } from "zod";
const zodEnv = z.object({
    // Database
    DATABASE_URL: z.string(),
    // AWS
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_KEY: z.string(),
    BUCKET_NAME: z.string(),
    BUCKET_REGION: z.string(),
    // Port
    PORT: z.number().default(5000),
    //Node environment
    NODE_ENV: z.string().default("development"),
    //jwt secret
    JWT_SECRET: z.string(),
    EMAIL_SECRET: z.string(),
    //nodemailer auth
    EMAIL_USER: z.string(),
    EMAIL_PASS: z.string(),
});
declare global
{
    namespace NodeJS
    {
        interface ProcessEnv extends TypeOf<typeof zodEnv> { }
    }
}
try
{
    zodEnv.parse(process.env);
} catch (err)
{
    if (err instanceof z.ZodError)
    {
        const { fieldErrors } = err.flatten();
        const errorMessage = Object.entries(fieldErrors)
            .map(([field, errors]) =>
                errors ? `${field}: ${errors.join(", ")}` : field,
            )
            .join("\n  ");
        throw new Error(
            `Missing environment variables:\n  ${errorMessage}`,
        );
        process.exit(1);
    }
}