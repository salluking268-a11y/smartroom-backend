import crypto from "node:crypto";

import { config } from "./config.js";
import { table, id, add } from "./store.js";

function base64url(value) {
  return Buffer
      .from(value)
          .toString("base64url");
          }

          function decodeBase64url(value) {
            return Buffer.from(value, "base64url");
            }

            function sign(input) {
              return crypto
                  .createHmac("sha256", config.jwtSecret)
                      .update(input)
                          .digest("base64url");
                          }

                          export function hashPassword(password) {
                            const salt = crypto
                                .randomBytes(16)
                                    .toString("hex");

                                      const hash = crypto
                                          .scryptSync(password, salt, 64)
                                              .toString("hex");

                                                return `${salt}:${hash}`;
                                                }

                                                export function verifyPassword(password, stored) {
                                                  const [salt, expectedHex] =
                                                      String(stored).split(":");

                                                        if (!salt || !expectedHex) {
                                                            return false;
                                                              }

                                                                const actual = crypto
                                                                    .scryptSync(password, salt, 64)
                                                                        .toString("hex");

                                                                          const expected = Buffer.from(
                                                                              expectedHex,
                                                                                  "hex"
                                                                                    );

                                                                                      const actualBuffer = Buffer.from(
                                                                                          actual,
                                                                                              "hex"
                                                                                                );

                                                                                                  if (expected.length !== actualBuffer.length) {
                                                                                                      return false;
                                                                                                        }

                                                                                                          return crypto.timingSafeEqual(
                                                                                                              actualBuffer,
                                                                                                                  expected
                                                                                                                    );
                                                                                                                    }

                                                                                                                    export function createToken(user) {
                                                                                                                      const now = Math.floor(Date.now() / 1000);

                                                                                                                        const header = base64url(
                                                                                                                            JSON.stringify({
                                                                                                                                  alg: "HS256",
                                                                                                                                        typ: "JWT"
                                                                                                                                            })
                                                                                                                                              );

                                                                                                                                                const payload = base64url(
                                                                                                                                                    JSON.stringify({
                                                                                                                                                          sub: user.id,
                                                                                                                                                                email: user.email,
                                                                                                                                                                      iat: now,
                                                                                                                                                                            exp: now + 60 * 60 * 24 * 30
                                                                                                                                                                                })
                                                                                                                                                                                  );

                                                                                                                                                                                    const signature = sign(
                                                                                                                                                                                        `${header}.${payload}`
                                                                                                                                                                                          );

                                                                                                                                                                                            return `${header}.${payload}.${signature}`;
                                                                                                                                                                                            }

                                                                                                                                                                                            export function getUserFromToken(token) {
                                                                                                                                                                                              const parts = String(token || "").split(".");

                                                                                                                                                                                                if (parts.length !== 3) {
                                                                                                                                                                                                    return null;
                                                                                                                                                                                                      }

                                                                                                                                                                                                        const [header, payload, signature] = parts;

                                                                                                                                                                                                          const expectedSignature = sign(
                                                                                                                                                                                                              `${header}.${payload}`
                                                                                                                                                                                                                );

                                                                                                                                                                                                                  if (signature !== expectedSignature) {
                                                                                                                                                                                                                      return null;
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                          let decoded;

                                                                                                                                                                                                                            try {
                                                                                                                                                                                                                                decoded = JSON.parse(
                                                                                                                                                                                                                                      decodeBase64url(payload)
                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                            } catch {
                                                                                                                                                                                                                                                return null;
                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                    if (
                                                                                                                                                                                                                                                        decoded.exp &&
                                                                                                                                                                                                                                                            decoded.exp < Math.floor(Date.now() / 1000)
                                                                                                                                                                                                                                                              ) {
                                                                                                                                                                                                                                                                  return null;
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                      return (
                                                                                                                                                                                                                                                                          table("users").find(
                                                                                                                                                                                                                                                                                user => user.id === decoded.sub
                                                                                                                                                                                                                                                                                    ) || null
                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                      export function publicUser(user) {
                                                                                                                                                                                                                                                                                        return {
                                                                                                                                                                                                                                                                                            id: user.id,
                                                                                                                                                                                                                                                                                                email: user.email,
                                                                                                                                                                                                                                                                                                    name: user.name,
                                                                                                                                                                                                                                                                                                        createdAt: user.createdAt
                                                                                                                                                                                                                                                                                                          };
                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                          export function findUser(email) {
                                                                                                                                                                                                                                                                                                            return table("users").find(
                                                                                                                                                                                                                                                                                                                user =>
                                                                                                                                                                                                                                                                                                                      user.email.toLowerCase() ===
                                                                                                                                                                                                                                                                                                                            email.toLowerCase()
                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                              export function createUser({
                                                                                                                                                                                                                                                                                                                                email,
                                                                                                                                                                                                                                                                                                                                  name,
                                                                                                                                                                                                                                                                                                                                    password
                                                                                                                                                                                                                                                                                                                                    }) {
                                                                                                                                                                                                                                                                                                                                      const user = {
                                                                                                                                                                                                                                                                                                                                          id: id("usr"),
                                                                                                                                                                                                                                                                                                                                              email: email.toLowerCase(),
                                                                                                                                                                                                                                                                                                                                                  name: name || "SmartRoom User",
                                                                                                                                                                                                                                                                                                                                                      passwordHash: hashPassword(password),
                                                                                                                                                                                                                                                                                                                                                          createdAt: Date.now()
                                                                                                                                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                                                                                                                                              add("users", user);

                                                                                                                                                                                                                                                                                                                                                                return user;
                                                                                                                                                                                                                                                                                                                                                                }