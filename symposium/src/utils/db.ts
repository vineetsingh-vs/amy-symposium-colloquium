import config from "./config";
import "reflect-metadata";
import { createConnection } from "typeorm";

export default async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.postgresHost,
            username: config.postgresUser,
            password: config.postgresPass,
            database: config.postgresDB,
            entities: [],
            synchronize: true,
        });
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
};
