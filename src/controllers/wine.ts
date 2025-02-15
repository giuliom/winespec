import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import * as stdUUID from "jsr:@std/uuid";
import * as utils from "../utils/db_utils.ts";
import { Winery, getWineryFromName } from "./winery.ts";

export interface Wine {
    id: string;
    name: string;
    grapes: string[];
    abv: number;
    types: string[];
    winery_name: string;
    winery_id: string;
    winery_uuid: string;
    sub_region: string;
    region: string;
    country: string;
    uuid: string;
    submitter_id: number;
  }

  export interface WineInstance {
    id: string;
    wine_id: string;
    year: number;
    volume: number; // up until here must be unique
    closure: string; // should I have them in collection or general data?
    has_sulfites: boolean; 
    price: number;
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
    data.winery_uuid = data.winery_uuid ?? "";
    data.submitter_id = 1;

    return data;
}    

// TODO refactor all queries logic and add proper error checks

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
            wy.uuid as winery_uuid,
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
        await connection.queryObject('BEGIN');

        // Check if Winery is already present
        const winery : Winery | null = await getWineryFromName(connection, w.winery_uuid);

        if (!winery) {
            // Country
            const countryQuery = `
                SELECT name
                FROM countries
                WHERE name = $1
            `;

            const countryResult = await connection.queryObject<{ name: string }>(countryQuery,
                [w.country]
            );

            if (countryResult.rowCount === 0) {
                throw `Invalid country: ${w.country}`;
            }
            
            // Location
            const locationQuery = `
                INSERT INTO locations (sub_region, region, country)
                VALUES ($1, $2, $3)
                ON CONFLICT (sub_region, region, country) 
                DO UPDATE SET id = locations.id
                RETURNING id
            `;

            const locationResult = await connection.queryObject<{ id: number }>(locationQuery,
                [
                    w.sub_region || "",
                    w.region || "",
                    w.country
                ]
            );
            const locationId = locationResult.rows[0].id;

            // Winery
            const wineryQuery = `
                INSERT INTO wineries (name, location_id)
                VALUES ($1, $2)
                ON CONFLICT (name)
                DO UPDATE SET id = wineries.id
                RETURNING id
            `;

            const wineryResult = await connection.queryObject<{ id: string }>(wineryQuery,
                [w.winery_name, locationId]
            );

            w.winery_id = wineryResult.rows[0].id;
        }

        // Wine Insertion
        const wineQuery = `
            INSERT INTO wines (
                name, year, grapes, abv, types, 
                winery_id, 
                price, volume, submitter_id
            ) VALUES (
                $1, $2, $3::text[], $4, $5::text[],
                $6, $7, $8, $9
            )
            RETURNING uuid;
        `;

        const result = await connection.queryObject<{ uuid: string }>(wineQuery,
            [
                w.name,
                w.year,
                w.grapes,
                w.abv,
                w.types,
                w.winery_id,
                w.price,
                w.volume,
                1  // submitter_id
            ]
        );

        await connection.queryObject('COMMIT');

        const uuid = result.rows[0].uuid;
        return Promise.resolve(uuid);
    } catch (error) {
        await connection.queryObject('ROLLBACK');
        return Promise.reject(error);
    } 
}

export async function getWineTypes(connection: PoolClient) : Promise<string[]> {
    try {
        const result = await connection.queryObject<string>(`
            SELECT type
            FROM types;
        `);

        return Promise.resolve(result.rows);
    } catch (error) {
        return Promise.reject(error);
    } 
}