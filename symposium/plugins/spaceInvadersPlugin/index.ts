import express, { Application, Request, Response } from "express";
import { EventEmitter } from "events";
import path from "path";

const spaceInvadersPlugin = {
    //
    // initialize the plugin with the application and event emitter
    initPlugin: (app: Application, emitter: EventEmitter) => {
        console.log("spaceInvadersPlugin init");

        //
        // add a test route and handler
        app.use(express.static(__dirname + "/views"));
        app.get("/space", (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, "./views/index.html"));
        });
    },
};

export default spaceInvadersPlugin;
