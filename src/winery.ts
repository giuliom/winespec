import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import * as stdUUID from "jsr:@std/uuid";
import * as utils from "./utils/db_utils.ts";

export interface Winery {
    id: string;
    name: string;
    sub_region: string;
    region: string;
    country: string;
    uuisd: string;
    submitter_id: number;
}

export async function getWineryFromUUID(connection: PoolClient, wineryUUID: string) : Promise<Winery> {
    try {
        if  (!stdUUID.validate(wineryUUID)) throw "Invalid wine UUID";

        const query = `
            SELECT wy.*, 
            loc.sub_region,
            loc.region,
            loc.country
            FROM wineries wy
            LEFT JOIN locations loc ON wy.location_id = loc.id
            WHERE wy.uuid = $1;
        `;

        const result = await connection.queryObject<Winery>(query,
            [wineryUUID]
        );

        if (result.rowCount === undefined || result.rowCount < 1) throw "Winery not found";
        return Promise.resolve(result.rows[0]);
    } catch (error) {
        return Promise.reject(error);
    } 
}

export function filterWinery(wine: Winery) {
    const fields: (keyof Winery)[] = ["id", "submitter_id"];
    return utils.removeFields(wine, fields);
}