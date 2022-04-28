import "dotenv-safe/config";
import fs from "fs";

let file = fs.readFileSync("./config.json");
let config = JSON.parse(file.toString());
if (config.useFS && config.useAWS) {
    console.log("config has both useFS and useAWS set, please set only one");
}

export default {
    tmpFolder: config.tempFolder,
    usingFS: config.useFS,
    uploadFolder: config.uploadFolder,
    usingAWS: config.useAWS,
    awsBucket: config.awsBucket,
    awsRegion: config.awsRegion,
    plugins: config.plugins,
    port: process.env.NODE_PORT,
    nodeEnv: process.env.NODE_ENV,
    postgresHost: process.env.POSTGRESQL_HOST,
    postgresUser: process.env.POSTGRESQL_USER,
    postgresPass: process.env.POSTGRESQL_PASSWORD,
    postgresDB: process.env.POSTGRESQL_DB,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecret: process.env.AWS_SECRET_ACCESS_KEY,
} as const;
