import type { UserWithId } from "~/lib/auth";
declare module 'h3' {
    interface H3EventContext {
        user?: UserWithId
    }
}
