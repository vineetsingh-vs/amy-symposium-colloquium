import "reflect-metadata";
// import cors from "cors";
import express from "express";
import fs from "fs";
// import routes from "./routes";
import config from "./config";
import connectDB from "./db";

const main = async () => {
    //
    // create repository
    // if (!fs.existsSync(config.tmpFolder)) {
        // fs.mkdirSync(config.tmpFolder, { recursive: true });
    // }
    // if (!fs.existsSync(config.uploadFolder)) {
        // fs.mkdirSync(config.uploadFolder, { recursive: true });
    // }

    //
    // database connection
    connectDB();

    //
    // express app setup and middleware
    const app = express();
    app.use(
        cors({
            origin: "*",
        })
    );

    //
    // routes
    app.use("/api/papers", routes);

    //
    // serve compiled frontend if production
    // if (config.nodeEnv == "production") {
        // let rootdir = path.resolve();
        // app.use(express.static(path.join(rootdir, "/frontend/build")));
        // app.get("*", (_req, res) => {
            // res.sendFile(path.resolve(rootdir, "client", "build", "index.html"));
        // });
    // } else {
        // // not production so backend and frontend on separate ports
        // app.get("/", (_, res) => {
            // res.send("API running");
        // });
    // }

    //
    // server startup
    const port = 4000;

    app.listen(port, "0.0.0.0", () => {
        console.log("server listening on " + port);
    });
};

main();
