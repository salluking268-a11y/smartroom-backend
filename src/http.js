import { URL } from "node:url";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS"
      };

      export function send(res, status, data) {
        const body = JSON.stringify(data);

          res.writeHead(status, {
              "Content-Type": "application/json; charset=utf-8",
                  "Cache-Control": "no-store",
                      ...corsHeaders
                        });

                          res.end(body);
                          }

                          export function noContent(res) {
                            res.writeHead(204, corsHeaders);
                              res.end();
                              }

                              export async function body(req) {
                                let raw = "";

                                  for await (const chunk of req) {
                                      raw += chunk;
                                        }

                                          if (!raw) {
                                              return {};
                                                }

                                                  try {
                                                      return JSON.parse(raw);
                                                        } catch {
                                                            return null;
                                                              }
                                                              }

                                                              export function route(req) {
                                                                const url = new URL(
                                                                    req.url,
                                                                        `http://${req.headers.host || "localhost"}`
                                                                          );

                                                                            return {
                                                                                path: url.pathname,
                                                                                    query: url.searchParams
                                                                                      };
                                                                                      }

                                                                                      export function authHeader(req) {
                                                                                        const match = String(req.headers.authorization || "")
                                                                                            .match(/^Bearer\s+(.+)$/i);

                                                                                              return match?.[1] || null;
                                                                                              }