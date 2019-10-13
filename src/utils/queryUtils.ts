import queryString from "query-string";

export function parseQuery(query: string) {
    return queryString.parse(query);
}
