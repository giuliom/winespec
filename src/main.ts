import { serveFile } from "jsr:@std/http/file-server";
import { dbClient, getWines, getWine, pool } from "./database.ts";
import { logRequest } from "../utils/logging.ts";

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

    // Wine HTML
    if (url.pathname === "/") {
      const html = await Deno.readTextFile("./public/wine.html");
      return new Response(html, {
        headers: { "content-type": "text/html" },
      });
    }
    
    // CSS
    if (url.pathname === "/style.css") {
      const css = await Deno.readTextFile("public/style.css");
      return new Response(css, {
        headers: { "content-type": "text/css" },
      })
    }

    // API Content
    if (url.pathname === "/api/content") {
      const connection = await pool.connect();
      try {
        const wines = await getWines(connection);
        const jsonWines = JSON.stringify(wines);

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

    // API Wine
    if (url.pathname === "/api/wine") {
      const wineUUID = url.searchParams.get("id");
      const connection = await pool.connect();
      
      try {
        if (!wineUUID) throw "Invalid UUID";
        const wine = await getWine(connection, wineUUID);
        const json = JSON.stringify(wine);

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