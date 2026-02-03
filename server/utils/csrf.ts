import {createHmac, timingSafeEqual} from 'node:crypto'
import { getCookie, setCookie, getHeader, H3Event } from 'h3'

import { Buffer } from 'buffer'

const CSRF_COOKIE = 'csrf_token'

function sign(token: string, secret: string) {
    return createHmac('sha256', secret).update(token).digest('hex')
}

export function generateCsrfToken(secret: string) {
    const raw = crypto.randomUUID()
    const signature = sign(raw, secret)
    return `${raw}.${signature}`
}

export function setCsrfCookie(event: H3Event) {
    const { csrfSecret } = useRuntimeConfig()
    if (!csrfSecret) {
        throw new Error('CSRF_SECRET is missing')
    }

    const token = generateCsrfToken(csrfSecret)

    setCookie(event, CSRF_COOKIE, token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
        path: '/',
    })

    return token
}

export function verifyCsrf(event: H3Event) {
    const { csrfSecret } = useRuntimeConfig()

    const cookieToken = getCookie(event, CSRF_COOKIE)
    const headerToken = getHeader(event, 'x-csrf-token')

    if (!cookieToken || !headerToken) {
        throw createError({ statusCode: 403, statusMessage: 'CSRF token missing' })
    }

    if (cookieToken !== headerToken) {
        throw createError({ statusCode: 403, statusMessage: 'CSRF token mismatch' })
    }

    const [raw, signature] = cookieToken.split('.')
    if (!raw || !signature) {
        throw createError({ statusCode: 403, statusMessage: 'Malformed CSRF token' })
    }

    const expected = sign(raw, csrfSecret)

    const a = Buffer.from(signature)
    const b = Buffer.from(expected)

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        throw createError({ statusCode: 403, statusMessage: 'Invalid CSRF token' })
    }
}
