import { EventEmitter } from "events";
import { Paper } from "./entities/Paper";
import { Request } from "express";

//
// EventEmitter types and interface
type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;
interface Emitter<T extends EventMap> {
    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
    emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

//
// emitter factory
function createEmitter<T extends EventMap>(): Emitter<T> {
    return new EventEmitter();
}

type EventTypes = {
    paperCreated: { paper: Paper };
    paperUpdated: { paper: Paper };
    paperRequested: { req: Request; paper: Paper };
};

export const emitter = createEmitter<EventTypes>();

// let x = 2;
// let y = "hello";
// emitter.emit("routes", { x, y });
// emitter.on("routes", (options) => {
// console.log(options.x);
// console.log(options.y);
// });
