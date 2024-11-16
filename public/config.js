export const config = {
    endpoint: globalThis.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://winespec.deno.dev'
};

export const API_URL = "/api";