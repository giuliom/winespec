import { assert, assertEquals } from "@std/assert";
import { dbClient, pool } from "../src/database.ts";
import { getAllWines } from "../src/routes/wine.ts";

// TODO tests
Deno.test(function addTest() {
  assertEquals(2+3, 5);
});

Deno.test(async function databaseTest() {
  let connection;
  try {
    connection = await pool.connect();
    const wines = await getAllWines(connection);

    assert(wines.length > 0); 
  } finally {
    if (connection) {
      await connection.release();
    }
    await pool.end(); 
    await dbClient.end();
  }
});
