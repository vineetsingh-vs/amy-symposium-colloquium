import { EventEmitter } from "events";
import { Application } from "express";
import { Paper } from "./entities/Paper";
import { Comment } from "./entities/Comment";
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
// strongly typed emitter factory
function createEmitter<T extends EventMap>(): Emitter<T> {
    return new EventEmitter();
}

type EventTypes = {
    testEvent: { message: string };
    paperCreated: { paper: Paper };
    paperUpdated: { paper: Paper };
    paperRequested: { req: Request; paper: Paper };
    commentCreated: { comment: Comment };
    commentUpdated: { comment: Comment };
    commentRequested: { req: Request; comment: Comment };
};

export const emitter = createEmitter<EventTypes>();
