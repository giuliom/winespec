import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import * as utils from "../utils/db_utils.ts";

export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    uuid: string;
    created_at: Date;
    updated_at: Date;
}

export async function getUserFromId(connection: PoolClient, userId: number) : Promise<User> {
    try {
        // Create the table
        const result = await connection.queryObject<User>(`
        SELECT * FROM users
        WHERE id = $1`,
        [userId]
        );

        if (result.rowCount === undefined || result.rowCount < 1) throw "User not found";
        return Promise.resolve(result.rows[0]);
    } catch (error) {
        return Promise.reject(error);
    } 
}

export function filterUser(user: User) {
    return utils.removeIdField(user);
}