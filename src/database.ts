import * as db from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import "jsr:@std/dotenv/load";

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

