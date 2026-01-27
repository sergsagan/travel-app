import { setCsrfCookie } from '~/server/utils/csrf'

export default defineEventHandler((event) => {
    const token = setCsrfCookie(event)

    return {
        csrfToken: token,
    }
})
