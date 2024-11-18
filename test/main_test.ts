import { assert, assertEquals } from "@std/assert";
import { dbClient, getWines, pool } from "../src/database.ts";

// TODO tests
Deno.test(function addTest() {
  assertEquals(2+3, 5);
});

Deno.test(async function databaseTest() {

    const connection = await pool.connect();
    const wines = await getWines(connection);

    assert(wines.length > 0);

    await pool.end();
    await dbClient.end();
});
