import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
@Injectable()
export default class EmailService {
    private nodemailerTransport: Mail;

    constructor() {
        this.nodemailerTransport = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass,
            },
        });
    }

    sendMail(options: Mail.Options) {
        return this.nodemailerTransport.sendMail(options);
    }
}
