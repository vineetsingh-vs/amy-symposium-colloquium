import nodemailer from 'nodemailer';
import { MailInterface } from './mail.interface';
import config from "../../utils/config";

export default class MailService {
    private static instance: MailService;
    private transporter: nodemailer.Transporter;

    private constructor() { this.createConnection(); }
    //INTSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    //CREATE CONNECTION FOR LOCAL
    async createLocalConnection() {
        let account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
    }
    //CREATE CONNECTION FOR LIVE
    async createConnection() {
        this.transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: Number(config.smtpPort) ? Number(config.smtpPort) : 80,
            secure: true,
            auth: {
                user: config.smtpUserName,
                pass: config.smtpPassword,
            },
        });
    }
    //SEND MAIL
    async sendMail(
        requestId: string | number | string[],
        options: MailInterface
    ) {
        return await this.transporter
            .sendMail({
                from: `"colloquium435" ${config.smtpSender || options.from}`,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            .then((info: any) => {
                return info;
                console.log('sent')
            });
    }
    //VERIFY CONNECTION
    async verifyConnection() {
        return this.transporter.verify();
    }
    //CREATE TRANSPOTER
    getTransporter() {
        return this.transporter;
    }
}