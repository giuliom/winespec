import * as stdUUID from "jsr:@std/uuid";
import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import * as utils from "./utils/db_utils.ts";

export interface Wine {
    id: string;
    name: string;
    year: number;
    grapes: string[];
    abv: number;
    types: string[];
    winery_name: string;
    sub_region: string;
    region: string;
    country: string;
    price: number;
    volume: number;
    uuid: string;
    submitter_id: number;
  }

export const requiredFields = ['name', 'year', 'grapes', 'abv', 'types', 'winery', 
    'region', 'country', 'price', 'volume'];

export function createWine(data: Wine) : Wine {
    for (const field of requiredFields) {
        if (field in data === undefined) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    data.grapes = Array.isArray(data.grapes) ? data.grapes : [data.grapes];
    data.types = Array.isArray(data.types) ? data.types : [data.types];
    data.uuid = data.uuid ?? "",
    data.submitter_id = 1;

    return data;
}    

export async function getAllWines(connection: PoolClient) : Promise<Wine[]> { 
    try {
        const result = await connection.queryObject<Wine>(`
        SELECT w.*,
        wy.name as winery,
        loc.region as region,
        loc.country as country
        FROM wines w
        LEFT JOIN wineries wy ON w.winery_id = wy.id
        LEFT JOIN locations loc ON wy.location_id = loc.id;
        `);

        return Promise.resolve(result.rows);
    } catch (error) {
        return Promise.reject(error);
    } 
}

export async function getWineFromUUID(connection: PoolClient, wineUUID: string) : Promise<Wine> {
    try {
        if  (!stdUUID.validate(wineUUID)) throw "Invalid wine UUID";

        const query = `
            SELECT w.*, 
            wy.name as winery,
            loc.region as region,
            loc.country as country
            FROM wines w
            LEFT JOIN wineries wy ON w.winery_id = wy.id
            LEFT JOIN locations loc ON wy.location_id = loc.id
            WHERE w.uuid = $1;
        `;

        const result = await connection.queryObject<Wine>(query,
            [wineUUID]
        );

        if (result.rowCount === undefined || result.rowCount < 1) throw "Wine not found";
        return Promise.resolve(result.rows[0]);
    } catch (error) {
        return Promise.reject(error);
    } 
}

export function filterWine(wine: Wine) {
    const fields: (keyof Wine)[] = ["id", "submitter_id"];
    return utils.removeFields(wine, fields);
}

export function filterWines(wines: Wine[]) {
    return wines.map(wine => filterWine(wine));
}

export async function addWine(connection: PoolClient, w: Wine) : Promise<string> {
    try {
        const query = `
            INSERT INTO wines (
                name, year, grapes, abv, types, 
                winery, region, country, 
                price, volume, submitter_id
            ) VALUES (
                $1, $2, $3::text[], $4, $5::text[],
                $6, $7, $8, $9, $10, $11
            )
            RETURNING uuid;
        `;

        const result = await connection.queryObject<{ uuid: string }>(query,
            [
                w.name,
                w.year,
                w.grapes,
                w.abv,
                w.types,
                w.winery_name,
                w.region,
                w.country,
                w.price,
                w.volume,
                1  // submitter_id
            ]
        );

        if (result.rows.length === 0) {
           throw new Error("Failed to get inserted wine UUID");
        }

        const uuid = result.rows[0].uuid;
        return Promise.resolve(uuid);
    } catch (error) {
        return Promise.reject(error);
    } 
}