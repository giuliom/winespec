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
  
  export async function addWine(connection: PoolClient, _name: string) : Promise<boolean> {
    try {
  
      const _result = await connection.queryArray(`
        `);
  
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    } 
  }