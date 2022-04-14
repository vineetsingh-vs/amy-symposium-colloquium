import config from "./config";
import fs from "fs";
import path from 'path';
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export const s3 = new S3Client({ region: config.awsRegion });

export const uploadFile = async (filePath: string, key: string) => {
    var params = {
        Bucket: config.awsBucket,
        Key: path.basename(key),
        Body: fs.createReadStream(filePath)
    }
    const data = await s3.send(new PutObjectCommand(params));
    return data;
};

export const downloadFile = async (filePath: string, key: string): Promise<string> => {
    var params = {
        Bucket: config.awsBucket!,
        Key: key
    };
    const streamToString = (stream: Readable): Promise<string> =>
        new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
            stream.on("error", reject);
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("binary")));
        });
        
    const data = await s3.send(new GetObjectCommand(params));
    const content = await streamToString(data.Body as Readable);
    return content;
};