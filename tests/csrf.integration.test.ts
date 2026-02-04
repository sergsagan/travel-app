import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils'

let csrfToken = ''
let csrfCookie = ''
process.env.CSRF_SECRET = 'test-secret-123'

describe('CSRF integration', async () => {
    await setup({
        server: true,
        browser: false,
    })

    it('sets csrf cookie and returns token', async () => {
        const res = await fetch('/api/csrf')

        expect(res.status).toBe(200)

        const body = await res.json()
        csrfToken = body.token
        expect(body.token).toBeDefined()

        const setCookie = res.headers.get('set-cookie')
        expect(setCookie).toContain('csrf')
        // @ts-ignore
        csrfCookie = setCookie!.split(';')[0]
    })

    it('rejects POST without csrf', async () => {
        const res = await fetch('/api/locations', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Kyiv',
                lat: 50,
                long: 30,
            }),
        })

        expect(res.status).toBe(403)
    })

    it('rejects POST with invalid csrf', async () => {
        const res = await fetch('/api/locations', {
            method: 'POST',
            headers: {
                'x-csrf-token': 'invalid',
                cookie: csrfCookie,
            },
            body: JSON.stringify({
                name: 'Kyiv',
                lat: 50,
                long: 30,
            }),
        })

        expect(res.status).toBe(403)
    })

    it('accepts POST with valid csrf', async () => {
        const res = await fetch('/api/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'Cookie': csrfCookie,
            },
            body: JSON.stringify({
                name: 'Kyiv',
                lat: 50,
                long: 30,
            }),
        })

        expect(res.status).toBe(401)
    })
})
