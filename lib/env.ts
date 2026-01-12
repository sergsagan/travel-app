import { z } from 'zod'
import tryParseEnv from "./try-parse-env";

const envSchema = z.object({
    NODE_ENV: z.string()
})
export type envSchema = z.infer<typeof envSchema>

tryParseEnv(envSchema)

export default envSchema.parse(process.env)
