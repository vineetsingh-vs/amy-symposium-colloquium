import "dotenv-safe/config";
import { join } from "path";

export default {
    nodeEnv: process.env.NODE_ENV,
    tmpFolder: join("./", "files", "temp"),
    uploadFolder: join("./", "files", "uploads"),
    postgresHost: process.env.POSTGRESQL_HOST,
    postgresUser: process.env.POSTGRESQL_USER,
    postgresPass: process.env.POSTGRESQL_PASSWORD,
    postgresDB: process.env.POSTGRESQL_DB,
} as const;
