// router.ts

// Define the type for a route handler.
// It takes a Request and an object of parameters, and returns a Response (or a Promise thereof).
export type Handler = (
    req: Request,
    params: Record<string, string>
  ) => Response | Promise<Response>;
  
  interface Route {
    method: string;
    path: string;
    handler: Handler;
    paramNames: string[];
    regex: RegExp;
  }
  
  export class Router {
    private routes: Route[] = [];
  
    /**
     * Register a new route with the router.
     *
     * @param method HTTP method (GET, POST, etc.)
     * @param path Route path. You can use parameters like `/user/:id`
     * @param handler Function to handle the request.
     */
    add(method: string, path: string, handler: Handler) {
      const { regex, paramNames } = this.pathToRegex(path);
      this.routes.push({
        method: method.toUpperCase(),
        path,
        handler,
        paramNames,
        regex,
      });
    }
  
    /**
     * Finds and calls the route handler for an incoming request.
     *
     * @param req The incoming HTTP Request.
     * @returns A Response from the matching handler or a 404 Response.
     */
    async route(req: Request): Promise<Response> {
      const url = new URL(req.url);
      const method = req.method.toUpperCase();
  
      for (const route of this.routes) {
        if (route.method === method) {
          const match = url.pathname.match(route.regex);
          if (match) {
            // Extract dynamic parameters from the URL.
            const params: Record<string, string> = {};
            route.paramNames.forEach((name, index) => {
              params[name] = match[index + 1];
            });
            return await route.handler(req, params);
          }
        }
      }
  
      return new Response("Not Found", { status: 404 });
    }
  
    /**
     * Converts a route path into a RegExp and extracts parameter names.
     *
     * @param path The route path (e.g., '/user/:id')
     * @returns An object containing the RegExp and an array of parameter names.
     */
    private pathToRegex(path: string): { regex: RegExp; paramNames: string[] } {
      const paramNames: string[] = [];
      // Replace route parameters (e.g., :id) with a regex group.
      const regexString = path.replace(/:([^\/]+)/g, (_: string, paramName: string) => {
        paramNames.push(paramName);
        return "([^\\/]+)";
      });
      // Anchor the regex to match the whole path.
      const regex = new RegExp(`^${regexString}$`);
      return { regex, paramNames };
    }
  }