export function logRequest(url: URL) : string {
    let params = "";
    if (url.searchParams.size > 0){
        params = `?${url.searchParams}`;
    } 
    return url.pathname + params;
}