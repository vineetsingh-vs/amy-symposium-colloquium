import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import logger from "./loaders/logger";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import paperRoutes from "./routes/paper";
import commentRoutes from "./routes/comment";
import extraRoutes from "./routes/extra";
import config from "./utils/config";
import connectDB from "./utils/db";
import { existsSync, mkdirSync } from "fs";
import { errorHandler, notFound } from "./loaders/error";
import { eventEmitter } from "./emitter";

const main = async () => {
    //
    // setup file system if not using AWS
    if (config.usingFS) {
        if (!existsSync(config.tmpFolder)) {
            mkdirSync(config.tmpFolder, { recursive: true });
        }
        if (!existsSync(config.uploadFolder)) {
            mkdirSync(config.uploadFolder, { recursive: true });
        }
    }

    //
    // database connection
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    while (!(await connectDB())) {
        console.log("Connecting to database");
        await sleep(30000);
    }

    //
    // express app setup and middleware
    const app: Application = express();
    app.use(logger);
    app.use(express.json({ limit: "50mb" }));
    app.use(
        cors({
            origin: "*",
            allowedHeaders: "*",
        })
    );

    //
    // load all plugins
    eventEmitter.init();
    let emitter = eventEmitter.getEmitter();
    let pluginLoads: Promise<any>[] = [];
    config.plugins.forEach((pluginPath: string) => {
        pluginLoads.push(
            import(pluginPath).then((plugin) => {
                plugin.default.initPlugin(app, emitter);
            })
        );
    });
    await Promise.all(pluginLoads);

    //
    // routes
    emitter.emit("testEvent", { message: "skrt" });
    app.use("/v1/auth", authRoutes);
    app.use("/v1/users", userRoutes);
    app.use("/v1/papers", paperRoutes);
    app.use("/v1/comments", commentRoutes);
    app.use("/v1/extra", extraRoutes);

    app.use(errorHandler);
    app.use(notFound);

    //
    // server startup
    const port = Number(config.port) || 4000;

    app.listen(port, "0.0.0.0", () => {
        console.log("Server listening on " + port);
    });
};

main();
