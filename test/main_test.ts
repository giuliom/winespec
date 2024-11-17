import { assert, assertEquals } from "@std/assert";
import { dbClient, getWines } from "../src/database.ts";

// TODO tests
Deno.test(function addTest() {
  assertEquals(2+3, 5);
});

Deno.test(async function databaseTest() {
    await dbClient.connect();

    const wines = await getWines();

    assert(wines.length > 0);

    dbClient.end();
});
