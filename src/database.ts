import { Client, ClientOptions } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const config : ClientOptions = 
{
  applicationName: "winespec",
  connection: {
    attempts: 1,
  },
  database: "test",
  hostname: "localhost",
  host_type: "tcp",
  password: "password",
  options: {
    max_index_keys: "32",
  },
  port: 5432,
  user: "user",
  tls: {
    enforce: false,
  },
};


const client = new Client(config);
await client.connect();
await client.end();

async function sampleQuery() {
    const result = await client.queryArray("SELECT ID, NAME FROM WINES");
    console.log(result.rows); 
}