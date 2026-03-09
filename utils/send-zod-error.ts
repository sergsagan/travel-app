import type { H3Event } from 'h3'
import type { ZodError } from 'zod'
import { sendError, createError } from 'h3'

export default function sendZodError(event: H3Event, error: unknown) {
    const zodError = error as ZodError

    const statusMessage = zodError.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')

    const data = zodError.issues.reduce((errors, issue) => {
        errors[issue.path.join('.')] = issue.message
        return errors
    }, {} as Record<string, string>)

    return sendError(
        event,
        createError({
            statusCode: 422,
            statusMessage,
            data
        })
    )
}
