import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const dataDir = path.resolve(process.cwd(), "data");
const file = path.join(dataDir, "smartroom.json");

const emptyDatabase = {
  users: [],
    rooms: [],
      devices: [],
        functions: [],
          scenes: [],
            automations: [],
              schedules: [],
                sensors: [],
                  esp32Nodes: [],
                    events: []
                    };

                    fs.mkdirSync(dataDir, { recursive: true });

                    if (!fs.existsSync(file)) {
                      fs.writeFileSync(
                          file,
                              JSON.stringify(emptyDatabase, null, 2)
                                );
                                }

                                let database = JSON.parse(
                                  fs.readFileSync(file, "utf8")
                                  );

                                  for (const key of Object.keys(emptyDatabase)) {
                                    if (!Array.isArray(database[key])) {
                                        database[key] = [];
                                          }
                                          }

                                          export function id(prefix = "id") {
                                            return `${prefix}_${crypto.randomUUID()}`;
                                            }

                                            export function save() {
                                              const temporaryFile = `${file}.tmp`;

                                                fs.writeFileSync(
                                                    temporaryFile,
                                                        JSON.stringify(database, null, 2)
                                                          );

                                                            fs.renameSync(temporaryFile, file);
                                                            }

                                                            export function table(name) {
                                                              return database[name];
                                                              }

                                                              export function add(name, value) {
                                                                database[name].push(value);
                                                                  save();

                                                                    return value;
                                                                    }

                                                                    export function update(name, itemId, patch) {
                                                                      const index = database[name].findIndex(
                                                                          item => item.id === itemId
                                                                            );

                                                                              if (index < 0) {
                                                                                  return null;
                                                                                    }

                                                                                      database[name][index] = {
                                                                                          ...database[name][index],
                                                                                              ...patch,
                                                                                                  updatedAt: Date.now()
                                                                                                    };

                                                                                                      save();

                                                                                                        return database[name][index];
                                                                                                        }

                                                                                                        export function remove(name, itemId) {
                                                                                                          const before = database[name].length;

                                                                                                            database[name] = database[name].filter(
                                                                                                                item => item.id !== itemId
                                                                                                                  );

                                                                                                                    if (database[name].length !== before) {
                                                                                                                        save();
                                                                                                                          }

                                                                                                                            return database[name].length !== before;
                                                                                                                            }

                                                                                                                            export function logEvent(event) {
                                                                                                                              database.events.unshift({
                                                                                                                                  id: id("evt"),
                                                                                                                                      timestamp: Date.now(),
                                                                                                                                          ...event
                                                                                                                                            });

                                                                                                                                              if (database.events.length > 2000) {
                                                                                                                                                  database.events.length = 2000;
                                                                                                                                                    }

                                                                                                                                                      save();
                                                                                                                                                      }