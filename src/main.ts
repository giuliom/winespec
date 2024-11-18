import { serveFile } from "jsr:@std/http/file-server";
import { getWines } from "./database.ts";

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  try {
    // HTML
    if (url.pathname === "/") {
      const html = await Deno.readTextFile("./public/index.html");
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

    // Content JSON
    if (url.pathname === "/api/content") {
      console.log("API: /content");

      const wines = await getWines(1);
      const jsonWines = JSON.stringify(wines);

      return new Response(jsonWines, {
        headers: { "content-type": "application/json" },
      });
    }

    // Serve static files from the "public" directory
    if (req.method === "GET") {
      try {
          const path = `${url.pathname === "/" ? "/index.html" : url.pathname}`;
          console.log(path);
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

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, handler);