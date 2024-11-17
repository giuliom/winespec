import { assert, assertEquals } from "@std/assert";
import { dbClient, getWines, pool } from "../src/database.ts";

// TODO tests
Deno.test(function addTest() {
  assertEquals(2+3, 5);
});

Deno.test(async function databaseTest() {

    const wines = await getWines(1);

    assert(wines.length > 0);

    pool.end()
});
