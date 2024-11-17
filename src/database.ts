import { Client, ClientOptions } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const config : ClientOptions = 
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


export const dbClient = new Client(config);

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
  "count",
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
  count: number;
}

export async function getWines() : Promise<Wine[]> {
  try {
    const result = await dbClient.queryObject<Wine>(`SELECT ${winesKeys} FROM wines`);
    return Promise.resolve(result.rows);
  } catch (error) {
    return Promise.reject(error);
  }
}