import config from "./config";
import { Comment } from "../entities/Comment";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Paper } from "../entities/Paper";
import { Tag } from "../entities/Tag";
import { Extra } from "../entities/Extra";

export default async () => {
    try {
        await createConnection({
            type: "postgres",
            host: config.postgresHost,
            username: config.postgresUser,
            password: config.postgresPass,
            database: config.postgresDB,
            entities: [User, Paper, Tag, Review, Comment, Extra],
            synchronize: true,
        });
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
};
