import { z, TypeOf } from "zod";
const zodEnv = z.object({
    // Database
    DATABASE_URL: z.string(),
    // Cloudflare
    CLOUDFLARE_IMAGES_ACCOUNT_ID: z.string(),
    CLOUDFLARE_IMAGES_API_TOKEN: z.string(),
    // Sentry
    SENTRY_DSN: z.string(),
    SENTRY_RELEASE: z.string().optional(),
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