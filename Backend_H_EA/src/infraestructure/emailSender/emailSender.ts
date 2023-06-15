import * as nodemailer from "nodemailer";

export interface EmailService {
    sendEmail(sender: string, recipient: string, subject: string, body: string): Promise<void>;
  }

  export class NodemailerEmailService implements EmailService {
    private transporter: nodemailer.Transporter;
  
    constructor() {
      this.transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "grupo3ea.eetac@gmail.com",
          pass: "eVmGo3_4A"
        }
      });
    }
  
    async sendEmail(sender: string, recipient: string, subject: string, skelleton: string): Promise<void> {
      const mailOptions = {
        from: sender,
        to: recipient,
        subject: subject,
        text: skelleton
      };
  
      await this.transporter.sendMail(mailOptions);
    }
  }

  

  