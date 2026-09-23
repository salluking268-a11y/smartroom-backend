import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const envFile = path.join(root, ".env");

if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

          if (match && !process.env[match[1]]) {
                process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
                    }
                      }
                      }

                      export const config = {
                        host: process.env.HOST || "0.0.0.0",

                          port: Number(process.env.PORT || 8787),

                            jwtSecret:
                                process.env.SMARTROOM_JWT_SECRET ||
                                    "CHANGE_ME_SMARTROOM_SECRET",

                                      geminiApiKey:
                                          process.env.GEMINI_API_KEY || "",

                                            geminiModel:
                                                process.env.GEMINI_MODEL || "gemini-2.5-flash"
                                                };