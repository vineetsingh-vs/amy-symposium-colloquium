import "dotenv-safe/config";
import { join } from "path";

export default {
    nodeEnv: process.env.NODE_ENV,
    tmpFolder: join(__dirname, "files", "temp"),
    uploadFolder: join(__dirname, "files", "uploads"),
    postgresHost: process.env.POSTGRES_HOST,
    postgresUser: process.env.POSTGRES_USER,
    postgresPass: process.env.POSTGRES_PASSWORD,
    postgresDB: process.env.POSTGRES_DB,
} as const;
