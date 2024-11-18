import * as db from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import "jsr:@std/dotenv/load";

const db_pw = Deno.env.get("DB_PW");

const localConfig : db.ClientOptions = 
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

const winesKeys = [
  "name",
  "year",
  "grape",
  "abv",
  "types",
  "winery",
  "region",
  "country",
  "price",
  "volume",
];

interface Wine {
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
}

const transactionKeys = [
  "count",
  "cost"
]

interface CollectionTransaction extends Wine {
  wine_id : string;
  count: number;
  cost: number;
}

export const dbClient = new db.Client(supabaseConfig);

// Create a database pool with three connections that are lazily established
export const pool = new db.Pool(supabaseConfig, 3, true);

export async function getWines(collection_id: Number) : Promise<CollectionTransaction[]> {
  // Connect to the database
  const connection = await pool.connect();
  try {
    // Create the table
    const result = await connection.queryObject<CollectionTransaction>(`
      SELECT ${winesKeys},${transactionKeys} FROM collection_transactions as ct
      FULL OUTER JOIN wines ON ct.wine_id = wines.id 
      WHERE collection_id = ${collection_id}
    `)
    return Promise.resolve(result.rows);
  } catch (error) {
    return Promise.reject(error);
  } finally {
    connection.release();
  }
}