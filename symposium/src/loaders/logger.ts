import {Request, Response, NextFunction} from "express"
import chalk from "chalk"

const getActualRequestDurationInMilliseconds = (start: [number, number] | undefined) => {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  };

let logger = (req: Request, res: Response, next: NextFunction) => {
    let currentDT = new Date();
    let fmtDate = currentDT.getFullYear() + "-" +
                 (currentDT.getMonth() + 1) + "-" +
                 currentDT.getDate() + "-" +
                 currentDT.getHours() + "-" +
                 currentDT.getMinutes() + "-" +
                 currentDT.getSeconds();
    const start = process.hrtime();
    const durMilliseconds = getActualRequestDurationInMilliseconds(start);
    let log = `[${chalk.blue(fmtDate)}] ${req.method}:${req.url} ${res.statusCode} ${chalk.red(durMilliseconds.toLocaleString() + "ms")}`;
    console.log(log)
    next();
}

export default logger