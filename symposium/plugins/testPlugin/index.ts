import { Application } from "express";
import { emitter } from "../../src/emitter";

const testPlugin = {
    //
    // initialize plugin
    initPlugin: (app: Application) => {
        //
        // set up event listeners
        emitter.on("paperCreated", (args) => {
            console.log("emitter: paper created: ");
            console.log(args.paper.title);
        });
    },
};

export default testPlugin;
