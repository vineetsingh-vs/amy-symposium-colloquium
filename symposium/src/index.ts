import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import logger from "./loaders/logger";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import paperRoutes from "./routes/paper";
import commentRoutes from "./routes/comment";
import reviewRoutes from "./routes/review";
import config from "./utils/config";
import connectDB from "./utils/db";

const main = async () => {
    //
    // database connection
    connectDB();

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
    // routes
    app.use("/auth", authRoutes);
    app.use("/v1/users", userRoutes);
    app.use("/v1/papers", paperRoutes);
    app.use("/v1/comments", commentRoutes);
    app.use("/v1/reviews", reviewRoutes);

    //
    // serve compiled frontend if production
    if (config.nodeEnv == "production") {
        let rootdir = path.resolve();
        app.use(express.static(path.join(rootdir, "/frontend/build")));
        app.get("*", (_req, res) => {
            res.sendFile(path.resolve(rootdir, "client", "build", "index.html"));
        });
    } else {
        // not production so backend and frontend on separate ports
        app.get("/", (_, res) => {
            res.send("API Running :)");
        });
    }

    //
    // server startup
    const port = 4000;

    app.listen(port, "0.0.0.0", () => {
        console.log("server listening on " + port);
    });
};

main();
