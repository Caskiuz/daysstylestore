// Base de datos Postgres embebida para desarrollo local (solo Windows/dev).
// Uso: node scripts/local-db.mjs init  → crea DB, aplica esquema y seed
//      node scripts/local-db.mjs start → inicia el servidor postgres
//      node scripts/local-db.mjs stop  → lo detiene
import EmbeddedPostgres from "embedded-postgres";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), ".local-pg");
const DB_NAME = "daystylestore";

async function main() {
  const cmd = process.argv[2] || "init";
  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: "postgres",
    password: "postgres",
    port: 5432,
    persistent: true,
  });

  if (cmd === "stop") {
    await pg.stop();
    console.log("Postgres embebido detenido.");
    return;
  }

  if (cmd === "init") {
    await pg.initialise();
    await pg.start();
    try { await pg.createDatabase(DB_NAME); } catch { /* ya existe */ }
    console.log("✓ Postgres embebido iniciado y base", DB_NAME, "creada en el puerto 5432.");
    console.log("Mantén este proceso corriendo. En otra terminal: npm run db:push && npm run db:seed");
    setInterval(() => {}, 60000); // mantiene vivo el proceso
    return;
  }

  if (cmd === "start") {
    await pg.start();
    console.log("✓ Postgres embebido corriendo en el puerto 5432.");
    setInterval(() => {}, 60000);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
