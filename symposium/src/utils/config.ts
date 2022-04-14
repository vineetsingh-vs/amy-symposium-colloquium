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
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecret: process.env.AWS_SECRET_ACCESS_KEY,
    awsBucket: process.env.AWS_BUCKET_NAME,
    awsRegion: process.env.AWS_REGION,
} as const;
