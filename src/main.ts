export function add(a: number, b: number): number {
  return a + b;
}

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

  return new Response("Not Found", { status: 404 });
}

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, handler);