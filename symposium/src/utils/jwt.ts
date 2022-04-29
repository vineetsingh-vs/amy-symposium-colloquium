import { sign } from "jsonwebtoken"
import config from "./config";

export const generateToken = (id: string) => {
    return sign({ id }, config.tokenSecret!, { algorithm: "HS256" });
}