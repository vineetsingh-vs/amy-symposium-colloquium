import config from "./config";
import "reflect-metadata";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { Version } from "../entities/Version";
import { createConnection } from "typeorm";
import { Paper } from "../entities/Paper";

export default async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.postgresHost,
            username: config.postgresUser,
            password: config.postgresPass,
            database: config.postgresDB,
            entities: [User, Paper, Version, Comment],
            synchronize: true,
        });
        console.log("Database connected");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
