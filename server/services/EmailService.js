// Email Service (Single Responsibility - handles email sending only)
const emailConfig = require('../config/email.config');
const EmailTemplate = require('../templates/EmailTemplate');

class EmailService {
    constructor() {
        this.transporter = emailConfig.getTransporter();
    }

    // Send registration confirmation email
    async sendConfirmationEmail(registrationData) {
        try {
            const { email, teamName, programDisplay } = registrationData;

            console.log(`📧 Preparing to send email to: ${email}`); // ✅ Shows who will receive email

            // Generate HTML email using template
            const htmlEmail = EmailTemplate.generateConfirmationEmail(registrationData);

            // Generate plain text fallback
            const textEmail = EmailTemplate.generatePlainTextEmail(registrationData);

            const mailOptions = {
                from: `"${teamName}" <${process.env.EMAIL_USER}>`,
                to: email,  // ✅ This is the user's email from the form!
                subject: `✅ Registration Confirmed - ${programDisplay}`,
                html: htmlEmail,
                text: textEmail
            };

            console.log(`📮 Sending email FROM: ${process.env.EMAIL_USER} TO: ${email}`);

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${email} - Message ID: ${info.messageId}`);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('❌ Email sending error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify email service is working
    async verify() {
        return await emailConfig.verifyConnection();
    }
}

module.exports = new EmailService();
