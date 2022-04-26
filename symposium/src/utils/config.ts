import "dotenv-safe/config";
import fs from "fs";

var json: any = null;

const config = () => {
    if (json) return json;
    let file = fs.readFileSync("./config.json");
    json = JSON.parse(file.toString());
    if (json.useFS && json.useAWS)
        console.log(
            "Configuration file is set to use both local and aws file storage! Please change either useFS or useAWS to false in config.json"
        );
    return json;
};

export default {
    port: process.env.NODE_PORT,
    nodeEnv: process.env.NODE_ENV,
    postgresHost: process.env.POSTGRESQL_HOST,
    postgresUser: process.env.POSTGRESQL_USER,
    postgresPass: process.env.POSTGRESQL_PASSWORD,
    postgresDB: process.env.POSTGRESQL_DB,
    tmpFolder: config().tempFolder,
    usingFS: config().useFS,
    uploadFolder: config().uploadFolder,
    usingAWS: config().useAWS,
    awsBucket: config().awsBucket,
    awsRegion: config().awsRegion,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecret: process.env.AWS_SECRET_ACCESS_KEY,
} as const;
