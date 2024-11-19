import * as db from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import * as stdUUID from "jsr:@std/uuid";
import "jsr:@std/dotenv/load";
import * as utils from "../utils/db_utils.ts";

const db_pw = Deno.env.get("DB_PW");

const _localConfig : db.ClientOptions = 
{
  applicationName: "winespec",
  connection: {
    attempts: 1,
  },
  database: "content",
  hostname: "localhost",
  host_type: "tcp",
  password: "test_password",
  options: {
  },
  port: 5432,
  user: "test_user",
  tls: {
    enforce: false,
  },
};

const supabaseConfig : db.ClientOptions = 
{
  applicationName: "winespec",
  connection: {
    attempts: 1,
  },
  database: "postgres",
  hostname: "aws-0-eu-central-2.pooler.supabase.com",
  host_type: "tcp",
  password: db_pw,
  options: {
  },
  port: 6543,
  user: "postgres.zeentpqvalbivpfrqpkl",
  tls: {
    enforce: false,
  },
};

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  uuid: string;
  created_at: Date;
  updated_at: Date;
}

interface Wine {
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

interface CollectionTransaction {
  collection_id: string;
  wine_id : string;
  type: string;
  count: number;
  cost: number;
  timestamp: Date;
  created_at: Date;
  uuid: string;
}

export const dbClient = new db.Client(supabaseConfig);

// Create a database pool with three connections that are lazily established
export const pool = new db.Pool(supabaseConfig, 10, true);

export async function getUserFromId(connection: db.PoolClient, userId: number) : Promise<User> {
  try {
    // Create the table
    const result = await connection.queryObject<User>(`
      SELECT * FROM users
      WHERE id = ${userId}
    `);

    if (result.rowCount === undefined || result.rowCount < 1) throw "User not found";
    return Promise.resolve(result.rows[0]);
  } catch (error) {
    return Promise.reject(error);
  } 
}

export function filterUser(user: User) {
  return utils.removeIdField(user);
}

export async function getAllWines(connection: db.PoolClient) : Promise<Wine[]> { 
  try {
    const result = await connection.queryObject<Wine>(`
      SELECT * FROM wines
    `);

    return Promise.resolve(result.rows);
  } catch (error) {
    return Promise.reject(error);
  } 
}

export async function getWineFromUUID(connection: db.PoolClient, wineUUID: string) : Promise<Wine> {
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

export async function addWine(connection: db.PoolClient, _name: string) : Promise<boolean> {
  try {

    const _result = await connection.queryArray(`
      `);

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  } 
}