import { serveFile } from "jsr:@std/http/file-server";
import { dbClient, pool } from "./database.ts";
import { logRequest } from "./utils/logging.ts";
import * as Winelib from "./routes/wine.ts";
import * as Winerylib from "./routes/winery.ts";

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  console.log(`Req: ${logRequest(url)}`);
  
  try {
    // Index HTML
    if (url.pathname === "/") {
      const html = await Deno.readTextFile("./public/index.html");
      return new Response(html, {
        headers: { "content-type": "text/html" },
      });
    }

    // API Content
    if (url.pathname === "/api/wines" && req.method === "GET") {
      const connection = await pool.connect();
      try {
        const wines = await Winelib.getAllWines(connection);
        const filteredWines = Winelib.filterWines(wines);
        const jsonWines = JSON.stringify(filteredWines);

      return new Response(jsonWines, {
        headers: { "content-type": "application/json" },
      });
      } catch (error) {
        console.error(error);
        return new Response(`${error}`, { status: 400 });
      } finally {
        connection.release();
      }
    }

    // API Wine Types
    if (url.pathname === "/api/wine/types" && req.method === "GET") {
      const connection = await pool.connect();
      try {
          const types: string[] = await Winelib.getWineTypes(connection);
          return new Response(JSON.stringify(types), {
              headers: { "content-type": "application/json" }
          });
      } catch (error) {
          return new Response(`Error: ${error}`, { status: 500 });
      } finally {
          connection.release();
      }
  }

    // API Wine Add
    if (url.pathname === "/api/wine/add" && req.method === "POST") {
      const connection = await pool.connect();
    
    try {
        const wineRequest: Winelib.Wine = await req.json();
        const wine = Winelib.createWine(wineRequest);
        const wineUUID = await Winelib.addWine(connection, wine);
        const responseData = {
          uuid: wineUUID,
          status: 200
        };

        return Response.json(responseData);
    } catch (error) {
        console.error('Error adding wine:', error);
        return new Response(`${error}`, { status: 400 });
    } finally {
        connection.release();
    }
    }

    // API Wine
    if (url.pathname === "/api/wine") {
      const wineUUID = url.searchParams.get("id");
      const connection = await pool.connect();
      
      try {
        if (!wineUUID) throw "Invalid UUID";
        const wine = await Winelib.getWineFromUUID(connection, wineUUID);
        const filtered = Winelib.filterWine(wine);
        const json = JSON.stringify(filtered);

      return new Response(json, {
        headers: { "content-type": "application/json" },
      });
      } catch (error) {
        console.error(error);
        return new Response(`${error}`, { status: 400 });
      } finally {
        connection.release();
      }
    }

    // API Winery
    if (url.pathname === "/api/winery") {
      const wineryUUID = url.searchParams.get("id");
      const connection = await pool.connect();
      
      try {
        if (!wineryUUID) throw "Invalid UUID";
        const winery = await Winerylib.getWineryFromUUID(connection, wineryUUID);
        const filtered = Winerylib.filterWinery(winery);
        const json = JSON.stringify(filtered);

      return new Response(json, {
        headers: { "content-type": "application/json" },
      });
      } catch (error) {
        console.error(error);
        return new Response(`${error}`, { status: 400 });
      } finally {
        connection.release();
      }
    }

    // Serve static files from the "public" directory
    if (req.method === "GET") {
      try {
          const path = `${url.pathname === "/" ? "/index.html" : url.pathname}`;
          return await serveFile(req, `./public${path}`);
      } catch(error) {
          return new Response(`404 Not Found: ${error}`, { status: 404 });
      }
    }
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 404 });
  } 
    
  return new Response(`Not found`, { status: 404 });
}

function sigIntHandler() {
  console.log("Server gracefully shutting down");
  pool.end();
  dbClient.end();
  Deno.exit();
}
Deno.addSignalListener("SIGINT", sigIntHandler);

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, handler);