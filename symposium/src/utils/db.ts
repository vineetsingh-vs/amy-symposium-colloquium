import config from "./config";
import { Comment } from "../entities/Comment";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Extra } from "../entities/Extra";
import { Paper } from "../entities/Paper";
import { Tag } from "../entities/Tag";
import { Version } from "../entities/Version";

export default async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.postgresHost,
            username: config.postgresUser,
            password: config.postgresPass,
            database: config.postgresDB,
            entities: [User, Paper, Review, Comment, Extra, Version],
            synchronize: true,
        });
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
};
