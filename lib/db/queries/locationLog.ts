import {type InsertLocationLog, locationLog} from "~/lib/db/schema";
import { and, eq } from "drizzle-orm";
import db from "..";

export async function findLocationLog(id: number, userId: number) {
    return await db.query.locationLog.findFirst({
        where: and(
            eq(locationLog.id, id),
            eq(locationLog.userId, userId)
        )
    });
}

export async function insertLocationLog(locationId: number, insertable: InsertLocationLog, userId: number ) {
    const [inserted] = await db.insert(locationLog).values({
        ...insertable, locationId, userId
    }).returning();

    return inserted;
}
