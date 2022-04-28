import { Application } from "express";
import { emitter } from "../../src/emitter";

const testPlugin = {
    initPlugin: (app: Application) => {
        console.log("testPlugin init");

        //
        // set up event listeners
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
