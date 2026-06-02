const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");

const root = process.cwd();
const envLocal = path.join(root, ".env.local");
const envFile = path.join(root, ".env");

if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
}
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("ERROR: DATABASE_URL is required in .env.local or .env.");
  process.exit(1);
}

const sqlPath = path.join(root, "migrations", "create_tables.sql");
if (!fs.existsSync(sqlPath)) {
  console.error(`ERROR: Migration file not found at ${sqlPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, "utf8");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined,
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("✅ Tabelas criadas com sucesso.");
  } catch (error) {
    console.error("❌ Falha ao criar tabelas:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();