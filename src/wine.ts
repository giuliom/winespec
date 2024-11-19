import * as stdUUID from "jsr:@std/uuid";
import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import * as utils from "../utils/db_utils.ts";

export interface Wine {
    id: string;
    name: string;
    year: number;
    grape: string;
    abv: number;
    types: string[];
    winery: string;
    region: string;
    country: string;
    price: number;
    volume: number;
    uuid: string;
    submitter_id: number;
  }

export const requiredFields = ['name', 'year', 'grape', 'abv', 'type', 'winery', 
    'region', 'country', 'price', 'volume'];

export function createWine(data: any) : Wine {
    for (const field of requiredFields) {
        if (data[field] === undefined) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    return {
        id: '',
        name: data.name,
        year: parseInt(data.year),
        grape: data.grape,
        abv: parseFloat(data.abv),
        types: Array.isArray(data.type) ? data.type : [data.type],
        winery: data.winery,
        region: data.region,
        country: data.country,
        price: parseFloat(data.price),
        volume: parseFloat(data.volume),
        uuid: data.uuid ?? "",
        submitter_id: 0
    };
}    

export async function getAllWines(connection: PoolClient) : Promise<Wine[]> { 
    try {
        const result = await connection.queryObject<Wine>(`
        SELECT * FROM wines
        `);

        return Promise.resolve(result.rows);
    } catch (error) {
        return Promise.reject(error);
    } 
}

export async function getWineFromUUID(connection: PoolClient, wineUUID: string) : Promise<Wine> {
    try {
        if  (!stdUUID.validate(wineUUID)) throw "Invalid wine UUID";

        const result = await connection.queryObject<Wine>(`
        SELECT * FROM wines
        WHERE uuid = '${wineUUID}'
        `)

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
                name, year, grape, abv, types, 
                winery, region, country, 
                price, volume, submitter_id
            ) VALUES (
                '${w.name}', '${w.year}', '${w.grape}', '${w.abv}', ARRAY['${w.types.join(",")}']::text[],
                '${w.winery}', '${w.region}', '${w.country}', '${w.price}', '${w.volume}', 1
            )
        `;

        const result = await connection.queryObject<{ uuid: string }>(query);

        if (result.rows.length === 0) {
           // throw new Error("Failed to get inserted wine UUID");
        }

        const uuid = "";//result.rows[0].uuid;

        return Promise.resolve(uuid);
    } catch (error) {
        return Promise.reject(error);
    } 
}