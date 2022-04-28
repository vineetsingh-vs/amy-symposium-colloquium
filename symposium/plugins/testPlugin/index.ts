import { Application, Request, Response } from "express";
import { EventEmitter } from "events";

const testPlugin = {
    initPlugin: (app: Application, emitter: EventEmitter) => {
        console.log("testPlugin init");

        console.log(emitter);

        //
        // add a route and handler
        app.get("/test", (req: Request, res: Response) => {
            res.status(200).json({ message: "hello" });
        });

        //
        // set up event listeners
        emitter.on("testEvent", (args) => {
            console.log("emitter test: testEvent: ");
            console.log(args.message);
        });
        emitter.on("paperCreated", (args) => {
            console.log("emitter test: paper created: ");
            console.log(args.paper.title);
        });
        emitter.on("paperUpdated", (args) => {
            console.log("emitter test: paper updated: ");
            console.log(args.paper.title);
        });
        emitter.on("paperRequested", (args) => {
            console.log("emitter test: paper requested: ");
            console.log(args.req.params);
            console.log(args.paper.title);
        });
        emitter.on("commentCreated", (args) => {
            console.log("emitter test: comment created: ");
            console.log(args.comment.content);
        });
        emitter.on("commentRequested", (args) => {
            console.log("emitter test: comment requested: ");
            console.log(args.comment.content);
        });
        emitter.on("commentUpdated", (args) => {
            console.log("emitter test: comment updated: ");
            console.log(args.comment.content);
        });
    },
};

export default testPlugin;
