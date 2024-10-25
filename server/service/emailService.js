// EmailService.js
const path = require('path');
const fs = require('fs').promises;
const createGmailClient = require('../config/gmailClient');
const handlebars = require('handlebars');  // Handlebars import edildi


class EmailService {
    constructor() {
        this.gmailClient = null;
    }

    async createGmailClient() {
        if (this.gmailClient) {
            return this.gmailClient;
        }
        this.gmailClient = await createGmailClient();
        return this.gmailClient;
    }

    async loadTemplate(templateName, variables) {
        const templatePath = path.join(__dirname, `../assets/emailTemplates/${templateName}.hbs`);
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateContent);
        return template(variables);
    }

    async sendEmail(to, subject, htmlContent, attachments = []) {
        try {
            const gmail = await this.createGmailClient();
            const messageParts = [
                `From: "RoadMapGenerator" <${process.env.SMTP_USERNAME}>`,
                `To: ${to}`,
                `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`, // Subject için UTF-8 desteği
                'MIME-Version: 1.0',
                'Content-Type: multipart/related; boundary="foo_bar_baz"',
                '',
                '--foo_bar_baz',
                'Content-Type: text/html; charset="UTF-8"',
                '',
                htmlContent,
                '',
                ...attachments.map((attachment) => [
                    '--foo_bar_baz',
                    `Content-Type: ${attachment.type}; name="${attachment.filename}"`,
                    'Content-Transfer-Encoding: base64',
                    'Content-Disposition: attachment',
                    '',
                    attachment.content,
                    ''
                ].join('\n'))
            ].join('\n');

            const encodedMessage = Buffer.from(messageParts).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            const response = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            });

            if (response.status !== 200) {
                throw new Error(`Failed to send email. Status: ${response.status}`);
            }
            console.log('Email sent successfully');
        } catch (err) {
            console.error('Failed to send email:', err.message);
            throw new Error(`EmailService Error: ${err.message}`);
        }
    }

    async sendTemplateEmail(to, subject, templateName, variables, attachments = []) {
        const htmlContent = await this.loadTemplate(templateName, variables);
        await this.sendEmail(to, subject, htmlContent, attachments);
    }

    async sendWelcomeEmail(userEmail, username, resetPasswordLink) {
        const variables = {
            appName: process.env.APP_NAME,
            userEmail,
            username,
            resetPasswordLink
        };

        const attachments = [];

        await this.sendTemplateEmail(
            userEmail,
            `${process.env.APP_NAME} Uygulamasına Hoş Geldiniz!`,
            'welcome-email-template',
            variables,
            attachments
        );
    }

    // Yeni metod: Şifre sıfırlama maili gönderme
    async sendResetPasswordEmail(userEmail, username, resetPasswordLink) {
        const variables = {
            appName: process.env.APP_NAME,
            userEmail,
            username,
            resetPasswordLink
        };

        const attachments = [];

        await this.sendTemplateEmail(
            userEmail,
            'Şifre Sıfırlama İsteği',
            'reset-password-email-template', // Şifre sıfırlama e-posta şablonu
            variables,
            attachments
        );
    }
}


module.exports = new EmailService();
