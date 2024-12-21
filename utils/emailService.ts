import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Hostinger's SMTP host
    port: 465, // Use 587 for TLS
    secure: true, // True for 465, false for other ports
    auth: {
        user: `${process.env.EMAIL_ID}`, // Your Hostinger email address
        pass: `${process.env.EMAIL_PASSWORD}`, // Your Hostinger email password
    },
});

// export const mailOptions = {
//     from: '"ZXDHIRU" <zxdhiru.dev@alljobguider.in>', // Sender's email address
//     to: 'dhiru6801@gmail.com', // Recipient's email address
//     subject: 'Test Email from Nodemailer',
//     text: 'Hello, this is a test email sent using Nodemailer and Hostinger!',
//     html: '<p>Hello, this is a test email sent using <b>Nodemailer</b> and Hostinger!</p>',
// };
