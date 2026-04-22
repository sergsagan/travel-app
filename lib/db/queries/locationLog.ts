import {type InsertLocationLog, locationLog} from "~/lib/db/schema";
import db from "~/lib/db";

export async function insertLocationLog(locationId: number, insertable: InsertLocationLog, userId: number ) {
    const [inserted] = await db.insert(locationLog).values({
        ...insertable, locationId, userId
    }).returning();

    return inserted;
}
