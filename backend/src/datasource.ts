import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || process.env.PGHOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || process.env.PGUSER,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  database: process.env.DB_DATABASE || process.env.PGDATABASE,
  ssl: process.env.NODE_ENV === "production" || process.env.PGSSLMODE === "require" ? {
    rejectUnauthorized: false // For hosted databases like Heroku, Railway, etc.
  } : false,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});
