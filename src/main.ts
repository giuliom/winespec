import { serveFile } from "jsr:@std/http/file-server";

// JSON data as a string
const wines = `
[
  { "name": "Cabernet Sauvignon", "year": 2015, "region": "Napa Valley" },
  { "name": "Pinot Noir", "year": 2018, "region": "Burgundy" },
  { "name": "Sauvignon Blanc", "year": 2017, "region": "Marlborough" },
  { "name": "Chianti", "year": 1989, "region": "Tuscany" },
  { "name": "Saperavi", "year": 1990, "region": "Kakheti" }
]
`;

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
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
    return new Response(wines, {
      headers: { "content-type": "application/json" },
    });
  }

  // Serve static files from the "public" directory
  if (req.method === "GET") {
    try {
        const path = `${url.pathname === "/" ? "/index.html" : url.pathname}`;
        console.log(path);
        return await serveFile(req, `./public${path}`);
    } catch {
        return new Response("404 Not Found", { status: 404 });
    }
  }

  return new Response("Not Found", { status: 404 });
}

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, handler);