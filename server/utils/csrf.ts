import { randomBytes, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, getHeader } from 'h3'

const CSRF_COOKIE = 'csrf_token'

export function generateCsrfToken() {
    return randomBytes(32).toString('hex')
}

export function setCsrfCookie(event: any) {
    const token = generateCsrfToken()

    setCookie(event, CSRF_COOKIE, token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })

    return token
}

export function verifyCsrf(event: any) {
    const cookieToken = getCookie(event, CSRF_COOKIE)
    const headerToken = getHeader(event, 'x-csrf-token')

    if (!cookieToken || !headerToken) {
        throw createError({
            statusCode: 403,
            statusMessage: 'CSRF token missing',
        })
    }

    const a = Buffer.from(cookieToken)
    const b = Buffer.from(headerToken)

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Invalid CSRF token',
        })
    }
}
