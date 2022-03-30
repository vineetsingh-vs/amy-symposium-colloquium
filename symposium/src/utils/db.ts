import config from "./config";
import { User } from "../entities/User";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Paper } from "../models/Paper";
import { Tag } from "../models/Tag";

export default async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.postgresHost,
            username: config.postgresUser,
            password: config.postgresPass,
            database: config.postgresDB,
            entities: [User, Paper, Tag],
            synchronize: true,
        });
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
};
